// @vitest-environment jsdom

// Comprueba el motor integrado mediante recorridos completos, recargas y derrotas.

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

import { getDayEvents } from "../../game/progression/getDayEvents";

import { useGameController } from "../../hooks/game/useGameController";

import {
    loadGame,
    saveGame,
} from "../../storage/gameStorage";

import type { ModifierId } from "../../types/modifiers";
import type { MonarchRole } from "../../types/monarch";
import type { SaveGame } from "../../types/saveGame";

import { createSave } from "../helpers/createSave";
import { createStats } from "../helpers/createStats";

type Controller = ReturnType<typeof useGameController>;

const controllerRef = createRef<Controller>();

const day2EventIds = [
    "11", "12", "13",
    "14", "15", "16",
];

// Recorridos de integración del Capítulo I.
// Toda decisión no incluida en rejections será afirmativa.
const chapterRoutes = [
    {
        monarch: "king" as const,

        rejections: [
            "15.1",
            "22.1",
            "34",
            "12.2",
            "37",
            "42",
        ],

        days: [
            "1 2 3 4 5 6 7 8 9 10",
            "2.1 11 12 13 14 15 16",
            "11.1 15.1 17 18 19 20 21 22",
            "12.1 22.1 23 24 25 26 27 28",
            "22.3 26.1 29 30 31 32 33 34",
            "35 12.2 23.1 24.1 36 37 38 39 40",
            "11.2 12.3 13.1 14.1 30.1 36.1 37.1 41 42 43 44 45 46",
        ],

        finalStats: {
            gold: 362,
            prestige: 221,
            faith: 205,
            population: 175,
            army: 235,
        },

        finalModifiers: [
            "silk-road",
            "emerald-mine",
            "modern-windmills",
            "black-fever",
        ],
    },
    {
        monarch: "queen" as const,

        rejections: [
            "2",
            "3",
            "8",
            "11",
            "12",
            "13",
            "15",
            "22",
            "22.2",
            "24",
            "30",
            "34",
            "36",
            "42",
        ],

        days: [
            "1 2 3 4 5 6 7 8 9 10",
            "3.1 11 12 13 14 15 16",
            "15.2 17 18 19 20 21 22",
            "23 24 25 26 27 28",
            "22.2 26.1 29 30 31 32 33 34",
            "35 23.1 36 37 38 39 40",
            "14.1 30.2 36.2 41 42 43 44 45 46",
        ],

        finalStats: {
            gold: 406,
            prestige: 131,
            faith: 205,
            population: 105,
            army: 150,
        },

        finalModifiers: [
            "silk-road",
            "black-fever",
        ],
    },
];

let root: Root | null = null;

const onRewardUnlocked = vi.fn();
const onAchievementUnlocked = vi.fn();

function ignoreNotification() {}

