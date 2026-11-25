import { describe, expect, it } from "vitest";

import {
    getWelcomeParagraphs,
} from "../../data/narrative/welcomeMessage";

describe("Introducción del reinado", () => {
    it("mantiene nueve párrafos para ambos protagonistas", () => {
        expect(getWelcomeParagraphs("king")).toHaveLength(9);
        expect(getWelcomeParagraphs("queen")).toHaveLength(9);
    });

    it("utiliza el tratamiento masculino para el rey", () => {
        const paragraphs = getWelcomeParagraphs("king");

        expect(paragraphs[4]).toContain(
            "No eres recordado"
        );

        expect(paragraphs[8]).toBe(
            "Larga vida al rey."
        );
    });

    it("utiliza el tratamiento femenino para la reina", () => {
        const paragraphs = getWelcomeParagraphs("queen");

        expect(paragraphs[4]).toContain(
            "No eres recordada"
        );

        expect(paragraphs[8]).toBe(
            "Larga vida a la reina."
        );
    });

    it("mantiene la misma historia familiar", () => {
        const king = getWelcomeParagraphs("king");
        const queen = getWelcomeParagraphs("queen");

        expect(king[0]).toBe(queen[0]);
        expect(king[1]).toBe(queen[1]);

        expect(king[1]).toContain(
            "Tu padre ha muerto."
        );
    });

    it("no pierde párrafos ni deja textos vacíos", () => {
        for (const monarch of ["king", "queen"] as const) {
            const paragraphs = getWelcomeParagraphs(monarch);

            expect(
                paragraphs.every(
                    (paragraph) => paragraph.trim().length > 0
                )
            ).toBe(true);
        }
    });
});
