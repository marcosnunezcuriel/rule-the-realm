import { describe, expect, it } from "vitest";

import { applyDailyModifiers } from "../../../game/consequences/applyDailyModifiers";

import { createStats } from "../../helpers/createStats";

describe("Modificadores diarios", () => {
    it("no cambia estadísticas sin modificadores", () => {
        const current = createStats();

        const result = applyDailyModifiers(current, []);

        expect(result.nextStats).toEqual(current);
        expect(result.report.appliedIds).toEqual([]);
        expect(result.report.totalChanges).toEqual({});
    });

    it("aplica el modificador del circo", () => {
        const current = createStats();

        const result = applyDailyModifiers(
            current,
            ["traveling-circus"]
        );

        expect(result.nextStats.gold).toBe(
            current.gold + 5
        );

        expect(result.nextStats.population).toBe(
            current.population + 2
        );

        expect(result.nextStats.prestige).toBe(
            current.prestige + 2
        );

        expect(result.report.appliedIds).toEqual([
            "traveling-circus",
        ]);

        expect(result.report.totalChanges).toEqual({
            gold: 5,
            population: 2,
            prestige: 2,
        });
    });

    it("no aplica dos veces el mismo modificador", () => {
        const result = applyDailyModifiers(
            createStats(),
            ["traveling-circus", "traveling-circus"]
        );

        expect(result.nextStats.gold).toBe(255);

        expect(result.report.appliedIds).toEqual([
            "traveling-circus",
        ]);
    });

    it("no modifica las estadísticas originales", () => {
        const current = createStats();
        const original = { ...current };

        applyDailyModifiers(
            current,
            ["traveling-circus"]
        );

        expect(current).toEqual(original);
    });
});
