import { describe, expect, it } from "vitest";

import {
    getNextDayPlan,
    hasCompletedChapter,
} from "../../game/dayFlow";

import { createStats } from "../helpers/createStats";

describe("Jornadas y finalización de capítulos", () => {
    it("no termina el capítulo antes del último día", () => {
        expect(
            hasCompletedChapter(6, createStats())
        ).toBe(false);
    });

    it("termina el Capítulo I si el reino sobrevive al día 7", () => {
        expect(
            hasCompletedChapter(7, createStats())
        ).toBe(true);
    });

    it("impide completar el capítulo si hay una derrota", () => {
        const stats = createStats({ gold: -50 });

        expect(
            hasCompletedChapter(7, stats)
        ).toBe(false);
    });

    it("prepara las audiencias desbloqueadas del día siguiente", () => {
        const plan = getNextDayPlan(
            1,
            createStats(),
            [],
            ["2.1", "2.2"]
        );

        expect(plan.nextDay).toBe(2);
        expect(plan.defeat).toBeNull();

        expect(
            plan.nextDayEvents.map((event) => event.id)
        ).toEqual([
            "2.1",
            "2.2",
            "6",
        ]);

        expect(plan.isClosing).toBe(false);
    });

    it("tras una derrota nocturna deja el día siguiente sin eventos normales", () => {
        // Simulamos las estadísticas resultantes de una
        // última noche que ha provocado bancarrota.
        const stats = createStats({ gold: -50 });

        const plan = getNextDayPlan(
            7,
            stats,
            ["traveling-circus"],
            ["6.2"]
        );

        expect(plan.nextDay).toBe(8);
        expect(plan.defeat).toBe("bankruptcy");
        expect(plan.nextDayEvents).toEqual([]);
        expect(plan.isClosing).toBe(false);
    });

    it("conserva los modificadores visuales para la nueva jornada", () => {
        const modifiers = ["traveling-circus"] as const;

        const plan = getNextDayPlan(
            1,
            createStats(),
            [...modifiers],
            []
        );

        expect(plan.nextSceneModifierIds).toEqual([
            "traveling-circus",
        ]);
    });
});
