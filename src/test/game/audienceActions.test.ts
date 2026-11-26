import { describe, expect, it } from "vitest";

import {
    planDecision,
    planAudienceCompletion,
} from "../../game/audienceActions";

import { createGameState } from "../../game/state/createGameState";
import { getEventById } from "../../data/events/eventRegistry";

import type { GameState } from "../../types/gameState";

import { createSave } from "../helpers/createSave";
import { createStats } from "../helpers/createStats";

function requireEvent(id: string) {
    const event = getEventById(id);

    if (event === undefined) {
        throw new Error(
            `No existe el evento ${id}`
        );
    }

    return event;
}

describe("Planificación de operaciones de audiencia", () => {
    it("prepara una decisión sin modificar el estado original", () => {
        const state: GameState = {
            ...createGameState(
                "king",
                createSave({
                    audienceIndex: 1,
                })
            ),

            phase: "speaking",
        };

        const plan = planDecision(
            state,
            requireEvent("2"),
            "yes"
        );

        const expectedStats = {
            ...state.progress.stats,
            gold: state.progress.stats.gold - 20,
            prestige: state.progress.stats.prestige + 5,
        };

        expect(plan?.action).toMatchObject({
            type: "MAKE_DECISION",
            decision: "yes",

            changes: {
                stats: expectedStats,
                unlocks: ["2.1"],
            },
        });

        expect(plan?.effects).toContainEqual({
            kind: "stats",
            previous: state.progress.stats,
            next: expectedStats,
        });

        expect(plan?.transition).toBeNull();

        expect(
            state.progress.stats
        ).toEqual(createStats());

        expect(
            state.progress.selectedDecision
        ).toBeNull();

        expect(
            state.progress.unlockedEventIds
        ).toEqual([]);
    });

    it("no prepara consecuencias de una decisión ya aplicada", () => {
        const state: GameState = {
            ...createGameState(
                "king",
                createSave({
                    audienceIndex: 1,
                    selectedDecision: "yes",
                })
            ),

            phase: "speaking",
        };

        expect(
            planDecision(
                state,
                requireEvent("2"),
                "yes"
            )
        ).toBeNull();
    });

    it("prepara las recompensas al completar una audiencia", () => {
        const state: GameState = {
            ...createGameState(
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

            phase: "exiting",
        };

        const plan = planAudienceCompletion(
            state,
            {
                currentAudience:
                    requireEvent("15.2"),

                morningCount: 4,
                timeOfDay: "morning",
            }
        );

        expect(plan?.action).toMatchObject({
            type: "COMPLETE_AUDIENCE",

            changes: {
                stats: {
                    ...state.progress.stats,

                    gold:
                        state.progress.stats.gold + 15,

                    army:
                        state.progress.stats.army + 5,
                },
            },

            exit: {
                kind: "next-audience",
                index: 1,
            },
        });

        expect(plan?.transition).toBeNull();

        expect(
            state.progress.stats
        ).toEqual(createStats());
    });

    it("prepara los intereses tras finalizar el aviso de deuda", () => {
        const state: GameState = {
            ...createGameState(
                "king",
                createSave({
                    stats: createStats({
                        gold: -10,
                    }),

                    audienceIndex: -1,

                    specialAudience:
                        "treasury-warning",
                })
            ),

            phase: "exiting",
        };

        const plan = planAudienceCompletion(
            state,
            {
                currentAudience: undefined,
                morningCount: 5,
                timeOfDay: "morning",
            }
        );

        expect(plan?.action).toMatchObject({
            type: "COMPLETE_AUDIENCE",

            changes: {
                activeModifierIds: [
                    "indebted",
                ],
            },

            exit: {
                kind: "next-audience",
                index: 0,
                clearSpecialAudience: true,
            },
        });

        expect(plan?.effects).toContainEqual({
            kind: "modifier",
            id: "indebted",
            change: "added",
        });

        expect(
            state.progress.activeModifierIds
        ).toEqual([]);
    });

    it("prepara el desbloqueo del himno al completar su evento", () => {
        const state: GameState = {
            ...createGameState(
                "king",
                createSave({
                    day: 6,

                    unlockedEventIds: [
                        "24.1",
                    ],

                    audienceIndex: 1,

                    dayEventIds: [
                        "35", "24.1",
                        "36", "37", "38",
                        "39", "40",
                    ],
                })
            ),

            phase: "exiting",
        };

        const plan = planAudienceCompletion(
            state,
            {
                currentAudience:
                    requireEvent("24.1"),

                morningCount: 4,
                timeOfDay: "morning",
            }
        );

        expect(plan?.effects).toContainEqual({
            kind: "anthem",
        });
    });

    it("prepara el regreso al trono al finalizar la justa", () => {
        const state: GameState = {
            ...createGameState(
                "king",
                createSave({
                    day: 2,
                    screen: "special-scene",

                    specialEvent: {
                        id: "2.1",
                        completed: false,
                    },

                    selectedDecision: "yes",

                    unlockedEventIds: [
                        "2.1",
                    ],

                    dayEventIds: [
                        "11", "12", "13",
                        "14", "15", "16",
                    ],
                })
            ),

            phase: "exiting",
        };

        const plan = planAudienceCompletion(
            state,
            {
                currentAudience:
                    requireEvent("2.1"),

                morningCount: 1,
                timeOfDay: "morning",
            }
        );

        expect(plan?.action).toMatchObject({
            type: "COMPLETE_AUDIENCE",
            exit: null,
        });

        expect(plan?.transition).toEqual({
            action: {
                type: "FINISH_SPECIAL_SCENE",
            },

            fullScreen: false,
            enterAudience: true,
        });

        expect(
            state.progress.day
        ).toBe(2);

        expect(
            state.progress.screen
        ).toBe("special-scene");
    });
});
