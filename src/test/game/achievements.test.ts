import { describe, expect, it } from "vitest";

import {
    achievements,
    getDecisionAchievements,
    getEventCompletionAchievements,
    getChapterCompletionAchievements,
} from "../../data/achievements";

import { getEventById } from "../../data/events/eventRegistry";

describe("Logros del Capítulo I", () => {
    it("contiene 15 logros con identificadores únicos", () => {
        const ids = achievements.map((item) => item.id);

        expect(ids).toHaveLength(15);
        expect(new Set(ids).size).toBe(15);
    });

    it("todos los logros de eventos apuntan a eventos existentes", () => {
        for (const achievement of achievements) {
            const trigger = achievement.trigger;

            if (trigger.type === "chapter-complete") {
                continue;
            }

            expect(
                getEventById(trigger.eventId),
                achievement.name
            ).toBeDefined();
        }
    });

    it("concede Mano del rey solo al aceptar la ayuda", () => {
        expect(getDecisionAchievements("8", "yes")).toContain(
            "hand-of-king"
        );

        expect(getDecisionAchievements("8", "no")).not.toContain(
            "hand-of-king"
        );
    });

    it("concede Gran circo solo al autorizar la entrada", () => {
        expect(getDecisionAchievements("11", "yes")).toContain(
            "great-circus"
        );

        expect(getDecisionAchievements("11", "no")).toEqual([]);
    });

    it("requiere completar el retrato oficial", () => {
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

        expect(
            getDecisionAchievements("13", "yes")
        ).not.toContain("second-chance");
    });

    it("requiere financiar la integración de los refugiados", () => {
        expect(
            getDecisionAchievements("36.1", "yes")
        ).toContain("land-of-opportunity");

        expect(
            getDecisionAchievements("36", "yes")
        ).not.toContain("land-of-opportunity");
    });

    it("no concede el logro médico al rechazar la ayuda", () => {
        expect(
            getDecisionAchievements("45", "yes")
        ).toContain("against-wind-and-plague");

        expect(
            getDecisionAchievements("45", "no")
        ).toEqual([]);
    });

    it("reconoce la finalización del Capítulo I", () => {
        expect(
            getChapterCompletionAchievements(1)
        ).toContain("kings-first-steps");

        expect(
            getChapterCompletionAchievements(2)
        ).toEqual([]);
    });

    it("el himno deja de conceder un logro", () => {
        expect(
            getEventCompletionAchievements("24.1")
        ).toEqual([]);

        expect(
            achievements.map((achievement) => achievement.id)
        ).not.toContain("astaria-anthem");
    });

    it("concede Fronteras protegidas al atacar", () => {
        expect(
            getDecisionAchievements("36.2", "yes")
        ).toContain("protected-borders");

        expect(
            getDecisionAchievements("36.2", "no")
        ).not.toContain("protected-borders");
    });

    it("los dos logros de refugiados siguen ramas excluyentes", () => {
        const event = getEventById("36");

        expect(event?.unlocks?.yes).toContain("36.1");
        expect(event?.unlocks?.no).toContain("36.2");

        expect(event?.unlocks?.yes).not.toContain("36.2");
        expect(event?.unlocks?.no).not.toContain("36.1");

        expect(
            getDecisionAchievements("36.1", "yes")
        ).toContain("land-of-opportunity");

        expect(
            getDecisionAchievements("36.2", "yes")
        ).toContain("protected-borders");
    });
});
