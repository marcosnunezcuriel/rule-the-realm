import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import type { MouseEvent } from "react";

import MainMenu from "./components/screens/MainMenu";
import AchievementsScreen from "./components/screens/AchievementsScreen";
import WelcomeIntroduction from "./components/screens/WelcomeIntroduction";
import GameSession from "./components/screens/GameSession";
import SoundPanel from "./components/shared/SoundPanel";

import type { AchievementId } from "./data/achievements";

import {
    clearSavedGame,
    hasSavedGame,
} from "./storage/gameStorage";

import {
    unlockAchievement,
} from "./storage/achievementsStorage";

import {
    loadAnthemUnlocked,
    unlockAnthem,
} from "./storage/anthemStorage";

import {
    loadSoundSettings,
    saveSoundSettings,
} from "./storage/soundSettingsStorage";

import { soundEngine } from "./audio/soundEngine";

import { getNotificationEffect } from "./game/getNotificationEffect";
import { getStatDifferences } from "./game/getStatDifferences";
import { insertGameNotification } from "./game/insertGameNotification";

import type {
    SoundEffect,
    SoundSettings,
} from "./types/audio";

import type { KingdomValues } from "./types/stats";
import type { FadeStage } from "./types/game";
import type { ModifierId } from "./types/modifiers";

import type {
    GameNotification,
    ModifierChange,
} from "./types/notifications";

import "./styles/layout/Navigation.css";

type AppView =
    | "menu"
    | "achievements"
    | "intro"
    | "game";

