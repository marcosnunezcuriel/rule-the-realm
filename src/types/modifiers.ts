import type { StatChanges } from "./stats";

export type ModifierId = "traveling-circus";

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
