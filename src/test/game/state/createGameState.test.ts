import { describe, expect, it } from "vitest";

import { createGameState } from "../../../game/state/createGameState";

import { createSave } from "../../helpers/createSave";
import { createStats } from "../../helpers/createStats";

describe("Inicialización del estado de partida", () => {
    it("crea una partida nueva con el monarca elegido", () => {
        const state = createGameState("queen");

        expect(state.progress).toEqual(
            createSave({
                monarch: "queen",
            })
        );

        expect(state.phase).toBe("entering");
    });

    it("recupera una decisión previamente guardada", () => {
        const saved = createSave({
            selectedDecision: "yes",
            stats: createStats({
                gold: 200,
            }),
        });

        const state = createGameState(
            "king",
            saved
        );

        expect(state.progress).toEqual(saved);

        expect(
            state.progress.selectedDecision
        ).toBe("yes");

        expect(state.phase).toBe("entering");
    });

    it("recupera el descanso nocturno sin repetir el cierre", () => {
        const saved = createSave({
            dayClosed: true,
            isClosing: true,
            closingStats: createStats(),
        });

        const state = createGameState(
            "king",
            saved
        );

        expect(
            state.progress.screen
        ).toBe("sleep");

        expect(
            state.progress.dayClosed
        ).toBe(true);

        expect(
            state.progress.stats
        ).toEqual(saved.stats);

        // El estado original no se modifica.
        expect(saved.screen).toBe("scene");
    });

    it("recupera una audiencia económica nocturna pendiente", () => {
        const saved = createSave({
            dayClosed: true,
            isClosing: true,

            stats: createStats({
                gold: 10,
            }),

            activeModifierIds: [
                "indebted",
            ],
        });

        const state = createGameState(
            "king",
            saved
        );

        expect(
            state.progress.screen
        ).toBe("scene");

        expect(
            state.progress.specialAudience
        ).toBe("treasury-recovery");

        expect(
            state.progress.dayClosed
        ).toBe(true);

        expect(
            saved.specialAudience
        ).toBeNull();
    });
});