function App() {
    const [view, setView] = useState<AppView>("menu");

    const [savedAvailable, setSavedAvailable] = useState(
        () => hasSavedGame()
    );

    const [confirmNewGame, setConfirmNewGame] =
        useState(false);

    const [navigationStage, setNavigationStage] =
        useState<FadeStage>("idle");

    const [navigationTarget, setNavigationTarget] =
        useState<AppView | null>(null);

    const [discardSaveOnMenu, setDiscardSaveOnMenu] =
        useState(false);

    // Preferencias de sonido independientes de las partidas.
    const [soundSettings, setSoundSettings] =
        useState(loadSoundSettings);

    const [soundPanelOpen, setSoundPanelOpen] =
        useState(false);

    // El logro del evento 24.1 desbloquea el himno.
    const [hymnUnlocked, setHymnUnlocked] = useState(
        loadAnthemUnlocked
    );

    useEffect(() => {
        saveSoundSettings(soundSettings);

        soundEngine.configure(
            soundSettings,
            hymnUnlocked
        );
    }, [soundSettings, hymnUnlocked]);

    function updateSoundSettings(
        changes: Partial<SoundSettings>
    ) {
        setSoundSettings((previous) => ({
            ...previous,
            ...changes,
        }));
    }

    // Capturar los clics de todos los botones del juego.
    function handleAppClick(
        event: MouseEvent<HTMLDivElement>
    ) {
        const target = event.target;

        if (!(target instanceof Element)) {
            return;
        }

        const button = target.closest("button");

        if (button === null || button.disabled) {
            return;
        }

        let effect: SoundEffect = "ui-click";

        if (
            button.classList.contains(
                "speech-bubble__choice--yes"
            )
        ) {
            effect = "decision-yes";
        } else if (
            button.classList.contains(
                "speech-bubble__choice--no"
            )
        ) {
            effect = "decision-no";
        } else if (
            button.classList.contains("speech-bubble__next") ||
            button.classList.contains(
                "narrative-parchment__button"
            )
        ) {
            effect = "dialogue-next";
        }

        soundEngine.unlock();
        soundEngine.playEffect(effect);
    }

    // Una sola cola para los tres tipos de notificación.
    const [notificationQueue, setNotificationQueue] =
        useState<GameNotification[]>([]);

    const nextNotificationId = useRef(0);

    const displayedSequenceRef =
        useRef<number | null>(null);

    function enqueueNotification(
        notification: GameNotification
    ) {
        const displayedSequence =
            displayedSequenceRef.current;

        setNotificationQueue((previous) => {
            return insertGameNotification(
                previous,
                notification,
                displayedSequence
            );
        });
    }

    function handleStatsChanged(
        previous: KingdomValues,
        next: KingdomValues
    ) {
        const changes = getStatDifferences(
            previous,
            next
        );

        if (Object.keys(changes).length === 0) {
            return;
        }

        nextNotificationId.current += 1;

        enqueueNotification({
            sequence: nextNotificationId.current,
            kind: "stats",
            changes,
        });
    }

    function handleModifierChanged(
        id: ModifierId,
        change: ModifierChange
    ) {
        nextNotificationId.current += 1;

        enqueueNotification({
            sequence: nextNotificationId.current,

            kind: change === "added"
                ? "modifier-added"
                : "modifier-removed",

            id,
        });
    }

    function handleAchievementUnlocked(
        id: AchievementId
    ) {
        if (!unlockAchievement(id)) {
            return;
        }

        nextNotificationId.current += 1;

        enqueueNotification({
            sequence: nextNotificationId.current,
            kind: "achievement",
            id,
        });
    }

    // El himno es una recompensa musical, no un logro.
    function handleAnthemUnlocked() {
        if (hymnUnlocked || !unlockAnthem()) {
            return;
        }

        setHymnUnlocked(true);

        nextNotificationId.current += 1;

        enqueueNotification({
            sequence: nextNotificationId.current,
            kind: "anthem-unlocked",
        });
    }

    const handleDismissNotification = useCallback(
        (sequence: number) => {
            setNotificationQueue((previous) => {
                if (previous[0]?.sequence !== sequence) {
                    return previous;
                }

                return previous.slice(1);
            });
        },
        []
    );

    const activeNotification =
        notificationQueue[0] ?? null;

    // Reproducir el sonido cuando aparece el aviso.
    // Nunca cuando está esperando en la cola.
    useEffect(() => {
        displayedSequenceRef.current =
            activeNotification?.sequence ?? null;

        if (activeNotification === null) {
            return;
        }

        soundEngine.playEffect(
            getNotificationEffect(activeNotification)
        );

        const timeoutId = window.setTimeout(() => {
            handleDismissNotification(
                activeNotification.sequence
            );
        }, 5000);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [
        activeNotification,
        handleDismissNotification,
    ]);

    function navigateTo(
        target: AppView,
        discardSave = false
    ) {
        if (navigationStage !== "idle") {
            return;
        }

        setDiscardSaveOnMenu(discardSave);
        setNavigationTarget(target);
        setNavigationStage("darkening");
    }

    function startNewGame() {
        if (savedAvailable) {
            setConfirmNewGame(true);
            return;
        }

        confirmStartNewGame();
    }

    function confirmStartNewGame() {
        clearSavedGame();

        setSavedAvailable(false);
        setConfirmNewGame(false);

        navigateTo("intro");
    }

    function continueGame() {
        if (!hasSavedGame()) {
            setSavedAvailable(false);
            return;
        }

        navigateTo("game");
    }

    function handleNavigationFadeEnd() {
        if (
            navigationStage === "darkening" &&
            navigationTarget !== null
        ) {
            if (navigationTarget === "menu") {
                setNotificationQueue([]);

                if (discardSaveOnMenu) {
                    clearSavedGame();
                    setSavedAvailable(false);
                } else {
                    setSavedAvailable(
                        hasSavedGame()
                    );
                }
            }

            setView(navigationTarget);
            setNavigationStage("lightening");

            return;
        }

        if (navigationStage === "lightening") {
            setNavigationStage("idle");
            setNavigationTarget(null);
            setDiscardSaveOnMenu(false);
        }
    }

    const navigationFadeClassName = [
        "navigation-fade",

        navigationStage === "darkening"
            ? "navigation-fade--visible"
            : "",

        navigationStage !== "idle"
            ? "navigation-fade--active"
            : "",
    ].filter(Boolean).join(" ");

    return (
        <div
            className="app"
            onPointerDownCapture={() => {
                soundEngine.unlock();
            }}
            onKeyDownCapture={() => {
                soundEngine.unlock();
            }}
            onClickCapture={handleAppClick}
        >
            {view === "menu" ? (
                <MainMenu
                    hasSave={savedAvailable}
                    showNewGameConfirmation={confirmNewGame}
                    onNewGame={startNewGame}
                    onContinue={continueGame}
                    onAchievements={() => {
                        navigateTo("achievements");
                    }}
                    onSoundSettings={() => {
                        setSoundPanelOpen(true);
                    }}
                    onConfirmNewGame={
                        confirmStartNewGame
                    }
                    onCancelNewGame={() => {
                        setConfirmNewGame(false);
                    }}
                />
            ) : view === "achievements" ? (
                <AchievementsScreen
                    onBack={() => {
                        navigateTo("menu");
                    }}
                />
            ) : view === "intro" ? (
                <WelcomeIntroduction
                    onFinish={() => {
                        navigateTo("game");
                    }}
                />
            ) : (
                <GameSession
                    onOpenMenu={() => {
                        navigateTo("menu");
                    }}
                    onGameOverMenu={() => {
                        navigateTo("menu", true);
                    }}
                    onSoundSettings={() => {
                        setSoundPanelOpen(true);
                    }}
                    onAchievementUnlocked={
                        handleAchievementUnlocked
                    }
                    onAnthemUnlocked={
                        handleAnthemUnlocked
                    }
                    onModifierChanged={
                        handleModifierChanged
                    }
                    onStatsChanged={
                        handleStatsChanged
                    }
                    notification={activeNotification}
                />
            )}

            {soundPanelOpen && (
                <SoundPanel
                    settings={soundSettings}
                    hymnUnlocked={hymnUnlocked}
                    onChange={updateSoundSettings}
                    onClose={() => {
                        setSoundPanelOpen(false);
                    }}
                />
            )}

            <div
                className={navigationFadeClassName}
                aria-hidden="true"
                onTransitionEnd={(event) => {
                    if (
                        event.target === event.currentTarget &&
                        event.propertyName === "opacity"
                    ) {
                        handleNavigationFadeEnd();
                    }
                }}
            />
        </div>
    );
}

export default App;
