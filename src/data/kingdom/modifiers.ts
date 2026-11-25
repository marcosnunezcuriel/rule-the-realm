import type {
    ModifierDefinition,
    ModifierId,
} from "../../types/modifiers";

// Definiciones de los modificadores del reino
// y sus consecuencias al finalizar cada jornada.
export const modifierDefinitions: Record<
    ModifierId,
    ModifierDefinition
> = {
    "traveling-circus": {
        id: "traveling-circus",
        name: "Circo ambulante",
        description:
            "Los espectáculos atraen visitantes, generan ingresos " +
            "y mejoran la reputación de la corona.",
        dailyChanges: {
            gold: 5,
            population: 2,
            prestige: 2,
        },
    },

    "high-taxes": {
        id: "high-taxes",
        name: "Impuestos altos",
        description:
            "La corona aplica tasas extraordinarias que aumentan " +
            "los ingresos, pero provocan el descontento del pueblo.",
        dailyChanges: {
            gold: 12,
            population: -3,
            prestige: -3,
        },
    },

    "silk-road": {
        id: "silk-road",
        name: "Ruta de la seda",
        description:
            "Una nueva ruta comercial une Astaria con el Imperio Oriental, " +
            "aumentando los ingresos del reino.",
        dailyChanges: {
            gold: 4,
        },
    },

    "emerald-mine": {
        id: "emerald-mine",
        name: "Mina de esmeraldas",
        description:
            "La explotación minera genera nuevas riquezas " +
            "para las arcas de la corona.",
        dailyChanges: {
            gold: 12,
        },
    },

    "modern-windmills": {
        id: "modern-windmills",
        name: "Molinos modernos",
        description:
            "Las nuevas aspas aceleran la molienda del grano, " +
            "aumentando los ingresos y el prestigio del reino.",
        dailyChanges: {
            gold: 7,
            prestige: 2,
        },
    },

    "black-fever": {
        id: "black-fever",
        name: "Fiebre negra",
        description:
            "Una grave epidemia asola Astaria, " +
            "reduciendo progresivamente su población.",
        dailyChanges: {
            population: -10,
        },
    },

    "indebted": {
        id: "indebted",
        name: "Endeudado",
        description:
            "La Corona debe pagar cinco monedas de oro " +
            "diarias en concepto de intereses.",
        dailyChanges: {
            gold: -5,
        },
    },
};