// Componente auxiliar para probar el controlador
// sin renderizar toda la interfaz del juego.
function ControllerHarness({
    controllerRef,
    monarch,
}: {
    controllerRef: Ref<Controller>;
    monarch: MonarchRole;
}) {
    const controller = useGameController(
        onAchievementUnlocked,
        ignoreNotification,
        ignoreNotification,
        onRewardUnlocked,
        monarch
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

async function mountController(
    save?: SaveGame,
    monarch: MonarchRole = save?.monarch ?? "king"
) {
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
                monarch={monarch}
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

// Recuperar el guardado real producido por el controlador.
function requireSavedProgress(): SaveGame {
    const saved = loadGame();

    if (saved === null) {
        throw new Error(
            `Guardado inválido durante el día ${getController().day}, ` +
            `audiencia ${getController().dialogueKey}.`
        );
    }

    return saved;
}

// Completar los fundidos y cambios ambientales pendientes.
async function settleAudience() {
    if (
        getController().transitionStage === "darkening"
    ) {
        await finishTransition();
    }

    if (
        getController().phase === "transitioning"
    ) {
        await act(async () => {
            vi.advanceTimersByTime(1500);
        });
    }
}

describe("Flujo y recuperación de partidas", () => {
    beforeEach(() => {
        window.localStorage.clear();

        onRewardUnlocked.mockClear();

        onAchievementUnlocked.mockClear();

        vi.stubGlobal(
            "IS_REACT_ACT_ENVIRONMENT",
            true
        );
    });

    afterEach(async () => {
        await unmountController();

        vi.useRealTimers();

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

    it.each([true, false])(
        "finaliza la justa sin repetir consecuencias al recargar durante el fundido: %s",
        async (reloadDuringFade) => {
            const initialStats = createStats();

            await mountController(
                createSave({
                    day: 2,

                    screen: "special-scene",

                    specialEvent: {
                        id: "2.1",
                        completed: false,
                    },

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

            // Recargar mientras el acontecimiento sigue activo.
            await unmountController();
            await mountController();

            expect(
                getController().screen
            ).toBe("special-scene");

            expect(
                getController().selectedDecision
            ).toBe("yes");

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

            expect(
                loadGame()?.specialEvent
            ).toEqual({
                id: "2.1",
                completed: true,
            });

            expect(
                getController().transitionStage
            ).toBe("darkening");

            if (reloadDuringFade) {
                // Recuperar un acontecimiento ya completado.
                await unmountController();
                await mountController();
            } else {
                // Finalizar normalmente el fundido.
                await finishTransition();
            }

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

            expect(
                loadGame()?.specialEvent
            ).toBeNull();

            expect(
                getController().selectedDecision
            ).toBeNull();

            expect(
                getController().phase
            ).toBe("entering");
        }
    );

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
                withJoust ? "special-scene" : "scene"
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

            expect(
                saved?.specialEvent
            ).toEqual(
                withJoust
                    ? {
                        id: "2.1",
                        completed: false,
                    }
                    : null
            );

            expect(saved?.day).toBe(2);

            expect(saved?.screen).toBe(
                withJoust ? "special-scene" : "scene"
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

            // Simular una recarga del navegador.
            await unmountController();
            await mountController();

            expect(
                getController().selectedDecision
            ).toBe(decision);

            expect(
                loadGame()?.storyFlags
            ).toEqual(expectedFlags);

            const saved = loadGame();

            if (saved === null) {
                throw new Error(
                    "No se pudo recuperar la partida."
                );
            }

            // Comprobar la variante visual utilizando las
            // condiciones narrativas recuperadas del guardado.
            await unmountController();

            await mountController(
                createSave({
                    day: 2,

                    screen: "special-scene",

                    specialEvent: {
                        id: "2.1",
                        completed: false,
                    },

                    dayEventIds: day2EventIds,

                    unlockedEventIds:
                        saved.unlockedEventIds,

                    storyFlags:
                        saved.storyFlags,
                })
            );

            expect(
                getController().specialScene
            ).toEqual({
                id: "joust",

                background:
                    decision === "yes"
                        ? "/assets/backgrounds/joust-king-2.png"
                        : "/assets/backgrounds/joust-king.png",
            });
        }
    );

    it("notifica la recompensa musical al completar su acontecimiento", async () => {
        await mountController(
            createSave({
                day: 6,
                audienceIndex: 1,

                unlockedEventIds: [
                    "24.1",
                ],

                dayEventIds: [
                    "35", "24.1",
                    "36", "37", "38",
                    "39", "40",
                ],
            })
        );

        expect(
            getController().dialogueKey
        ).toBe("24.1");

        expect(
            onRewardUnlocked
        ).not.toHaveBeenCalled();

        await completeAudience();

        expect(
            onRewardUnlocked
        ).toHaveBeenCalledTimes(1);

        expect(
            onRewardUnlocked
        ).toHaveBeenCalledWith({
            kind: "music",
            track: "anthem",
        });

        expect(
            getController().dialogueKey
        ).toBe("36");

        await unmountController();
        await mountController();

        expect(
            onRewardUnlocked
        ).toHaveBeenCalledTimes(1);
    });

    it.each(chapterRoutes)(
        "completa el Capítulo I con $monarch sin perder ni repetir audiencias",
        async (route) => {
            vi.useFakeTimers({
                toFake: ["setTimeout", "clearTimeout"],
            });

            const monarch = route.monarch;

            const rejections = new Set(
                route.rejections
            );

            await mountController(
                undefined,
                monarch
            );

            expect(
                requireSavedProgress().monarch
            ).toBe(monarch);

            expect(
                getController().stats
            ).toEqual(createStats());

            for (
                let index = 0;
                index < route.days.length;
                index++
            ) {
                const day = index + 1;

                expect(getController().day).toBe(day);

                const expectedEvents =
                    route.days[index].split(" ");

                for (const eventId of expectedEvents) {
                    await settleAudience();

                    expect(
                        getController().dialogueKey,
                        `Audiencia incorrecta en el día ${day}`
                    ).toBe(eventId);

                    expect(
                        getController().phase
                    ).toBe("entering");

                    expect(
                        getController().gameOverReason
                    ).toBeNull();

                    expect(
                        requireSavedProgress().day
                    ).toBe(day);

                    if (eventId === "2.1") {
                        expect(
                            getController().screen
                        ).toBe("special-scene");

                        expect(
                            getController().specialScene?.background
                        ).toContain("joust-king-2.png");
                    } else {
                        expect(
                            getController().screen
                        ).toBe("scene");
                    }

                    // El circo todavía no afecta al fondo
                    // durante la jornada en que se autoriza.
                    if (eventId === "11") {
                        expect(
                            getController().backgroundMap.morning
                        ).not.toContain("-circus");
                    }

                    if (
                        eventId === "11.1" ||
                        eventId === "11.2"
                    ) {
                        expect(
                            getController().backgroundMap.morning
                        ).toContain("-circus");
                    }

                    // Entrada del visitante.
                    await runAction((controller) => {
                        controller.handleVisitorAnimationEnd();
                    });

                    expect(
                        getController().phase
                    ).toBe("speaking");

                    if (
                        getController().dialogue.responses
                    ) {
                        const answer =
                            rejections.has(eventId)
                                ? "no"
                                : "yes";

                        await runAction((controller) => {
                            controller.handleDecision(
                                answer
                            );
                        });

                        expect(
                            requireSavedProgress().selectedDecision
                        ).toBe(answer);

                        // Recuperar una decisión real antes
                        // de que termine su audiencia.
                        if (eventId === "8") {
                            const previous =
                                requireSavedProgress();

                            await unmountController();

                            await mountController(
                                undefined,
                                monarch
                            );

                            expect(
                                requireSavedProgress()
                            ).toEqual(previous);

                            await runAction((controller) => {
                                controller.handleVisitorAnimationEnd();
                            });

                            // Intentar cambiar una decisión
                            // que ya había sido aplicada.
                            await runAction((controller) => {
                                controller.handleDecision(
                                    answer === "yes"
                                        ? "no"
                                        : "yes"
                                );
                            });

                            expect(
                                requireSavedProgress()
                            ).toEqual(previous);
                        }
                    }

                    if (eventId === "45") {
                        expect(
                            getController().sceneVisualClassName
                        ).toBeUndefined();
                    }

                    // Finalizar el diálogo y la salida.
                    await runAction((controller) => {
                        controller.handleContinue();
                    });

                    expect(
                        getController().phase
                    ).toBe("exiting");

                    await runAction((controller) => {
                        controller.handleVisitorAnimationEnd();
                    });

                    requireSavedProgress();

                    await settleAudience();

                    if (eventId === "11.2") {
                        const saved =
                            requireSavedProgress();

                        expect(
                            saved.activeModifierIds
                        ).not.toContain("traveling-circus");

                        // El fondo se mantiene hasta que
                        // comience una nueva jornada.
                        expect(
                            saved.sceneModifierIds
                        ).toContain("traveling-circus");

                        expect(
                            getController().backgroundMap.morning
                        ).toContain("-circus");
                    }

                    if (eventId === "45") {
                        expect(
                            getController().sceneVisualClassName
                        ).toBe(
                            "throne-stage__visuals--black-fever"
                        );
                    }
                }

                // Cierre diario de la Consejera Real.
                expect(
                    getController().dialogueKey
                ).toBe("closing");

                expect(
                    getController().timeOfDay
                ).toBe("night");

                await completeAudience();

                await finishTransition();

                expect(
                    getController().screen
                ).toBe("sleep");

                expect(
                    requireSavedProgress().dayClosed
                ).toBe(true);

                // Descanso y resumen de jornada.
                await runAction((controller) => {
                    controller.handleSleepFinished();
                });

                await finishTransition();

                expect(
                    getController().screen
                ).toBe("summary");

                const endOfDay =
                    requireSavedProgress();

                expect(endOfDay.day).toBe(day);
                expect(endOfDay.dayClosed).toBe(true);

                // Recuperar el guardado al final de cada día.
                await unmountController();

                await mountController(
                    undefined,
                    monarch
                );

                expect(
                    requireSavedProgress()
                ).toEqual(endOfDay);

                // Avanzar al siguiente día o al epílogo.
                await runAction((controller) => {
                    controller.handleNextDay();
                });

                await finishTransition();
            }

            // Fin del Capítulo I.
            expect(getController().screen).toBe(
                "chapter-ending"
            );

            expect(getController().day).toBe(7);

            expect(
                getController().stats
            ).toEqual(route.finalStats);

            const saved = requireSavedProgress();

            expect(saved.activeModifierIds).toEqual(
                route.finalModifiers
            );

            expect(saved.storyFlags).toEqual(
                monarch === "king"
                    ? ["brother-is-advisor"]
                    : []
            );

            expect(saved.unlockedEventIds).toEqual(
                expect.arrayContaining([
                    "chapter2-bankers-claim",
                    "chapter2-hospitals",
                    "chapter2-pontiff-meeting",
                ])
            );

            expect(
                onRewardUnlocked
            ).toHaveBeenCalledTimes(
                monarch === "king" ? 1 : 0
            );

            if (monarch === "king") {
                expect(
                    onRewardUnlocked
                ).toHaveBeenCalledWith({
                    kind: "music",
                    track: "anthem",
                });
            }

            expect(
                onAchievementUnlocked
            ).toHaveBeenCalledWith("first-steps");

            expect(
                onAchievementUnlocked.mock.calls.filter(
                    ([id]) => id === "first-steps"
                )
            ).toHaveLength(1);

            // Recuperar también el progreso del epílogo.
            await runAction((controller) => {
                controller.setChapterEndingParagraphIndex(1);
            });

            await unmountController();

            await mountController(
                undefined,
                monarch
            );

            expect(
                getController().screen
            ).toBe("chapter-ending");

            expect(
                getController().chapterEndingParagraphIndex
            ).toBe(1);

            expect(
                getController().stats
            ).toEqual(route.finalStats);
        },
        15000
    );

    it.each([
        {
            reason: "bankruptcy",
            eventId: "1",
            day: 1,
            changes: { gold: -40 },
            answer: "yes",
        },
        {
            reason: "overthrown",
            eventId: "1",
            day: 1,
            changes: { prestige: 5 },
            answer: "no",
        },
        {
            reason: "religious-crisis",
            eventId: "4",
            day: 1,
            changes: { faith: 5 },
            answer: "no",
        },
        {
            reason: "abandoned",
            eventId: "17",
            day: 3,
            changes: { population: 20 },
            answer: "no",
        },
        {
            reason: "invasion",
            eventId: "3",
            day: 1,
            changes: { army: 5 },
            answer: "no",
        },
    ] as const)(
        "finaliza correctamente una partida por $reason",
        async ({
            reason,
            eventId,
            day,
            changes,
            answer,
        }) => {
            const stats = createStats(changes);

            const dayEventIds = getDayEvents(
                day,
                []
            ).map(
                (event) => event.id
            );

            const audienceIndex =
                dayEventIds.indexOf(eventId);

            expect(
                audienceIndex
            ).toBeGreaterThanOrEqual(0);

            await mountController(
                createSave({
                    day,
                    stats,
                    dayStartStats: stats,

                    dayEventIds,
                    audienceIndex,

                    activeModifierIds:
                        reason === "bankruptcy"
                            ? ["indebted"]
                            : [],
                })
            );

            expect(
                getController().dialogueKey
            ).toBe(eventId);

            // Entrada del visitante.
            await runAction((controller) => {
                controller.handleVisitorAnimationEnd();
            });

            // Decisión que provoca la derrota.
            await runAction((controller) => {
                controller.handleDecision(answer);
            });

            // El visitante termina su diálogo.
            await runAction((controller) => {
                controller.handleContinue();
            });

            await runAction((controller) => {
                controller.handleVisitorAnimationEnd();
            });

            expect(
                getController().gameOverReason
            ).toBe(reason);

            expect(
                getController().dialogueKey
            ).toBe(`defeat-${reason}`);

            expect(
                requireSavedProgress().specialAudience
            ).toBe("defeat");

            const defeatedStats =
                getController().stats;

            // Recargar antes de escuchar el anuncio.
            await unmountController();
            await mountController();

            expect(
                getController().dialogueKey
            ).toBe(`defeat-${reason}`);

            expect(
                getController().stats
            ).toEqual(defeatedStats);

            // Finalizar el anuncio de la Consejera Real.
            await completeAudience();

            await finishTransition();

            expect(
                getController().screen
            ).toBe("gameover");

            expect(
                getController().day
            ).toBe(day);

            expect(
                requireSavedProgress().gameOverReason
            ).toBe(reason);

            expect(
                onAchievementUnlocked
            ).not.toHaveBeenCalledWith(
                "first-steps"
            );
        }
    );
});
