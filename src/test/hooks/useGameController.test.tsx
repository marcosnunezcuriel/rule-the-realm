// @vitest-environment jsdom

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    act,
    createRef,
    useImperativeHandle,
} from "react";

import type { Ref } from "react";

import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";

import { useGameController } from "../../hooks/useGameController";

import {
    loadGame,
    saveGame,
} from "../../storage/gameStorage";

import type { SaveGame } from "../../types/saveGame";
import type { ModifierId } from "../../types/modifiers";

import { createSave } from "../helpers/createSave";
import { createStats } from "../helpers/createStats";

type Controller = ReturnType<typeof useGameController>;

const controllerRef = createRef<Controller>();

const day2EventIds = [
    "11", "12", "13",
    "14", "15", "16",
];

let root: Root | null = null;

function ignoreNotification() {}

// Componente auxiliar para probar el controlador
// sin renderizar toda la interfaz del juego.
function ControllerHarness({
    controllerRef,
}: {
    controllerRef: Ref<Controller>;
}) {
    const controller = useGameController(
        ignoreNotification,
        ignoreNotification,
        ignoreNotification,
        ignoreNotification,
        "king"
    );

    useImperativeHandle(
        controllerRef,
        () => controller,
        [controller]
    );

    return null;
}

function getController(): Controller {
    const controller = controllerRef.current;

    if (controller === null) {
        throw new Error(
            "El controlador no está montado."
        );
    }

    return controller;
}

async function mountController(save?: SaveGame) {
    if (save !== undefined) {
        saveGame(save);
    }

    const nextRoot = createRoot(
        document.createElement("div")
    );

    root = nextRoot;

    await act(async () => {
        nextRoot.render(
            <ControllerHarness
                controllerRef={controllerRef}
            />
        );
    });
}

async function unmountController() {
    const currentRoot = root;

    if (currentRoot === null) {
        return;
    }

    await act(async () => {
        currentRoot.unmount();
    });

    root = null;
}

// Ejecutar una acción y esperar a que React actualice
// el estado y los efectos de autoguardado.
async function runAction(
    action: (controller: Controller) => void
) {
    await act(async () => {
        action(getController());
    });
}

// Simular las dos fases del fundido entre pantallas.
async function finishTransition() {
    await runAction((controller) => {
        controller.handleScreenFadeEnd();
    });

    await runAction((controller) => {
        controller.handleScreenFadeEnd();
    });
}

// Simular la entrada y salida de una audiencia
// que no requiere tomar ninguna decisión.
async function completeAudience() {
    await runAction((controller) => {
        controller.handleVisitorAnimationEnd();
    });

    await runAction((controller) => {
        controller.handleContinue();
    });

    await runAction((controller) => {
        controller.handleVisitorAnimationEnd();
    });
}

