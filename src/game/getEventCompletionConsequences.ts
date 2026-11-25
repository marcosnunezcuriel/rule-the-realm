import { applyStatChanges } from "./applyStatChanges";
import { shouldShowTreasuryWarning } from "./debtFlow";

import type { GameEvent } from "../types/events";
import type { KingdomValues } from "../types/stats";
import type { ModifierId } from "../types/modifiers";

// Las decisiones ya aplicaron sus consecuencias.
// Solo los acontecimientos sin decisión aplican aquí
// sus efectos base.
export function getEventCompletionConsequences(
    audience: GameEvent,
    stats: KingdomValues
): {
    nextStats: KingdomValues | null;
    showTreasuryWarning: boolean;
    unlocks: string[];
    addModifiers: ModifierId[];
    removeModifiers: ModifierId[];
} {
    const changes = !audience.dialogue.responses
        ? audience.baseEffects
        : undefined;

    const nextStats = changes
        ? applyStatChanges(stats, changes)
        : null;

    return {
        nextStats,

        showTreasuryWarning:
            shouldShowTreasuryWarning(
                stats,
                nextStats
            ),

        unlocks: audience.unlocksOnComplete ?? [],

        addModifiers:
            audience.addModifiersOnComplete ?? [],

        removeModifiers:
            audience.removeModifiersOnComplete ?? [],
    };
}
