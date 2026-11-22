import type { StatChanges } from "./stats";

export type ModifierId =
    | "traveling-circus"
    | "high-taxes"
    | "silk-road"
    | "emerald-mine"
    | "modern-windmills"
    | "black-fever";

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
