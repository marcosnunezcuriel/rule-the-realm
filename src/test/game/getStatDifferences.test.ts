import { describe, expect, it } from "vitest";

import { getStatDifferences } from "../../game/getStatDifferences";

import { createStats } from "../helpers/createStats";

describe("Cambios de estadísticas", () => {
    it("agrupa las ganancias y pérdidas de una decisión", () => {
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

    it("omite estadísticas que no han cambiado", () => {
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

    it("no produce cambios si las estadísticas son iguales", () => {
        const stats = createStats();

        expect(
            getStatDifferences(stats, stats)
        ).toEqual({});
    });

    it("admite cambios en las cinco estadísticas", () => {
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
