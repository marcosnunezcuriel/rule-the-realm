import type { KingdomValues } from "../../types/stats";

type StatDefinition = {
    key: keyof KingdomValues;
    label: string;
    color: string;
};

// Los colores proceden de src/styles/tokens/colours.css.
// Los componentes reciben el nombre de la variable, no un color duplicado.
export const statDefinitions: StatDefinition[] = [
    {
        key: "gold",
        label: "Oro",
        color: "var(--colour-stat-gold)",
    },
    {
        key: "prestige",
        label: "Prestigio",
        color: "var(--colour-stat-prestige)",
    },
    {
        key: "faith",
        label: "Fe",
        color: "var(--colour-stat-faith)",
    },
    {
        key: "population",
        label: "Población",
        color: "var(--colour-stat-population)",
    },
    {
        key: "army",
        label: "Ejército",
        color: "var(--colour-stat-army)",
    },
];
