import { describe, expect, it } from "vitest";

import { getEventById } from "../../../data/registries/eventRegistry";

import { planAudienceCompletion } from "../../../game/audiences/audienceActions";
import { getDecisionConsequences } from "../../../game/consequences/getDecisionConsequences";
import { getEventCompletionConsequences } from "../../../game/consequences/getEventCompletionConsequences";
import { createGameState } from "../../../game/state/createGameState";
import { gameReducer } from "../../../game/state/gameReducer";
import type { GameAction } from "../../../game/state/gameReducer";

import type { ModifierId } from "../../../types/modifiers";

import { createSave } from "../../helpers/createSave";
import { createStats } from "../../helpers/createStats";

const day2EventIds = [
    "11", "12", "13",
    "14", "15", "16",
];

describe("Actualizaciones del estado de partida", () => {
    it("cambia la fase visual sin modificar el progreso", () => {
        const initial = createGameState("king");

        const next = gameReducer(initial, {
            type: "SET_PHASE",
            phase: "speaking",
        });

        expect(next.phase).toBe("speaking");

        expect(next.progress).toBe(
            initial.progress
        );

        expect(initial.phase).toBe("entering");
    });

    it("aplica una decisión y evita repetir sus consecuencias", () => {
        const event = getEventById("2");

        if (!event) {
            throw new Error("Falta el evento 2");
        }

        const initial = gameReducer(
            createGameState(
                "king",
                createSave({
                    audienceIndex: 1,
                })
            ),
            {
                type: "SET_PHASE",
                phase: "speaking",
            }
        );

        const consequences = getDecisionConsequences(
            event,
            "yes",
            initial.progress.stats
        );

        const action: GameAction = {
            type: "MAKE_DECISION",
            decision: "yes",

            changes: {
                stats:
                    consequences.nextStats ??
                    initial.progress.stats,

                activeModifierIds:
                    initial.progress.activeModifierIds,

                pendingTreasuryWarning:
                    consequences.showTreasuryWarning,

                unlocks: consequences.unlocks,

                addStoryFlags:
                    consequences.addStoryFlags,

                removeStoryFlags:
                    consequences.removeStoryFlags,
            },
        };

        const next = gameReducer(
            initial,
            action
        );

        expect(
            next.progress.selectedDecision
        ).toBe("yes");

        expect(
            next.progress.stats.gold
        ).toBe(initial.progress.stats.gold - 20);

        expect(
            next.progress.stats.prestige
        ).toBe(initial.progress.stats.prestige + 5);

        expect(
            next.progress.unlockedEventIds
        ).toContain("2.1");

        // Una segunda aplicación no modifica el estado.
        expect(
            gameReducer(next, action)
        ).toBe(next);

        // El estado anterior permanece intacto.
        expect(
            initial.progress.selectedDecision
        ).toBeNull();

        expect(
            initial.progress.stats
        ).toEqual(createStats());
    });

    it("aplica una recompensa al completar una audiencia y avanza", () => {
        const event = getEventById("15.2");

        if (!event) {
            throw new Error("Falta el evento 15.2");
        }

        const initial = gameReducer(
            createGameState(
                "king",
                createSave({
                    day: 3,

                    unlockedEventIds: [
                        "15.2",
                    ],

                    dayEventIds: [
                        "15.2", "17", "18",
                        "19", "20", "21", "22",
                    ],
                })
            ),
            {
                type: "SET_PHASE",
                phase: "exiting",
            }
        );

        const completion =
            getEventCompletionConsequences(
                event,
                initial.progress.stats
            );

        const action: GameAction = {
            type: "COMPLETE_AUDIENCE",

            changes: {
                stats:
                    completion.nextStats ??
                    initial.progress.stats,

                activeModifierIds:
                    initial.progress.activeModifierIds,

                pendingTreasuryWarning:
                    completion.showTreasuryWarning,

                unlocks: completion.unlocks,

                addStoryFlags:
                    completion.addStoryFlags,

                removeStoryFlags:
                    completion.removeStoryFlags,
            },

            exit: {
                kind: "next-audience",
                index: 1,
                phase: "entering",
                clearSpecialAudience: false,
            },
        };

        const next = gameReducer(
            initial,
            action
        );

        expect(
            next.progress.stats.gold
        ).toBe(initial.progress.stats.gold + 15);

        expect(
            next.progress.stats.army
        ).toBe(initial.progress.stats.army + 5);

        expect(
            next.progress.audienceIndex
        ).toBe(1);

        expect(next.phase).toBe("entering");

        expect(
            gameReducer(next, action)
        ).toBe(next);
    });

    it("aplica los modificadores nocturnos una sola vez", () => {
        const initial = gameReducer(
            createGameState(
                "king",
                createSave({
                    isClosing: true,

                    audienceIndex: 10,

                    activeModifierIds: [
                        "traveling-circus",
                    ],
                })
            ),
            {
                type: "SET_PHASE",
                phase: "speaking",
            }
        );

        const closed = gameReducer(
            initial,
            {
                type: "CONTINUE",
            }
        );

        expect(
            closed.progress.dayClosed
        ).toBe(true);

        expect(
            closed.progress.closingStats
        ).toEqual(initial.progress.stats);

        expect(
            closed.progress.stats
        ).toEqual({
            ...initial.progress.stats,

            gold:
                initial.progress.stats.gold + 5,

            population:
                initial.progress.stats.population + 2,

            prestige:
                initial.progress.stats.prestige + 2,
        });

        expect(
            closed.progress.modifierReport.appliedIds
        ).toEqual(["traveling-circus"]);

        expect(closed.phase).toBe("exiting");

        expect(
            gameReducer(closed, {
                type: "CONTINUE",
            })
        ).toBe(closed);

        // Incluso si se vuelve a mostrar la consejera,
        // el cierre económico no se repite.
        const speaking = gameReducer(
            closed,
            {
                type: "SET_PHASE",
                phase: "speaking",
            }
        );

        expect(
            gameReducer(speaking, {
                type: "CONTINUE",
            })
        ).toBe(speaking);
    });

    it("prepara una nueva jornada conservando el progreso", () => {
        const initial = createGameState(
            "king",
            createSave({
                screen: "summary",

                dayClosed: true,
                isClosing: true,
                audienceIndex: 10,

                stats: createStats({
                    gold: 200,
                }),

                selectedDecision: null,

                unlockedEventIds: [
                    "3.1",
                ],

                activeModifierIds: [
                    "traveling-circus",
                ],
            })
        );

        const next = gameReducer(
            initial,
            {
                type: "START_DAY",
            }
        );

        expect(next.progress.day).toBe(2);
        expect(next.progress.screen).toBe("scene");

        expect(
            next.progress.dayEventIds
        ).toEqual([
            "3.1",
            ...day2EventIds,
        ]);

        expect(
            next.progress.stats
        ).toEqual(initial.progress.stats);

        expect(
            next.progress.dayStartStats
        ).toEqual(initial.progress.stats);

        expect(
            next.progress.sceneModifierIds
        ).toEqual(["traveling-circus"]);

        expect(
            next.progress.unlockedEventIds
        ).toEqual(["3.1"]);

        expect(
            next.progress.dayClosed
        ).toBe(false);

        expect(
            next.progress.isClosing
        ).toBe(false);

        expect(
            next.progress.audienceIndex
        ).toBe(0);

        expect(
            next.progress.closingStats
        ).toBeNull();

        expect(next.phase).toBe("waiting");

        // No se puede iniciar dos veces la misma jornada.
        expect(
            gameReducer(next, {
                type: "START_DAY",
            })
        ).toBe(next);

        expect(initial.progress.day).toBe(1);
    });

    it.each([
        "treasury-warning",
        "treasury-recovery",
    ] as const)(
        "prepara correctamente la audiencia inicial %s",
        (specialAudience) => {
            const isRecovery =
                specialAudience === "treasury-recovery";

            const activeModifierIds: ModifierId[] =
                isRecovery
                    ? ["indebted"]
                    : [];

            const initial = createGameState(
                "king",
                createSave({
                    screen: "summary",

                    dayClosed: true,

                    stats: createStats({
                        gold: isRecovery ? 10 : -10,
                    }),

                    activeModifierIds,
                })
            );

            const next = gameReducer(
                initial,
                {
                    type: "START_DAY",
                }
            );

            expect(
                next.progress.specialAudience
            ).toBe(specialAudience);

            expect(
                next.progress.audienceIndex
            ).toBe(-1);

            expect(
                next.progress.dayEventIds
            ).toEqual(day2EventIds);
        }
    );

    it("prepara la derrota sin cargar acontecimientos normales", () => {
        const initial = createGameState(
            "king",
            createSave({
                screen: "summary",

                dayClosed: true,

                stats: createStats({
                    gold: -50,
                }),
            })
        );

        const next = gameReducer(
            initial,
            {
                type: "START_DAY",
            }
        );

        expect(next.progress.day).toBe(2);

        expect(
            next.progress.specialAudience
        ).toBe("defeat");

        expect(
            next.progress.gameOverReason
        ).toBe("bankruptcy");

        expect(
            next.progress.dayEventIds
        ).toEqual([]);

        expect(
            next.progress.audienceIndex
        ).toBe(-1);
    });

    it("comienza la justa y regresa al trono sin avanzar de día", () => {
        const initial = createGameState(
            "king",
            createSave({
                screen: "summary",

                dayClosed: true,

                unlockedEventIds: [
                    "2.1",
                ],

                storyFlags: [
                    "brother-is-advisor",
                ],
            })
        );

        const joust = gameReducer(
            initial,
            {
                type: "START_DAY",
            }
        );

        expect(joust.progress.day).toBe(2);

        expect(
            joust.progress.storyFlags
        ).toEqual(["brother-is-advisor"]);

        expect(
            joust.progress.screen
        ).toBe("special-scene");

        expect(
            joust.progress.specialEvent
        ).toEqual({
            id: "2.1",
            completed: false,
        });

        expect(
            joust.progress.dayEventIds
        ).toEqual(day2EventIds);

        // No se puede finalizar un escenario antes de
        // completar su acontecimiento.
        expect(
            gameReducer(joust, {
                type: "FINISH_SPECIAL_SCENE",
            })
        ).toBe(joust);

        const exiting = {
            ...joust,
            phase: "exiting" as const,
        };

        const completion = planAudienceCompletion(
            exiting,
            {
                currentAudience: getEventById("2.1"),
                morningCount: 1,
                timeOfDay: "morning",
            }
        );

        if (completion === null) {
            throw new Error(
                "No se pudo completar el escenario especial."
            );
        }

        const completed = gameReducer(
            exiting,
            completion.action
        );

        expect(
            completed.progress.specialEvent
        ).toEqual({
            id: "2.1",
            completed: true,
        });

        const throne = gameReducer(
            completed,
            {
                type: "FINISH_SPECIAL_SCENE",
            }
        );

        expect(
            throne.progress.specialEvent
        ).toBeNull();

        expect(throne.progress.day).toBe(2);

        expect(
            throne.progress.screen
        ).toBe("scene");

        expect(
            throne.progress.audienceIndex
        ).toBe(0);

        expect(
            throne.progress.selectedDecision
        ).toBeNull();

        expect(
            throne.progress.stats
        ).toEqual(joust.progress.stats);

        expect(
            throne.progress.unlockedEventIds
        ).toEqual(joust.progress.unlockedEventIds);

        expect(
            throne.progress.storyFlags
        ).toEqual(["brother-is-advisor"]);
    });

    it("actualiza el progreso del epílogo", () => {
        const initial = createGameState(
            "king",
            createSave({
                screen: "chapter-ending",
            })
        );

        const next = gameReducer(
            initial,
            {
                type: "SET_ENDING_PARAGRAPH",
                index: 2,
            }
        );

        expect(
            next.progress.chapterEndingParagraphIndex
        ).toBe(2);

        expect(
            initial.progress.chapterEndingParagraphIndex
        ).toBe(0);
    });
});
