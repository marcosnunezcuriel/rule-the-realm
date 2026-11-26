// @vitest-environment jsdom

// Comprueba la navegación, las notificaciones y la gestión del sonido de la aplicación.

import {
    act,
    createRef,
    useImperativeHandle,
} from "react";
import type { Ref } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import { soundEngine } from "../../audio/soundEngine";

import { useAppNavigation } from "../../hooks/app/useAppNavigation";
import { useGameNotifications } from "../../hooks/app/useGameNotifications";
import { useSoundSettings } from "../../hooks/app/useSoundSettings";
import { useGameAudio } from "../../hooks/game/useGameAudio";

import { loadAnthemUnlocked } from "../../storage/anthemStorage";
import {
    loadGame,
    saveGame,
} from "../../storage/gameStorage";
import { loadSoundSettings } from "../../storage/soundSettingsStorage";

import { createSave } from "../helpers/createSave";
import { createStats } from "../helpers/createStats";

// No reproducir audio real durante los tests.
vi.mock("../../audio/soundEngine", () => ({
    soundEngine: {
        configure: vi.fn(),
        unlock: vi.fn(),
        playEffect: vi.fn(),
        setAmbientActive: vi.fn(),
    },
}));

type AppHooks = {
    navigation: ReturnType<typeof useAppNavigation>;
    notifications: ReturnType<typeof useGameNotifications>;
    audio: ReturnType<typeof useSoundSettings>;
};

const apiRef = createRef<AppHooks>();

let root: Root;

function AppHarness({
    controllerRef,
}: {
    controllerRef: Ref<AppHooks>;
}) {
    const notifications =
        useGameNotifications();

    const navigation = useAppNavigation(
        notifications.clearNotifications
    );

    const audio = useSoundSettings(
        notifications.notifyAnthemUnlocked
    );

    useImperativeHandle(
        controllerRef,
        () => ({
            navigation,
            notifications,
            audio,
        }),
        [
            navigation,
            notifications,
            audio,
        ]
    );

    return null;
}

function mountApp() {
    act(() => {
        root.render(
            <AppHarness controllerRef={apiRef} />
        );
    });
}

function getApp(): AppHooks {
    if (apiRef.current === null) {
        throw new Error(
            "La aplicación no está montada."
        );
    }

    return apiRef.current;
}

function runAction(
    action: (app: AppHooks) => void
) {
    act(() => {
        action(getApp());
    });
}

function finishNavigation() {
    runAction(({ navigation }) => {
        navigation.handleNavigationFadeEnd();
    });

    runAction(({ navigation }) => {
        navigation.handleNavigationFadeEnd();
    });
}

type AudioInput =
    Parameters<typeof useGameAudio>[0];

function AudioHarness(input: AudioInput) {
    useGameAudio(input);
    return null;
}

function renderAudio(
    overrides: Partial<AudioInput> = {}
) {
    act(() => {
        root.render(
            <AudioHarness
                day={1}
                screen="scene"
                phase="entering"
                dialogueKey="1"
                isAudienceScreen={true}
                {...overrides}
            />
        );
    });
}

