import { describe, expect, it } from "vitest";

import { hasCompletedChapter } from "../../../game/progression/chapterFlow";
import { getNextDayPlan } from "../../../game/progression/dayFlow";

import { createStats } from "../../helpers/createStats";

describe("Jornadas y capítulos", () => {
    it("no termina el capítulo antes del día 7", () => {
        expect(
            hasCompletedChapter(6, createStats())
        ).toBe(false);
    });

    it("termina el capítulo tras sobrevivir al día 7", () => {
        expect(
            hasCompletedChapter(7, createStats())
        ).toBe(true);
    });

    it("no completa el capítulo si existe una derrota", () => {
        expect(
            hasCompletedChapter(
                7,
                createStats({ gold: -50 })
            )
        ).toBe(false);
    });

    it("prepara los eventos condicionados del día siguiente", () => {
        const plan = getNextDayPlan(
            1,
            createStats(),
            [],
            ["2.1", "3.1"]
        );

        expect(plan.nextDay).toBe(2);
        expect(plan.defeat).toBeNull();
        expect(plan.specialEventId).toBe("2.1");

        expect(
            plan.nextDayEvents.map((event) => event.id)
        ).toEqual([
            "3.1", "11", "12",
            "13", "14", "15", "16",
        ]);

        expect(plan.isClosing).toBe(false);
    });

    it("prepara la derrota nocturna", () => {
        const plan = getNextDayPlan(
            7,
            createStats({ gold: -50 }),
            ["traveling-circus"],
            ["11.2"]
        );

        expect(plan.nextDay).toBe(8);
        expect(plan.defeat).toBe("bankruptcy");
        expect(plan.nextDayEvents).toEqual([]);
        expect(plan.specialEventId).toBeNull();
    });

    it("conserva modificadores visuales", () => {
        const plan = getNextDayPlan(
            1,
            createStats(),
            ["traveling-circus"],
            []
        );

        expect(plan.nextSceneModifierIds).toEqual([
            "traveling-circus",
        ]);
        expect(plan.specialEventId).toBeNull();
    });
});
