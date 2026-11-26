import { modifierDefinitions } from "../../data/kingdom/modifiers";

import { applyStatChanges } from "./applyStatChanges";

import type {
    ModifierId,
    DailyModifierReport,
} from "../../types/modifiers";
import type {
    KingdomValues,
    StatChanges,
} from "../../types/stats";

type DailyModifierResult = {
    nextStats: KingdomValues;
    report: DailyModifierReport;
};

export function applyDailyModifiers(
    currentStats: KingdomValues,
    activeModifierIds: ModifierId[]
): DailyModifierResult {
    const totalChanges: StatChanges = {};

    // Evitar aplicar modificadores duplicados.
    const uniqueIds = [...new Set(activeModifierIds)];

    for (const id of uniqueIds) {
        const modifier = modifierDefinitions[id];

        for (const key of Object.keys(
            modifier.dailyChanges
        ) as (keyof KingdomValues)[]) {
            const amount = modifier.dailyChanges[key] ?? 0;

            totalChanges[key] =
                (totalChanges[key] ?? 0) + amount;
        }
    }

    return {
        nextStats: applyStatChanges(
            currentStats,
            totalChanges
        ),

        report: {
            appliedIds: uniqueIds,
            totalChanges,
        },
    };
}
