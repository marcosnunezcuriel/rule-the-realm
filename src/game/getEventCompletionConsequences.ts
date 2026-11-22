import { BANKRUPTCY_LIMIT } from "../data/kingdom/rules";
import { applyStatChanges } from "./applyStatChanges";
import { checkGameOver } from "./checkGameOver";

import type { GameEvent } from "../types/events";
import type { KingdomValues } from "../types/stats";
import type { ModifierId } from "../types/modifiers";

// Las decisiones aplicaron ya sus consecuencias al responder.
// Solo las audiencias sin decisión aplican aquí los efectos base.
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
            nextStats !== null &&
            stats.gold > 0 &&
            nextStats.gold <= 0 &&
            nextStats.gold > BANKRUPTCY_LIMIT &&
            checkGameOver(nextStats) === null,
        unlocks: audience.unlocksOnComplete ?? [],
        addModifiers: audience.addModifiersOnComplete ?? [],
        removeModifiers: audience.removeModifiersOnComplete ?? [],
    };
}
