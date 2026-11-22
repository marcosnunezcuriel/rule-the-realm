import type {
    ModifierDefinition,
    ModifierId,
} from "../../types/modifiers";

// El PDF fija cuándo comienza y termina cada modificador,
// pero no cuantifica los efectos diarios de los cinco nuevos.
// No inventar cifras: definirlas al equilibrar las reglas.
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
            "El reino aplica tasas extraordinarias. " +
            "Pendiente de definir su efecto diario.",
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
            "Una nueva ruta comercial une Astaria con el Imperio Oriental. " +
            "Pendiente de definir su efecto diario.",
        dailyChanges: {
            gold: 4,
        },
    },
    "emerald-mine": {
        id: "emerald-mine",
        name: "Mina de esmeraldas",
        description:
            "La explotación minera genera nuevas riquezas. " +
            "Pendiente de definir su efecto diario.",
        dailyChanges: {
            gold: 12
        },
    },
    "modern-windmills": {
        id: "modern-windmills",
        name: "Molinos modernos",
        description:
            "Las nuevas aspas aceleran la molienda del grano. " +
            "Pendiente de definir su efecto diario.",
        dailyChanges: {
            gold: 7,
            prestige: 2
        },
    },
    "black-fever": {
        id: "black-fever",
        name: "Fiebre negra",
        description:
            "Una grave epidemia asola Astaria. " +
            "Pendiente de definir su efecto diario.",
        dailyChanges: {
            population: -10,
        },
    },
};
