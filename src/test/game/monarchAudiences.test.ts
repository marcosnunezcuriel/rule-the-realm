import { describe, expect, it } from "vitest";

import { getEventById } from "../../data/events/eventRegistry";
import { getAudiencePresentation } from "../../game/audienceFlow";

import type { MonarchRole } from "../../types/monarch";

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
});
