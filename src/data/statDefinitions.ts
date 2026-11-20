
import type { KingdomValues } from "../types/stats";

type StatDefinition = {
    key: keyof KingdomValues;
    label: string;
    color: string;
};

export const statDefinitions: StatDefinition[] = [
    {
        key: "gold",
        label: "Oro",
        color: "#d4a73e",
    },
    {
        key: "prestige",
        label: "Prestigio",
        color: "#e58a35",
    },
    {
        key: "faith",
        label: "Fe",
        color: "#a77bd8",
    },
    {
        key: "population",
        label: "Población",
        color: "#397fb9",
    },
    {
        key: "army",
        label: "Ejército",
        color: "#368a5d",
    },
];