describe("Flujo y recuperación de partidas", () => {
    beforeEach(() => {
        window.localStorage.clear();

        vi.stubGlobal(
            "IS_REACT_ACT_ENVIRONMENT",
            true
        );
    });

    afterEach(async () => {
        await unmountController();

        window.localStorage.clear();

        vi.unstubAllGlobals();
    });

    it.each([
        "treasury-warning",
        "treasury-recovery",
    ] as const)(
        "no omite la primera audiencia después de %s",
        async (specialAudience) => {
            const isRecovery =
                specialAudience === "treasury-recovery";

            const stats = createStats({
                gold: isRecovery ? 10 : -10,
            });

            const activeModifierIds: ModifierId[] =
                isRecovery ? ["indebted"] : [];

            await mountController(
                createSave({
                    screen: "summary",
                    stats,
                    closingStats: stats,
                    isClosing: true,
                    dayClosed: true,
                    audienceIndex: 10,
                    activeModifierIds,
                })
            );

            await runAction((controller) => {
                controller.handleNextDay();
            });

            await finishTransition();

            expect(getController().day).toBe(2);

            expect(
                getController().dialogueKey
            ).toBe(specialAudience);

            expect(
                loadGame()?.audienceIndex
            ).toBe(-1);

            await completeAudience();

            expect(
                getController().dialogueKey
            ).toBe("11");

            expect(
                loadGame()?.audienceIndex
            ).toBe(0);

            expect(
                loadGame()?.specialAudience
            ).toBeNull();

            expect(
                loadGame()?.activeModifierIds
            ).toEqual(
                isRecovery ? [] : ["indebted"]
            );
        }
    );

    it("recupera una derrota nocturna antes de su anuncio", async () => {
        const defeatedStats = createStats({
            gold: -50,
        });

        await mountController(
            createSave({
                screen: "summary",
                stats: defeatedStats,
                closingStats: createStats(),
                isClosing: true,
                dayClosed: true,
                audienceIndex: 10,
            })
        );

        await runAction((controller) => {
            controller.handleNextDay();
        });

        await finishTransition();

        expect(getController().day).toBe(2);

        expect(
            loadGame()?.dayEventIds
        ).toEqual([]);

        expect(
            loadGame()?.gameOverReason
        ).toBe("bankruptcy");

        // Simular una recarga del navegador.
        await unmountController();
        await mountController();

        expect(getController().day).toBe(2);

        expect(
            getController().dialogueKey
        ).toBe("defeat-bankruptcy");

        await completeAudience();
        await finishTransition();

        expect(
            getController().screen
        ).toBe("gameover");

        expect(
            loadGame()?.screen
        ).toBe("gameover");
    });

    it("no aplica dos veces la recompensa de la justa al recargar", async () => {
        const initialStats = createStats();

        await mountController(
            createSave({
                day: 2,
                screen: "joust",
                stats: initialStats,
                dayStartStats: initialStats,
                dayEventIds: day2EventIds,
                unlockedEventIds: ["2.1"],
            })
        );

        await runAction((controller) => {
            controller.handleVisitorAnimationEnd();
        });

        await runAction((controller) => {
            controller.handleDecision("yes");
        });

        const expectedStats = {
            ...initialStats,
            gold: initialStats.gold - 15,
            army: initialStats.army + 10,
        };

        expect(
            getController().stats
        ).toEqual(expectedStats);

        expect(
            loadGame()?.selectedDecision
        ).toBe("yes");

        // Terminar la audiencia, pero recargar antes
        // de que finalice el fundido hacia el trono.
        await runAction((controller) => {
            controller.handleContinue();
        });

        await runAction((controller) => {
            controller.handleVisitorAnimationEnd();
        });

        await unmountController();
        await mountController();

        expect(
            getController().screen
        ).toBe("joust");

        expect(
            getController().selectedDecision
        ).toBe("yes");

        expect(
            getController().stats
        ).toEqual(expectedStats);

        await runAction((controller) => {
            controller.handleVisitorAnimationEnd();
        });

        // Intentar repetir una decisión ya aplicada.
        await runAction((controller) => {
            controller.handleDecision("yes");
        });

        expect(
            getController().stats
        ).toEqual(expectedStats);

        await runAction((controller) => {
            controller.handleContinue();
        });

        await runAction((controller) => {
            controller.handleVisitorAnimationEnd();
        });

        await finishTransition();

        expect(getController().day).toBe(2);

        expect(
            getController().screen
        ).toBe("scene");

        expect(
            getController().dialogueKey
        ).toBe("11");

        expect(
            getController().stats
        ).toEqual(expectedStats);
    });

    it("no aplica dos veces los modificadores nocturnos al recargar", async () => {
        const initialStats = createStats();

        await mountController(
            createSave({
                day: 2,
                stats: initialStats,
                dayStartStats: initialStats,
                dayEventIds: day2EventIds,
                audienceIndex: day2EventIds.length,
                isClosing: true,
                activeModifierIds: [
                    "traveling-circus",
                ],
            })
        );

        await runAction((controller) => {
            controller.handleVisitorAnimationEnd();
        });

        await runAction((controller) => {
            controller.handleContinue();
        });

        const expectedStats = {
            ...initialStats,
            gold: initialStats.gold + 5,
            population: initialStats.population + 2,
            prestige: initialStats.prestige + 2,
        };

        expect(
            getController().stats
        ).toEqual(expectedStats);

        expect(
            loadGame()?.dayClosed
        ).toBe(true);

        // Recargar antes de que salga la consejera.
        await unmountController();
        await mountController();

        expect(
            getController().screen
        ).toBe("sleep");

        expect(
            getController().stats
        ).toEqual(expectedStats);

        await runAction((controller) => {
            controller.handleSleepFinished();
        });

        await finishTransition();

        expect(
            getController().screen
        ).toBe("summary");

        expect(
            getController().stats
        ).toEqual(expectedStats);
    });

    it.each([true, false])(
        "comienza el día 2 correctamente con torneo autorizado: %s",
        async (withJoust) => {
            await mountController(
                createSave({
                    screen: "summary",

                    isClosing: true,
                    dayClosed: true,
                    audienceIndex: 10,

                    unlockedEventIds: withJoust
                        ? ["2.1"]
                        : [],
                })
            );

            await runAction((controller) => {
                controller.handleNextDay();
            });

            // Todavía no debe avanzar la jornada
            // antes de que se produzca el fundido.
            expect(getController().day).toBe(1);

            await finishTransition();

            expect(getController().day).toBe(2);

            expect(
                getController().screen
            ).toBe(
                withJoust ? "joust" : "scene"
            );

            expect(
                getController().dialogueKey
            ).toBe(
                withJoust ? "2.1" : "11"
            );

            expect(
                getController().phase
            ).toBe("entering");

            const saved = loadGame();

            expect(saved?.day).toBe(2);

            expect(saved?.screen).toBe(
                withJoust ? "joust" : "scene"
            );

            expect(
                saved?.dayEventIds
            ).toEqual(day2EventIds);

            expect(
                saved?.dayClosed
            ).toBe(false);
        }
    );
    
    it("abre el epílogo durante el fundido sin avanzar de día", async () => {
        await mountController(
            createSave({
                day: 7,
                screen: "summary",

                dayClosed: true,
                isClosing: true,

                audienceIndex: 6,

                dayEventIds: [
                    "41", "42", "43",
                    "44", "45", "46",
                ],
            })
        );

        await runAction((controller) => {
            controller.handleNextDay();
        });

        expect(
            getController().screen
        ).toBe("summary");

        expect(
            getController().transitionStage
        ).toBe("darkening");

        expect(
            getController().fullScreenFade
        ).toBe(true);

        // Al oscurecerse completamente la pantalla,
        // se ejecuta el cambio de pantalla.
        await runAction((controller) => {
            controller.handleScreenFadeEnd();
        });

        expect(
            getController().screen
        ).toBe("chapter-ending");

        expect(
            getController().transitionStage
        ).toBe("lightening");

        expect(
            getController().day
        ).toBe(7);

        expect(
            loadGame()?.screen
        ).toBe("chapter-ending");

        // Finalizar el fundido.
        await runAction((controller) => {
            controller.handleScreenFadeEnd();
        });

        expect(
            getController().transitionStage
        ).toBe("idle");

        expect(
            getController().fullScreenFade
        ).toBe(false);

        // El capítulo II todavía no está disponible.
        await runAction((controller) => {
            controller.handleStartNextChapter();
        });

        expect(
            getController().transitionStage
        ).toBe("idle");

        expect(
            getController().day
        ).toBe(7);
    });

    it.each(["yes", "no"] as const)(
        "conserva la decisión del hermano al recargar: %s",
        async (decision) => {
            await mountController(
                createSave({
                    audienceIndex: 7,
                    unlockedEventIds: ["2.1"],
                })
            );

            expect(
                getController().dialogueKey
            ).toBe("8");

            await runAction((controller) => {
                controller.handleVisitorAnimationEnd();
            });

            await runAction((controller) => {
                controller.handleDecision(decision);
            });

            const expectedFlags =
                decision === "yes"
                    ? ["brother-is-advisor"]
                    : [];

            expect(
                loadGame()?.storyFlags
            ).toEqual(expectedFlags);

            expect(
                loadGame()?.unlockedEventIds
            ).toEqual(["2.1"]);

            expect(
                getController().withBrother
            ).toBe(decision === "yes");

            // Simular una recarga del navegador.
            await unmountController();
            await mountController();

            expect(
                getController().selectedDecision
            ).toBe(decision);

            expect(
                getController().withBrother
            ).toBe(decision === "yes");

            expect(
                loadGame()?.storyFlags
            ).toEqual(expectedFlags);
        }
    );
});
