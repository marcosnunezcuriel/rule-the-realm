import type { KingdomValues } from "../types/stats";

export const statDefinitions: {
    key: keyof KingdomValues;
    label: string;
}[] = [
    { key: "gold", label: "Oro" },
    { key: "prestige", label: "Prestigio" },
    { key: "faith", label: "Fe" },
    { key: "population", label: "Población" },
    { key: "army", label: "Ejército" },
];
