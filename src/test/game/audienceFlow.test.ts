import { describe, expect, it } from "vitest";

import { getAudienceExit } from "../../game/audienceFlow";
import { getAudiencePresentation } from "../../game/getAudiencePresentation";
import { getDecisionConsequences } from "../../game/getDecisionConsequences";

import type { GameEvent } from "../../types/events";

import { createStats } from "../helpers/createStats";

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

const baseExit: Parameters<typeof getAudienceExit>[0] = {
    specialAudience: null,
    isClosing: false,
    stats: createStats(),
    pendingTreasuryWarning: false,
    audienceIndex: 0,
    dayEventsCount: 2,
    morningCount: 1,
    timeOfDay: "morning",
    activeModifierIds: [],
};

describe("Consecuencias de las decisiones", () => {
    it("aplica estadísticas y desbloqueos de una decisión", () => {
        const result = getDecisionConsequences(
            testAudience,
            "yes",
            createStats()
        );

        expect(result.nextStats?.gold).toBe(230);
        expect(result.nextStats?.prestige).toBe(105);

        expect(result.unlocks).toEqual([
            "future-event",
        ]);

        expect(result.addModifiers).toEqual([
            "traveling-circus",
        ]);
    });

    it("aplica las consecuencias del rechazo", () => {
        const result = getDecisionConsequences(
            testAudience,
            "no",
            createStats()
        );

        expect(result.nextStats?.prestige).toBe(98);
        expect(result.unlocks).toEqual([]);
        expect(result.addModifiers).toEqual([]);
    });

    it("avisa cuando la tesorería entra en negativo", () => {
        const result = getDecisionConsequences(
            testAudience,
            "yes",
            createStats({ gold: 10 })
        );

        expect(result.nextStats?.gold).toBe(-10);
        expect(result.showTreasuryWarning).toBe(true);
    });

    it("distingue el aviso de deuda de la bancarrota", () => {
        const warningAudience: GameEvent = {
            ...testAudience,
            effects: {
                yes: { gold: -59 },
                no: {},
            },
        };

        const bankruptcyAudience: GameEvent = {
            ...testAudience,
            effects: {
                yes: { gold: -60 },
                no: {},
            },
        };

        const warning = getDecisionConsequences(
            warningAudience,
            "yes",
            createStats({ gold: 10 })
        );

        const bankruptcy = getDecisionConsequences(
            bankruptcyAudience,
            "yes",
            createStats({ gold: 10 })
        );

        expect(warning.nextStats?.gold).toBe(-49);
        expect(warning.showTreasuryWarning).toBe(true);

        expect(bankruptcy.nextStats?.gold).toBe(-50);
        expect(bankruptcy.showTreasuryWarning).toBe(false);
    });
});

describe("Presentación de audiencias", () => {
    it("presenta una audiencia normal", () => {
        const presentation = getAudiencePresentation({
            dayEvents: [testAudience],
            audienceIndex: 0,
            isClosing: false,
            specialAudience: null,
            gameOverReason: null,
            monarch: "king",
        });

        expect(presentation.visitorImage).toBe(
            "/test-character.png"
        );

        expect(presentation.dialogue.speaker).toBe(
            "Visitante de prueba"
        );

        expect(presentation.timeOfDay).toBe("morning");
    });

    it("muestra la noche durante el cierre diario", () => {
        const presentation = getAudiencePresentation({
            dayEvents: [testAudience],
            audienceIndex: 1,
            isClosing: true,
            specialAudience: null,
            gameOverReason: null,
            monarch: "queen",
        });

        expect(presentation.timeOfDay).toBe("night");
        expect(presentation.dialogue.speaker).toBe(
            "Consejera Real"
        );
    });

    it("presenta correctamente el anuncio de derrota", () => {
        const presentation = getAudiencePresentation({
            dayEvents: [],
            audienceIndex: 0,
            isClosing: false,
            specialAudience: "defeat",
            gameOverReason: "bankruptcy",
            monarch: "king",
        });

        expect(presentation.visitorImage).toBe(
            "/assets/characters/courtiers/royal-advisor.png"
        );

        expect(
            presentation.dialogue.introduction.join(" ")
        ).toContain("Bancarrota");
    });

    it("presenta la audiencia de deuda saldada", () => {
        const presentation = getAudiencePresentation({
            dayEvents: [testAudience],
            audienceIndex: 0,
            isClosing: false,
            specialAudience: "treasury-recovery",
            gameOverReason: null,
            monarch: "queen",
        });

        expect(presentation.dialogue.speaker).toBe(
            "Consejera Real"
        );
    });
});

describe("Finalización de audiencias", () => {
    it("envía a GameOver tras el anuncio de derrota", () => {
        expect(
            getAudienceExit({
                ...baseExit,
                specialAudience: "defeat",
            })
        ).toEqual({
            kind: "gameover",
        });
    });

    it("envía al resumen tras el cierre nocturno", () => {
        expect(
            getAudienceExit({
                ...baseExit,
                isClosing: true,
            })
        ).toEqual({
            kind: "summary",
        });
    });

    it("detecta la bancarrota antes de avanzar", () => {
        expect(
            getAudienceExit({
                ...baseExit,
                stats: createStats({ gold: -50 }),
            })
        ).toEqual({
            kind: "defeat",
            reason: "bankruptcy",
        });
    });

    it("prioriza el aviso económico pendiente", () => {
        expect(
            getAudienceExit({
                ...baseExit,
                stats: createStats({ gold: -10 }),
                pendingTreasuryWarning: true,
            })
        ).toEqual({
            kind: "treasury-warning",
        });
    });

    it("cambia de mañana a tarde a mitad de jornada", () => {
        const result = getAudienceExit(baseExit);

        expect(result).toEqual({
            kind: "next-audience",
            index: 1,
            phase: "transitioning",
            clearSpecialAudience: false,
        });
    });

    it("avanza sin transición si continúa el mismo fondo", () => {
        const result = getAudienceExit({
            ...baseExit,
            dayEventsCount: 3,
            morningCount: 2,
        });

        expect(result).toEqual({
            kind: "next-audience",
            index: 1,
            phase: "entering",
            clearSpecialAudience: false,
        });
    });

    it("anuncia la recuperación de la deuda", () => {
        expect(
            getAudienceExit({
                ...baseExit,
                stats: createStats({ gold: 10 }),
                activeModifierIds: ["indebted"],
            })
        ).toEqual({
            kind: "treasury-recovery",
        });
    });

    it("no salda la deuda con el oro exactamente a cero", () => {
        const result = getAudienceExit({
            ...baseExit,
            stats: createStats({ gold: 0 }),
            activeModifierIds: ["indebted"],
        });

        expect(result.kind).toBe("next-audience");
    });

    it("la recuperación nocturna precede al resumen", () => {
        expect(
            getAudienceExit({
                ...baseExit,
                isClosing: true,
                stats: createStats({ gold: 5 }),
                activeModifierIds: ["indebted"],
            })
        ).toEqual({
            kind: "treasury-recovery",
        });
    });
});
