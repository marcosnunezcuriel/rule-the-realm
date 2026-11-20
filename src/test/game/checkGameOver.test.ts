import { describe, expect, it } from "vitest";

import { checkGameOver } from "../../game/checkGameOver";
import { createStats } from "../helpers/createStats";

describe("Condiciones de derrota", () => {
    it("no declara una derrota si el reino está estable", () => {
        const stats = createStats();

        expect(checkGameOver(stats)).toBeNull();
    });

    it("detecta bancarrota al llegar a -50 monedas", () => {
        const stats = createStats({ gold: -50 });

        expect(checkGameOver(stats)).toBe("bankruptcy");
    });

    it("no declara bancarrota cuando hay -49 monedas", () => {
        const stats = createStats({ gold: -49 });

        expect(checkGameOver(stats)).toBeNull();
    });

    it("detecta el abandono del reino", () => {
        const stats = createStats({ population: 0 });

        expect(checkGameOver(stats)).toBe("abandoned");
    });

    it("detecta una invasión sin ejército", () => {
        const stats = createStats({ army: 0 });

        expect(checkGameOver(stats)).toBe("invasion");
    });

    it("detecta una crisis religiosa", () => {
        const stats = createStats({ faith: 0 });

        expect(checkGameOver(stats)).toBe("religious-crisis");
    });

    it("detecta el derrocamiento del monarca", () => {
        const stats = createStats({ prestige: 0 });

        expect(checkGameOver(stats)).toBe("overthrown");
    });

    it("mantiene la prioridad de la bancarrota si hay varias derrotas", () => {
        const stats = createStats({
            gold: -50,
            population: 0,
        });

        expect(checkGameOver(stats)).toBe("bankruptcy");
    });
});
