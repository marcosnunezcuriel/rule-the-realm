import { describe, expect, it } from "vitest";

import {
    getDecisionAchievements,
    getEventCompletionAchievements,
    getChapterCompletionAchievements,
} from "../../data/achievements";

import { getEventById } from "../../data/events/eventRegistry";

describe("Logros del Capítulo I", () => {
    it("concede Mano del rey al aceptar la ayuda del hermano", () => {
        expect(
            getDecisionAchievements("8", "yes")
        ).toContain("hand-of-king");

        expect(
            getDecisionAchievements("8", "no")
        ).not.toContain("hand-of-king");
    });

    it("requiere completar el retrato real", () => {
        expect(
            getEventCompletionAchievements("23.1")
        ).toContain("royal-portrait");

        expect(
            getDecisionAchievements("23", "yes")
        ).not.toContain("royal-portrait");
    });

    it("requiere recibir la donación del mendigo", () => {
        expect(
            getEventCompletionAchievements("13.1")
        ).toContain("second-chance");
    });

    it("concede Tierra de oportunidades al financiar la integración", () => {
        expect(
            getDecisionAchievements("36.1", "yes")
        ).toContain("land-of-opportunity");

        expect(
            getDecisionAchievements("36.1", "no")
        ).not.toContain("land-of-opportunity");
    });

    it("concede Fronteras protegidas al ordenar el ataque", () => {
        expect(
            getDecisionAchievements("36.2", "yes")
        ).toContain("protected-borders");

        expect(
            getDecisionAchievements("36.2", "no")
        ).not.toContain("protected-borders");
    });

    it("los logros de refugiados pertenecen a ramas incompatibles", () => {
        const event = getEventById("36");

        expect(event?.unlocks?.yes).toContain("36.1");
        expect(event?.unlocks?.no).toContain("36.2");

        expect(event?.unlocks?.yes).not.toContain("36.2");
        expect(event?.unlocks?.no).not.toContain("36.1");
    });

    it("desbloquea Primeros pasos en el trono al terminar el capítulo", () => {
        expect(
            getChapterCompletionAchievements(1)
        ).toContain("first-steps");
    });

    it("reconoce las condiciones de los logros de decisiones", () => {
        expect(
            getDecisionAchievements("11", "yes")
        ).toContain("great-circus");

        expect(
            getDecisionAchievements("45", "yes")
        ).toContain("against-wind-and-plague");

        expect(
            getDecisionAchievements("45", "no")
        ).not.toContain("against-wind-and-plague");
    });
});
