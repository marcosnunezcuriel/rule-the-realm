
import { describe, expect, it } from "vitest";

import { getModifierTransition } from "../../game/getModifierTransition";

describe("Cambios de modificadores", () => {
    it("detecta la activación de un modificador", () => {
        const result = getModifierTransition(
            [],
            ["traveling-circus"]
        );

        expect(result.next).toEqual(["traveling-circus"]);
        expect(result.added).toEqual(["traveling-circus"]);
        expect(result.removed).toEqual([]);
    });

    it("detecta la eliminación de un modificador", () => {
        const result = getModifierTransition(
            ["traveling-circus"],
            [],
            ["traveling-circus"]
        );

        expect(result.next).toEqual([]);
        expect(result.added).toEqual([]);
        expect(result.removed).toEqual(["traveling-circus"]);
    });

    it("no anuncia un modificador que ya estaba activo", () => {
        const result = getModifierTransition(
            ["traveling-circus"],
            ["traveling-circus"]
        );

        expect(result.added).toEqual([]);
        expect(result.removed).toEqual([]);
    });

    it("no anuncia la retirada de uno inexistente", () => {
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
        expect(result.removed).toEqual(["traveling-circus"]);
    });

    it("no anuncia cambios que se cancelan entre sí", () => {
        const result = getModifierTransition(
            [],
            ["traveling-circus"],
            ["traveling-circus"]
        );

        expect(result.next).toEqual([]);
        expect(result.added).toEqual([]);
        expect(result.removed).toEqual([]);
    });
});
