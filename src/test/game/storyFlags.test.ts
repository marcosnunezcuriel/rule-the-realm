import { describe, expect, it } from "vitest";

import { getEventById } from "../../data/events/eventRegistry";

import {
    planDecision,
    planAudienceCompletion,
} from "../../game/audienceActions";

import { createGameState } from "../../game/state/createGameState";
import { gameReducer } from "../../game/state/gameReducer";

import type { GameEvent } from "../../types/events";
import type { GameState } from "../../types/gameState";
import type { StoryFlagId } from "../../data/narrative/storyFlags";

import { createSave } from "../helpers/createSave";

function requireBrotherEvent(): GameEvent {
    const event = getEventById("8");

    if (event === undefined) {
        throw new Error(
            "No existe el evento del hermano."
        );
    }

    return event;
}

function createBrotherState(
    storyFlags: StoryFlagId[] = []
): GameState {
    return {
        ...createGameState(
            "king",
            createSave({
                audienceIndex: 7,
                storyFlags,
            })
        ),

        phase: "speaking",
    };
}

describe("Condiciones narrativas", () => {
    it.each(["yes", "no"] as const)(
        "registra correctamente la decisión del hermano: %s",
        (decision) => {
            const state = createBrotherState();

            const operation = planDecision(
                state,
                requireBrotherEvent(),
                decision
            );

            if (operation === null) {
                throw new Error(
                    "No se pudo preparar la decisión."
                );
            }

            const next = gameReducer(
                state,
                operation.action
            );

            expect(
                next.progress.storyFlags
            ).toEqual(
                decision === "yes"
                    ? ["brother-is-advisor"]
                    : []
            );

            // No se desbloquean acontecimientos.
            expect(
                next.progress.unlockedEventIds
            ).toEqual([]);

            // El estado anterior permanece intacto.
            expect(
                state.progress.storyFlags
            ).toEqual([]);
        }
    );

    it("no duplica una condición que ya está activa", () => {
        const state = createBrotherState([
            "brother-is-advisor",
        ]);

        const operation = planDecision(
            state,
            requireBrotherEvent(),
            "yes"
        );

        if (operation === null) {
            throw new Error(
                "No se pudo preparar la decisión."
            );
        }

        const next = gameReducer(
            state,
            operation.action
        );

        expect(
            next.progress.storyFlags
        ).toEqual(["brother-is-advisor"]);
    });

    it("permite retirar una condición mediante una decisión", () => {
        const state = createBrotherState([
            "brother-is-advisor",
        ]);

        // Acontecimiento de prueba para simular
        // una futura retirada de la ayuda.
        const event: GameEvent = {
            ...requireBrotherEvent(),

            removeStoryFlags: {
                no: ["brother-is-advisor"],
            },
        };

        const operation = planDecision(
            state,
            event,
            "no"
        );

        if (operation === null) {
            throw new Error(
                "No se pudo preparar la decisión."
            );
        }

        const next = gameReducer(
            state,
            operation.action
        );

        expect(
            next.progress.storyFlags
        ).toEqual([]);

        expect(
            state.progress.storyFlags
        ).toEqual(["brother-is-advisor"]);
    });

    it.each([true, false])(
        "actualiza las condiciones al completar un evento: %s",
        (activate) => {
            const state: GameState = {
                ...createBrotherState(
                    activate
                        ? []
                        : ["brother-is-advisor"]
                ),

                phase: "exiting",
            };

            // Las condiciones también pueden cambiar
            // sin depender directamente de una respuesta.
            const event: GameEvent = {
                ...requireBrotherEvent(),

                addStoryFlagsOnComplete: [
                    "brother-is-advisor",
                ],

                removeStoryFlagsOnComplete:
                    activate
                        ? []
                        : ["brother-is-advisor"],
            };

            const operation = planAudienceCompletion(
                state,
                {
                    currentAudience: event,
                    morningCount: 5,
                    timeOfDay: "evening",
                }
            );

            if (operation === null) {
                throw new Error(
                    "No se pudo completar el acontecimiento."
                );
            }

            const next = gameReducer(
                state,
                operation.action
            );

            expect(
                next.progress.storyFlags
            ).toEqual(
                activate
                    ? ["brother-is-advisor"]
                    : []
            );

            expect(
                next.progress.audienceIndex
            ).toBe(8);

            expect(
                next.progress.unlockedEventIds
            ).toEqual([]);

            expect(
                state.progress.storyFlags
            ).toEqual(
                activate
                    ? []
                    : ["brother-is-advisor"]
            );
        }
    );
});
