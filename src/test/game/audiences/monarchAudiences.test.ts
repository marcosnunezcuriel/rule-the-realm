import { describe, expect, it } from "vitest";

import { chapter1Events } from "../../../data/chapters/chapter1/events";
import { getEventById } from "../../../data/registries/eventRegistry";

import { getAudiencePresentation } from "../../../game/audiences/getAudiencePresentation";
import { getEventPresentation } from "../../../game/audiences/getEventPresentation";

import type { GameEvent } from "../../../types/events";
import type { MonarchRole } from "../../../types/monarch";

function presentAudience(
    eventId: string,
    monarch: MonarchRole
) {
    const event = getEventById(eventId);

    if (event === undefined) {
        throw new Error(
            `No existe el evento ${eventId}`
        );
    }

    return getAudiencePresentation({
        dayEvents: [event],
        audienceIndex: 0,
        isClosing: false,
        specialAudience: null,
        gameOverReason: null,
        monarch,
    });
}

describe("Audiencias según el protagonista", () => {
    it("el rey recibe a la reina en el evento 10", () => {
        const presentation = presentAudience(
            "10",
            "king"
        );

        expect(presentation.visitorImage).toBe(
            "/assets/characters/royalty/queen-standing.png"
        );

        expect(presentation.dialogue.speaker).toBe(
            "Reina"
        );

        expect(
            presentation.dialogue.responses?.yes.join(" ")
        ).toContain("querido");
    });

    it("la reina recibe al rey en el evento 10", () => {
        const presentation = presentAudience(
            "10",
            "queen"
        );

        expect(presentation.visitorImage).toBe(
            "/assets/characters/royalty/king-standing.png"
        );

        expect(presentation.dialogue.speaker).toBe(
            "Rey"
        );

        expect(
            presentation.dialogue.responses?.yes.join(" ")
        ).toContain("querida");

        expect(
            presentation.dialogue.responses?.no.join(" ")
        ).toContain("preparada");
    });

    it("la princesa utiliza padre o madre según quien gobierne", () => {
        const king = presentAudience("4", "king");
        const queen = presentAudience("4", "queen");

        expect(
            king.dialogue.introduction[0]
        ).toContain("¡Padre!");

        expect(
            queen.dialogue.introduction[0]
        ).toContain("¡Madre!");

        expect(
            queen.dialogue.responses?.yes.join(" ")
        ).toContain("madre");
    });

    it("el príncipe utiliza padre o madre según quien gobierne", () => {
        const king = presentAudience("6", "king");
        const queen = presentAudience("6", "queen");

        expect(
            king.dialogue.introduction[0]
        ).toContain("¡Padre!");

        expect(
            queen.dialogue.introduction[0]
        ).toContain("¡Madre!");

        expect(
            queen.dialogue.introduction.join(" ")
        ).toContain("príncipe heredero");
    });

    it("el hermano adapta el tratamiento familiar", () => {
        const king = presentAudience("8", "king");
        const queen = presentAudience("8", "queen");

        expect(king.dialogue.speaker).toBe(
            "Hermano del rey"
        );

        expect(queen.dialogue.speaker).toBe(
            "Hermano de la reina"
        );

        expect(
            queen.dialogue.introduction[0]
        ).toContain("Hermana,");

        expect(
            queen.dialogue.responses?.yes.join(" ")
        ).toContain("hermana");
    });

    it("conserva las referencias al padre fallecido", () => {
        const queen = presentAudience("10", "queen");

        expect(
            queen.dialogue.introduction.join(" ")
        ).toContain("tu padre");
    });

    it("no altera los visitantes de eventos normales", () => {
        const king = presentAudience("3", "king");
        const queen = presentAudience("3", "queen");

        expect(king.visitorImage).toBe(
            queen.visitorImage
        );

        expect(king.dialogue.speaker).toBe(
            queen.dialogue.speaker
        );
    });

    it("no modifica el diálogo original al resolver una variante", () => {
        const event = getEventById("8");

        if (event === undefined) {
            throw new Error(
                "No existe el evento del hermano."
            );
        }

        const original = structuredClone(
            event.dialogue
        );

        getEventPresentation(
            event,
            "queen"
        );

        expect(event.dialogue).toEqual(
            original
        );
    });

    it("las variantes no sustituyen las audiencias extraordinarias", () => {
        const event = getEventById("10");

        if (event === undefined) {
            throw new Error(
                "No existe el evento del consorte."
            );
        }

        const presentation = getAudiencePresentation({
            monarch: "queen",
            dayEvents: [event],
            audienceIndex: 0,
            isClosing: false,

            specialAudience:
                "treasury-warning",

            gameOverReason: null,
        });

        expect(
            presentation.visitorImage
        ).toBe(
            "/assets/characters/courtiers/royal-advisor.png"
        );

        expect(
            presentation.dialogue.speaker
        ).toBe("Consejera Real");

        expect(
            presentation.dialogueKey
        ).toBe("treasury-warning");
    });

    it("adapta cualquier acontecimiento sin configuración de tratamientos", () => {
        const event: GameEvent = {
            id: "test-variant",
            day: 8,
            order: 1,

            image: "/default.png",

            dialogue: {
                speaker: "Visitante",

                introduction: [
                    "Saludos, mi señor.",
                ],
            },
        };

        const king = getEventPresentation(
            event,
            "king"
        );

        const queen = getEventPresentation(
            event,
            "queen"
        );

        expect(king).toEqual({
            image: event.image,
            dialogue: event.dialogue,
        });

        expect(queen).toEqual({
            image: event.image,

            dialogue: {
                speaker: "Visitante",

                introduction: [
                    "Saludos, mi señora.",
                ],
            },
        });
    });

    it("adapta también los adjetivos del juglar", () => {
        const king = presentAudience(
            "11.1",
            "king"
        );

        const queen = presentAudience(
            "11.1",
            "queen"
        );

        expect(
            king.dialogue.introduction[0]
        ).toContain(
            "magnífico rey de Astaria"
        );

        expect(
            queen.dialogue.introduction[0]
        ).toContain(
            "magnífica reina de Astaria"
        );
    });

    it.each(["34", "38"])(
        "adapta los insultos al protagonista en el evento %s",
        (eventId) => {
            const king = presentAudience(
                eventId,
                "king"
            );

            const queen = presentAudience(
                eventId,
                "queen"
            );

            expect(
                king.dialogue.responses?.no.join(" ")
            ).toContain("¡Necio!");

            expect(
                queen.dialogue.responses?.no.join(" ")
            ).toContain("¡Necia!");
        }
    );

    it("conserva las referencias a otros personajes masculinos", () => {
        const event: GameEvent = {
            id: "test-family",
            day: 8,
            order: 1,

            image: "/default.png",

            dialogue: {
                speaker: "Visitante",

                introduction: [
                    "Mi señor, vuestro padre fue un gran rey.",
                    "Vuestro hermano llegará mañana.",
                    "El antiguo rey era muy respetado.",
                ],
            },
        };

        const queen = getEventPresentation(
            event,
            "queen"
        );

        expect(
            queen.dialogue.introduction
        ).toEqual([
            "Mi señora, vuestro padre fue un gran rey.",
            "Vuestro hermano llegará mañana.",
            "El antiguo rey era muy respetado.",
        ]);
    });

    it("adapta los tratamientos de todas las audiencias del capítulo I", () => {
        const masculineAddress =
            /\b(mi señor|mi rey|nuestro rey|su rey|rey de Astaria|soberano de Astaria|rey hereje)\b/i;

        for (const event of chapter1Events) {
            const { dialogue } = getEventPresentation(
                event,
                "queen"
            );

            const paragraphs = [
                ...dialogue.introduction,
                ...(dialogue.responses?.yes ?? []),
                ...(dialogue.responses?.no ?? []),
            ];

            expect(
                paragraphs.join(" "),
                `Tratamiento masculino en el evento ${event.id}`
            ).not.toMatch(masculineAddress);
        }
    });
});
