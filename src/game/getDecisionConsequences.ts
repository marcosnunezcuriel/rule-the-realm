import { applyStatChanges } from "./applyStatChanges";
import { shouldShowTreasuryWarning } from "./debtFlow";

import type { GameEvent } from "../types/events";
import type { Decision } from "../types/dialogue";
import type { KingdomValues } from "../types/stats";
import type { ModifierId } from "../types/modifiers";
import type { StoryFlagId } from "../data/narrative/storyFlags";

// Calcular las consecuencias inmediatas de una decisión.
export function getDecisionConsequences(
    audience: GameEvent,
    answer: Decision,
    stats: KingdomValues
): {
    nextStats: KingdomValues | null;
    showTreasuryWarning: boolean;
    unlocks: string[];
    addModifiers: ModifierId[];
    addStoryFlags: StoryFlagId[];
    removeStoryFlags: StoryFlagId[];
} {
    // Aplicar los efectos comunes y los de la respuesta.
    const baseStats = audience.baseEffects
        ? applyStatChanges(stats, audience.baseEffects)
        : null;

    const changes = audience.effects?.[answer];

    const nextStats = changes
        ? applyStatChanges(baseStats ?? stats, changes)
        : baseStats;

    return {
        nextStats,

        showTreasuryWarning:
            shouldShowTreasuryWarning(
                stats,
                nextStats
            ),

        unlocks:
            audience.unlocks?.[answer] ?? [],

        addModifiers:
            audience.addModifiers?.[answer] ?? [],

        addStoryFlags:
            audience.addStoryFlags?.[answer] ?? [],

        removeStoryFlags:
            audience.removeStoryFlags?.[answer] ?? [],
    };
}
