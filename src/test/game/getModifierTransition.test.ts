import { describe, expect, it } from "vitest";

import { getModifierTransition } from "../../game/getModifierTransition";

describe("Activación y retirada de modificadores", () => {
    it("detecta un modificador añadido", () => {
        const result = getModifierTransition(
            [],
            ["traveling-circus"]
        );

        expect(result.next).toEqual([
            "traveling-circus",
        ]);

        expect(result.added).toEqual([
            "traveling-circus",
        ]);

        expect(result.removed).toEqual([]);
    });

    it("detecta un modificador eliminado", () => {
        const result = getModifierTransition(
            ["traveling-circus"],
            [],
            ["traveling-circus"]
        );

        expect(result.next).toEqual([]);
        expect(result.added).toEqual([]);
        expect(result.removed).toEqual([
            "traveling-circus",
        ]);
    });

    it("no anuncia un modificador ya activo", () => {
        const result = getModifierTransition(
            ["traveling-circus"],
            ["traveling-circus"]
        );

        expect(result.added).toEqual([]);
        expect(result.removed).toEqual([]);
    });

    it("ignora la retirada de un modificador inexistente", () => {
        const result = getModifierTransition(
            [],
            [],
            ["traveling-circus"]
        );

        expect(result.added).toEqual([]);
        expect(result.removed).toEqual([]);
    });

    it("detecta varios cambios simultáneos", () => {
        const result = getModifierTransition(
            ["traveling-circus"],
            ["silk-road"],
            ["traveling-circus"]
        );

        expect(result.next).toEqual(["silk-road"]);
        expect(result.added).toEqual(["silk-road"]);
        expect(result.removed).toEqual([
            "traveling-circus",
        ]);
    });

    it("no anuncia cambios que se cancelan", () => {
        const result = getModifierTransition(
            [],
            ["traveling-circus"],
            ["traveling-circus"]
        );

        expect(result.next).toEqual([]);
        expect(result.added).toEqual([]);
        expect(result.removed).toEqual([]);
    });

    it("detecta el inicio y final de Endeudado", () => {
        const added = getModifierTransition(
            [],
            ["indebted"]
        );

        const removed = getModifierTransition(
            ["indebted"],
            [],
            ["indebted"]
        );

        expect(added.added).toEqual(["indebted"]);
        expect(removed.removed).toEqual(["indebted"]);
    });
});
