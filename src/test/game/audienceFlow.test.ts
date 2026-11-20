import { describe, expect, it } from "vitest";

import {
    getAudienceExit,
    getAudiencePresentation,
    getDecisionConsequences,
} from "../../game/audienceFlow";

import type { GameEvent } from "../../types/events";

import { createStats } from "../helpers/createStats";

// Audiencia ficticia utilizada solamente durante las pruebas.
const testAudience: GameEvent = {
    id: "test-audience",
    day: 1,
    order: 1,
    image: "/test-character.png",

    dialogue: {
        speaker: "Visitante de prueba",
        introduction: ["¿Aceptáis mi propuesta?"],
        responses: {
            yes: ["Gracias, Majestad."],
            no: ["Como deseéis, Majestad."],
        },
    },

    effects: {
        yes: {
            gold: -20,
            prestige: 5,
        },
        no: {
            prestige: -2,
        },
    },

    unlocks: {
        yes: ["future-event"],
    },

    addModifiers: {
        yes: ["traveling-circus"],
    },
};

// Datos habituales para comprobar qué sucede
// al terminar una audiencia.
const baseExit: Parameters<typeof getAudienceExit>[0] = {
    specialAudience: null,
    isClosing: false,
    stats: createStats(),
    pendingTreasuryWarning: false,
    audienceIndex: 0,
    dayEventsCount: 2,
    morningCount: 1,
    timeOfDay: "morning",
};

describe("Consecuencias de las decisiones", () => {
    it("aplica los cambios de una respuesta afirmativa", () => {
        const result = getDecisionConsequences(
            testAudience,
            "yes",
            createStats()
        );

        expect(result.nextStats?.gold).toBe(230);
        expect(result.nextStats?.prestige).toBe(105);
        expect(result.showTreasuryWarning).toBe(false);
    });

    it("desbloquea eventos y activa modificadores", () => {
        const result = getDecisionConsequences(
            testAudience,
            "yes",
            createStats()
        );

        expect(result.unlocks).toEqual(["future-event"]);
        expect(result.addModifiers).toEqual([
            "traveling-circus",
        ]);
    });

    it("no concede desbloqueos al rechazar la propuesta", () => {
        const result = getDecisionConsequences(
            testAudience,
            "no",
            createStats()
        );

        expect(result.nextStats?.prestige).toBe(98);
        expect(result.unlocks).toEqual([]);
        expect(result.addModifiers).toEqual([]);
    });

    it("detecta cuándo corresponde avisar de arcas vacías", () => {
        const result = getDecisionConsequences(
            testAudience,
            "yes",
            createStats({ gold: 10 })
        );

        expect(result.nextStats?.gold).toBe(-10);
        expect(result.showTreasuryWarning).toBe(true);
    });

    it("no muestra un aviso económico si ya hay bancarrota", () => {
        const expensiveAudience: GameEvent = {
            ...testAudience,
            effects: {
                yes: { gold: -70 },
                no: {},
            },
        };

        const result = getDecisionConsequences(
            expensiveAudience,
            "yes",
            createStats({ gold: 10 })
        );

        expect(result.nextStats?.gold).toBe(-60);
        expect(result.showTreasuryWarning).toBe(false);
    });
        
    it("muestra el aviso económico cuando el oro llega a -49", () => {
        const expensiveAudience: GameEvent = {
            ...testAudience,
            effects: {
                yes: { gold: -59 },
                no: {},
            },
        };

        const result = getDecisionConsequences(
            expensiveAudience,
            "yes",
            createStats({ gold: 10 })
        );

        expect(result.nextStats?.gold).toBe(-49);
        expect(result.showTreasuryWarning).toBe(true);
    });

    it("no muestra el aviso económico al alcanzar exactamente -50", () => {
        const expensiveAudience: GameEvent = {
            ...testAudience,
            effects: {
                yes: { gold: -60 },
                no: {},
            },
        };

        const result = getDecisionConsequences(
            expensiveAudience,
            "yes",
            createStats({ gold: 10 })
        );

        expect(result.nextStats?.gold).toBe(-50);
        expect(result.showTreasuryWarning).toBe(false);
    });

});

describe("Presentación de audiencias", () => {
    it("presenta al visitante normal de la jornada", () => {
        const presentation = getAudiencePresentation({
            dayEvents: [testAudience],
            audienceIndex: 0,
            isClosing: false,
            specialAudience: null,
            gameOverReason: null,
        });

        expect(presentation.visitorImage).toBe(
            "/test-character.png"
        );
        expect(presentation.dialogue.speaker).toBe(
            "Visitante de prueba"
        );
        expect(presentation.timeOfDay).toBe("morning");
    });

    it("presenta a la Consejera Real tras una derrota nocturna", () => {
        const presentation = getAudiencePresentation({
            dayEvents: [],
            audienceIndex: 0,
            isClosing: false,
            specialAudience: "defeat",
            gameOverReason: "bankruptcy",
        });

        expect(presentation.visitorImage).toBe(
            "/assets/characters/courtiers/royal-advisor.png"
        );

        expect(presentation.dialogue.speaker).toBe(
            "Consejera Real"
        );

        expect(
            presentation.dialogue.introduction.join(" ")
        ).toContain("Bancarrota");
    });
});

describe("Finalización de audiencias", () => {
    it("envía directamente a GameOver después del anuncio de derrota", () => {
        const result = getAudienceExit({
            ...baseExit,
            specialAudience: "defeat",
        });

        expect(result).toEqual({
            kind: "gameover",
        });
    });

    it("envía al resumen tras el cierre nocturno", () => {
        const result = getAudienceExit({
            ...baseExit,
            isClosing: true,
        });

        expect(result).toEqual({
            kind: "summary",
        });
    });

    it("anuncia una derrota cuando fallan las estadísticas", () => {
        const result = getAudienceExit({
            ...baseExit,
            stats: createStats({ gold: -50 }),
        });

        expect(result).toEqual({
            kind: "defeat",
            reason: "bankruptcy",
        });
    });

    it("prioriza el aviso económico pendiente", () => {
        const result = getAudienceExit({
            ...baseExit,
            pendingTreasuryWarning: true,
        });

        expect(result).toEqual({
            kind: "treasury-warning",
        });
    });

    it("cambia de mañana a tarde al avanzar de audiencia", () => {
        const result = getAudienceExit(baseExit);

        expect(result).toEqual({
            kind: "next-audience",
            index: 1,
            phase: "transitioning",
            clearTreasuryWarning: false,
        });
    });

    it("limpia el aviso económico después de presentarlo", () => {
        const result = getAudienceExit({
            ...baseExit,
            specialAudience: "treasury-warning",
        });

        expect(result).toEqual({
            kind: "next-audience",
            index: 1,
            phase: "transitioning",
            clearTreasuryWarning: true,
        });
    });

    it("inicia el cierre después de la última audiencia", () => {
        const result = getAudienceExit({
            ...baseExit,
            audienceIndex: 1,
            timeOfDay: "evening",
        });

        expect(result).toEqual({
            kind: "closing",
            clearTreasuryWarning: false,
        });
    });
});
