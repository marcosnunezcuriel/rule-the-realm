import { describe, expect, it } from "vitest";

import { checkGameOver } from "../../game/checkGameOver";
import { createStats } from "../helpers/createStats";

describe("Condiciones de derrota", () => {
    it("no termina una partida estable", () => {
        expect(
            checkGameOver(createStats())
        ).toBeNull();
    });

    it("detecta la bancarrota en -50", () => {
        expect(
            checkGameOver(createStats({ gold: -50 }))
        ).toBe("bankruptcy");
    });

    it("no declara bancarrota en -49", () => {
        expect(
            checkGameOver(createStats({ gold: -49 }))
        ).toBeNull();
    });

    it("detecta la pérdida de población", () => {
        expect(
            checkGameOver(createStats({ population: 0 }))
        ).toBe("abandoned");
    });

    it("detecta la invasión", () => {
        expect(
            checkGameOver(createStats({ army: 0 }))
        ).toBe("invasion");
    });

    it("detecta la crisis religiosa", () => {
        expect(
            checkGameOver(createStats({ faith: 0 }))
        ).toBe("religious-crisis");
    });

    it("detecta el derrocamiento", () => {
        expect(
            checkGameOver(createStats({ prestige: 0 }))
        ).toBe("overthrown");
    });

    it("prioriza la bancarrota ante varias derrotas", () => {
        expect(
            checkGameOver(
                createStats({
                    gold: -50,
                    population: 0,
                })
            )
        ).toBe("bankruptcy");
    });
});
