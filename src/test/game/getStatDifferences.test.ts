import { describe, expect, it } from "vitest";

import { getStatDifferences } from "../../game/getStatDifferences";
import { createStats } from "../helpers/createStats";

describe("Diferencias de estadísticas", () => {
    it("agrupa ganancias y pérdidas", () => {
        const previous = createStats({
            gold: 100,
            prestige: 100,
        });

        const next = createStats({
            gold: 101,
            prestige: 97,
        });

        expect(
            getStatDifferences(previous, next)
        ).toEqual({
            gold: 1,
            prestige: -3,
        });
    });

    it("omite las estadísticas sin cambios", () => {
        const previous = createStats();

        const next = createStats({
            gold: 255,
        });

        expect(
            getStatDifferences(previous, next)
        ).toEqual({
            gold: 5,
        });
    });

    it("no produce avisos si no hay cambios", () => {
        const stats = createStats();

        expect(
            getStatDifferences(stats, stats)
        ).toEqual({});
    });

    it("admite las cinco estadísticas del reino", () => {
        const previous = createStats();

        const next = createStats({
            gold: 260,
            prestige: 90,
            faith: 105,
            population: 95,
            army: 110,
        });

        expect(
            getStatDifferences(previous, next)
        ).toEqual({
            gold: 10,
            prestige: -10,
            faith: 5,
            population: -5,
            army: 10,
        });
    });
});
