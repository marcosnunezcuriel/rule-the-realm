import { describe, expect, it } from "vitest";

import { modifierDefinitions } from "../../data/kingdom/modifiers";
import { statDefinitions } from "../../data/kingdom/statDefinitions";

describe("Definiciones de modificadores", () => {
    it("mantiene identificadores coherentes con el registro", () => {
        for (const [id, modifier] of Object.entries(
            modifierDefinitions
        )) {
            expect(modifier.id).toBe(id);
        }
    });

    it("define nombres y descripciones no vacíos", () => {
        for (const modifier of Object.values(
            modifierDefinitions
        )) {
            expect(
                modifier.name.trim().length
            ).toBeGreaterThan(0);

            expect(
                modifier.description.trim().length
            ).toBeGreaterThan(0);
        }
    });

    it("no contiene descripciones provisionales", () => {
        for (const modifier of Object.values(
            modifierDefinitions
        )) {
            expect(
                modifier.description
            ).not.toMatch(/pendiente de definir/i);
        }
    });

    it("define efectos diarios sobre estadísticas válidas", () => {
        const validStatKeys = new Set<string>(
            statDefinitions.map(({ key }) => key)
        );

        for (const modifier of Object.values(
            modifierDefinitions
        )) {
            const changes = Object.entries(
                modifier.dailyChanges
            );

            expect(changes.length).toBeGreaterThan(0);

            for (const [key, amount] of changes) {
                expect(validStatKeys.has(key)).toBe(true);

                expect(
                    Number.isFinite(amount)
                ).toBe(true);
            }
        }
    });
});
