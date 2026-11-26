import { describe, expect, it } from "vitest";

import { getEventById } from "../../data/events/eventRegistry";
import { getSpecialScenePresentation } from "../../game/getSpecialScenePresentation";

import { planAudienceCompletion } from "../../game/audienceActions";

import { createGameState } from "../../game/state/createGameState";
import { gameReducer } from "../../game/state/gameReducer";

import type { GameEvent } from "../../types/events";
import type { GameState } from "../../types/gameState";

import { createSave } from "../helpers/createSave";
import { createStats } from "../helpers/createStats";

const day2EventIds = [
    "11", "12", "13",
    "14", "15", "16",
];

describe("Motor de escenarios especiales", () => {
    it.each([
        ["king", false, "joust-king.png"],
        ["king", true, "joust-king-2.png"],
        ["queen", false, "joust-queen.png"],
        ["queen", true, "joust-queen-2.png"],
    ] as const)(
        "selecciona el fondo correcto para %s con hermano: %s",
        (monarch, withBrother, filename) => {
            const scene = getSpecialScenePresentation(
                "joust",
                monarch,
                withBrother
                    ? ["brother-is-advisor"]
                    : []
            );

            expect(scene).toEqual({
                id: "joust",

                background:
                    `/assets/backgrounds/${filename}`,
            });
        }
    );

    it("no repite los efectos de finalización al recuperar un escenario completado", () => {
        const event = getEventById("2.1");

        if (event === undefined) {
            throw new Error(
                "No existe el evento especial."
            );
        }

        // Simular un futuro acontecimiento especial
        // informativo que entrega una recompensa al salir.
        const testEvent: GameEvent = {
            ...event,

            dialogue: {
                speaker: "Visitante de prueba",
                introduction: [
                    "Aquí tenéis vuestra recompensa.",
                ],
            },

            baseEffects: {
                gold: 15,
            },
        };

        const initial: GameState = {
            ...createGameState(
                "king",
                createSave({
                    day: 2,

                    screen: "special-scene",

                    specialEvent: {
                        id: "2.1",
                        completed: false,
                    },

                    unlockedEventIds: [
                        "2.1",
                    ],

                    dayEventIds: day2EventIds,
                })
            ),

            phase: "exiting",
        };

        const operation = planAudienceCompletion(
            initial,
            {
                currentAudience: testEvent,
                morningCount: 1,
                timeOfDay: "morning",
            }
        );

        if (operation === null) {
            throw new Error(
                "No se pudo completar el acontecimiento."
            );
        }

        const completed = gameReducer(
            initial,
            operation.action
        );

        expect(
            completed.progress.stats.gold
        ).toBe(
            initial.progress.stats.gold + 15
        );

        expect(
            completed.progress.specialEvent?.completed
        ).toBe(true);

        // No se puede completar dos veces.
        expect(
            gameReducer(
                completed,
                operation.action
            )
        ).toBe(completed);

        // Simular la restauración durante el fundido.
        const restored = createGameState(
            "king",
            completed.progress
        );

        expect(
            restored.progress.screen
        ).toBe("scene");

        expect(
            restored.progress.specialEvent
        ).toBeNull();

        expect(
            restored.progress.audienceIndex
        ).toBe(0);

        expect(
            restored.progress.stats.gold
        ).toBe(
            initial.progress.stats.gold + 15
        );

        expect(restored.phase).toBe("entering");
    });

    it.each([
        {
            gold: -10,
            audience: "treasury-warning",
            reason: null,
        },
        {
            gold: -50,
            audience: "defeat",
            reason: "bankruptcy",
        },
    ] as const)(
        "recupera la audiencia extraordinaria $audience tras el escenario especial",
        ({ gold, audience, reason }) => {
            const saved = createSave({
                day: 2,

                screen: "special-scene",

                specialEvent: {
                    id: "2.1",
                    completed: true,
                },

                stats: createStats({ gold }),

                unlockedEventIds: [
                    "2.1",
                ],

                dayEventIds: day2EventIds,

                selectedDecision: "yes",
            });

            const restored = createGameState(
                "king",
                saved
            );

            expect(
                restored.progress.day
            ).toBe(2);

            expect(
                restored.progress.screen
            ).toBe("scene");

            expect(
                restored.progress.specialEvent
            ).toBeNull();

            expect(
                restored.progress.specialAudience
            ).toBe(audience);

            expect(
                restored.progress.gameOverReason
            ).toBe(reason);

            expect(
                restored.progress.audienceIndex
            ).toBe(-1);

            expect(
                restored.progress.selectedDecision
            ).toBeNull();
        }
    );
});
