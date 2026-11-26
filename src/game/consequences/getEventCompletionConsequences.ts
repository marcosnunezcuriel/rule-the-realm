import type { StoryFlagId } from "../../data/narrative/storyFlags";

import { applyStatChanges } from "./applyStatChanges";
import { shouldShowTreasuryWarning } from "./debtFlow";

import type { GameEvent } from "../../types/events";
import type { ModifierId } from "../../types/modifiers";
import type { KingdomValues } from "../../types/stats";

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
    addStoryFlags: StoryFlagId[];
    removeStoryFlags: StoryFlagId[];
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

        unlocks:
            audience.unlocksOnComplete ?? [],

        addModifiers:
            audience.addModifiersOnComplete ?? [],

        removeModifiers:
            audience.removeModifiersOnComplete ?? [],

        addStoryFlags:
            audience.addStoryFlagsOnComplete ?? [],

        removeStoryFlags:
            audience.removeStoryFlagsOnComplete ?? [],
    };
}
