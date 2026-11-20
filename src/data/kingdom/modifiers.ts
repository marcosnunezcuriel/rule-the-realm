import type {
    ModifierDefinition,
    ModifierId,
} from "../../types/modifiers";

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
};
