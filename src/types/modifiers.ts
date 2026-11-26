// Define los modificadores del reino y los informes de sus consecuencias diarias.

import type { StatChanges } from "./stats";

export type ModifierId =
    | "traveling-circus"
    | "high-taxes"
    | "silk-road"
    | "emerald-mine"
    | "modern-windmills"
    | "black-fever"
    | "indebted";

export type ModifierDefinition = {
    id: ModifierId;
    name: string;
    description: string;
    dailyChanges: StatChanges;
};

export type DailyModifierReport = {
    appliedIds: ModifierId[];
    totalChanges: StatChanges;
};