describe("Responsabilidades de la aplicación", () => {
    beforeEach(() => {
        window.localStorage.clear();

        vi.stubGlobal(
            "IS_REACT_ACT_ENVIRONMENT",
            true
        );

        vi.useFakeTimers();
        vi.clearAllMocks();

        root = createRoot(
            document.createElement("div")
        );
    });

    afterEach(() => {
        act(() => {
            root.unmount();
        });

        vi.useRealTimers();
        vi.unstubAllGlobals();

        window.localStorage.clear();
    });

    it("navega desde el menú hasta una nueva partida mediante fundidos", () => {
        mountApp();

        runAction(({ navigation }) => {
            navigation.startNewGame();
        });

        expect(
            getApp().navigation.view
        ).toBe("menu");

        expect(
            getApp().navigation.navigationStage
        ).toBe("darkening");

        finishNavigation();

        expect(
            getApp().navigation.view
        ).toBe("choose-monarch");

        runAction(({ navigation }) => {
            navigation.chooseMonarch("queen");
        });

        finishNavigation();

        expect(
            getApp().navigation.view
        ).toBe("intro");

        expect(
            getApp().navigation.monarch
        ).toBe("queen");

        runAction(({ navigation }) => {
            navigation.navigateTo("game");
        });

        finishNavigation();

        expect(
            getApp().navigation.view
        ).toBe("game");
    });

    it("solo sobrescribe la partida anterior tras confirmar", () => {
        saveGame(createSave());

        mountApp();

        runAction(({ navigation }) => {
            navigation.startNewGame();
        });

        expect(
            getApp().navigation.confirmNewGame
        ).toBe(true);

        runAction(({ navigation }) => {
            navigation.cancelNewGame();
        });

        expect(loadGame()).not.toBeNull();

        expect(
            getApp().navigation.confirmNewGame
        ).toBe(false);

        runAction(({ navigation }) => {
            navigation.startNewGame();
        });

        runAction(({ navigation }) => {
            navigation.confirmStartNewGame();
        });

        expect(loadGame()).toBeNull();

        finishNavigation();

        expect(
            getApp().navigation.view
        ).toBe("choose-monarch");

        expect(
            getApp().navigation.savedAvailable
        ).toBe(false);
    });

    it("recupera la partida y conserva el guardado al volver al menú", () => {
        saveGame(
            createSave({
                monarch: "queen",
            })
        );

        mountApp();

        runAction(({ navigation }) => {
            navigation.continueGame();
        });

        finishNavigation();

        expect(
            getApp().navigation.monarch
        ).toBe("queen");

        runAction(({ navigation }) => {
            navigation.navigateTo("menu");
        });

        finishNavigation();

        expect(loadGame()?.monarch).toBe("queen");

        expect(
            getApp().navigation.savedAvailable
        ).toBe(true);
    });

    it("descarta el guardado únicamente cuando se solicita", () => {
        saveGame(createSave());

        mountApp();

        runAction(({ navigation }) => {
            navigation.continueGame();
        });

        finishNavigation();

        runAction(({ navigation }) => {
            navigation.navigateTo("menu", true);
        });

        // El guardado permanece durante el oscurecimiento.
        expect(loadGame()).not.toBeNull();

        finishNavigation();

        expect(loadGame()).toBeNull();

        expect(
            getApp().navigation.savedAvailable
        ).toBe(false);
    });

    it("prioriza los avisos y reproduce su sonido al mostrarlos", () => {
        mountApp();

        runAction(({ notifications }) => {
            notifications.handleAchievementUnlocked(
                "hand-of-king"
            );

            notifications.handleStatsChanged(
                createStats(),
                createStats({ gold: 240 })
            );
        });

        expect(
            getApp().notifications.activeNotification?.kind
        ).toBe("stats");

        expect(
            soundEngine.playEffect
        ).toHaveBeenCalledTimes(1);

        expect(
            soundEngine.playEffect
        ).toHaveBeenLastCalledWith(
            "notification-stats"
        );

        runAction(({ notifications }) => {
            notifications.handleModifierChanged(
                "traveling-circus",
                "added"
            );
        });

        expect(
            getApp().notifications.activeNotification?.kind
        ).toBe("stats");

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(
            getApp().notifications.activeNotification?.kind
        ).toBe("modifier-added");

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(
            getApp().notifications.activeNotification?.kind
        ).toBe("achievement");

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(
            getApp().notifications.activeNotification
        ).toBeNull();

        expect(
            soundEngine.playEffect
        ).toHaveBeenCalledTimes(3);
    });

    it("limpia las notificaciones al regresar al menú", () => {
        mountApp();

        runAction(({ navigation }) => {
            navigation.navigateTo("game");
        });

        finishNavigation();

        runAction(({ notifications }) => {
            notifications.handleModifierChanged(
                "traveling-circus",
                "added"
            );
        });

        expect(
            getApp().notifications.activeNotification
        ).not.toBeNull();

        runAction(({ navigation }) => {
            navigation.navigateTo("menu");
        });

        finishNavigation();

        expect(
            getApp().notifications.activeNotification
        ).toBeNull();

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(
            soundEngine.playEffect
        ).toHaveBeenCalledTimes(1);
    });

    it("conserva las preferencias de sonido y desbloquea el himno una sola vez", () => {
        mountApp();

        runAction(({ audio }) => {
            audio.updateSoundSettings({
                masterVolume: 45,
                muted: true,
            });
        });

        expect(
            loadSoundSettings().masterVolume
        ).toBe(45);

        expect(
            loadSoundSettings().muted
        ).toBe(true);

        expect(
            soundEngine.configure
        ).toHaveBeenLastCalledWith(
            getApp().audio.soundSettings,
            false
        );

        runAction(({ audio }) => {
            audio.handleRewardUnlocked({
                kind: "music",
                track: "anthem",
            });

            audio.handleRewardUnlocked({
                kind: "music",
                track: "anthem",
            });
        });

        expect(loadAnthemUnlocked()).toBe(true);

        expect(
            getApp().audio.hymnUnlocked
        ).toBe(true);

        expect(
            getApp().notifications.activeNotification?.kind
        ).toBe("anthem-unlocked");

        expect(
            soundEngine.configure
        ).toHaveBeenLastCalledWith(
            getApp().audio.soundSettings,
            true
        );

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(
            getApp().notifications.activeNotification
        ).toBeNull();
    });

    it("evita repetir los sonidos de entrada y salida del visitante", () => {
        renderAudio();
        renderAudio();

        expect(
            soundEngine.playEffect
        ).toHaveBeenCalledTimes(1);

        expect(
            soundEngine.playEffect
        ).toHaveBeenLastCalledWith(
            "visitor-enter"
        );

        renderAudio({
            phase: "speaking",
        });

        renderAudio({
            phase: "exiting",
        });

        renderAudio({
            phase: "exiting",
        });

        expect(
            soundEngine.playEffect
        ).toHaveBeenCalledTimes(2);

        expect(
            soundEngine.playEffect
        ).toHaveBeenLastCalledWith(
            "visitor-exit"
        );
    });

    it("recupera el ambiente al desmontar la partida", () => {
        renderAudio({
            screen: "summary",
            phase: "waiting",
            isAudienceScreen: false,
        });

        expect(
            soundEngine.setAmbientActive
        ).toHaveBeenLastCalledWith(false);

        expect(
            soundEngine.playEffect
        ).toHaveBeenCalledWith("day-summary");

        act(() => {
            root.render(null);
        });

        expect(
            soundEngine.setAmbientActive
        ).toHaveBeenLastCalledWith(true);
    });
});
