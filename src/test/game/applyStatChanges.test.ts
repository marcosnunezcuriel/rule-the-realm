import { describe, expect, it } from "vitest";

import { applyStatChanges } from "../../game/applyStatChanges";
import { createStats } from "../helpers/createStats";

describe("Aplicación de estadísticas", () => {
    it("aplica ganancias y pérdidas", () => {
        const current = createStats();

        const result = applyStatChanges(current, {
            gold: -20,
            prestige: 5,
        });

        expect(result.gold).toBe(current.gold - 20);
        expect(result.prestige).toBe(
            current.prestige + 5
        );
    });

    it("conserva las estadísticas sin cambios", () => {
        const current = createStats();

        const result = applyStatChanges(current, {
            army: 10,
        });

        expect(result.gold).toBe(current.gold);
        expect(result.prestige).toBe(current.prestige);
        expect(result.faith).toBe(current.faith);
        expect(result.population).toBe(current.population);
    });

    it("no modifica el objeto original", () => {
        const current = createStats();
        const original = { ...current };

        const result = applyStatChanges(current, {
            gold: -30,
        });

        expect(current).toEqual(original);
        expect(result).not.toBe(current);
    });
});
