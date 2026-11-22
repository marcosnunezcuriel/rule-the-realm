import { describe, expect, it } from "vitest";

import {
    getNextDayPlan,
    hasCompletedChapter,
} from "../../game/dayFlow";

import { createStats } from "../helpers/createStats";

describe("Jornadas y finalización de capítulos", () => {
    it("no termina el capítulo antes del día 7", () => {
        expect(hasCompletedChapter(6, createStats())).toBe(false);
    });

    it("termina el Capítulo I si el reino sobrevive al día 7", () => {
        expect(hasCompletedChapter(7, createStats())).toBe(true);
    });

    it("impide completar el capítulo si hay una derrota", () => {
        expect(hasCompletedChapter(7, createStats({ gold: -50 }))).toBe(false);
    });

    it("prepara las audiencias condicionales del día siguiente", () => {
        const plan = getNextDayPlan(
            1, createStats(), [], ["2.1", "3.1"]
        );
        expect(plan.nextDay).toBe(2);
        expect(plan.defeat).toBeNull();
        expect(plan.nextDayEvents.map((event) => event.id)).toEqual(
            ["2.1", "3.1", "11", "12", "13", "14", "15", "16"]
        );
        expect(plan.isClosing).toBe(false);
    });

    it("tras una derrota nocturna deja el día siguiente sin eventos normales", () => {
        const plan = getNextDayPlan(
            7, createStats({ gold: -50 }), ["traveling-circus"], ["11.2"]
        );
        expect(plan.nextDay).toBe(8);
        expect(plan.defeat).toBe("bankruptcy");
        expect(plan.nextDayEvents).toEqual([]);
        expect(plan.isClosing).toBe(false);
    });

    it("conserva los modificadores visuales en la jornada siguiente", () => {
        const plan = getNextDayPlan(
            1, createStats(), ["traveling-circus"], []
        );
        expect(plan.nextSceneModifierIds).toEqual(["traveling-circus"]);
    });
});
