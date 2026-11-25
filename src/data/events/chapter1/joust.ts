import type { GameEvent } from "../../../types/events";

// Evento especial — Torneo de la coronación.
export const joustEvent: GameEvent = {
    id: "2.1",
    day: 2,
    order: 1,
    requiresUnlock: true,
    image: "/assets/characters/commoners/knight-champion.png",
    dialogue: {
        speaker: "Caballero campeón",
        introduction: [
            "¡Salud, Majestad! Fui yo quien alzó la espada victorioso en el gran torneo de la coronación.",
            "La gloria está muy bien, pero la sangre derramada y el esfuerzo merecen una recompensa real.",
            "Exijo la bolsa de oro prometida al campeón.",
        ],
        responses: {
            yes: [
                "Juro lealtad eterna a vuestra espada y me uno humildemente a vuestras filas.",
            ],
            no: [
                "¿Me negáis el oro que gané con sudor y acero?",
                "¡Esto es una afrenta imperdonable para un caballero!",
                "Me voy de vuestra corte con mis hombres. Buscaos a otros héroes que os salven el pellejo.",
            ],
        },
    },
    effects: {
        yes: { gold: -15, army: 10 },
        no: { army: -10 },
    },
};