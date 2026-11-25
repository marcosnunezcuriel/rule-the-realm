import { checkGameOver } from "./checkGameOver";
import { getDayEvents } from "./getDayEvents";

import type { GameEvent } from "../types/events";
import type { GameOverReason } from "../types/gameOver";
import type { ModifierId } from "../types/modifiers";
import type { KingdomValues } from "../types/stats";
import type { SaveGame } from "../types/saveGame";

// Determinar en qué escenario comienza la siguiente jornada.
export function getDayStartTarget(
    progress: Pick<
        SaveGame,
        "day" | "stats" | "unlockedEventIds"
    >
): "scene" | "joust" {
    const shouldShowJoust =
        progress.day === 1 &&
        progress.unlockedEventIds.includes("2.1") &&
        checkGameOver(progress.stats) === null;

    return shouldShowJoust
        ? "joust"
        : "scene";
}

// Preparar los acontecimientos y condiciones
// de la siguiente jornada.
export function getNextDayPlan(
    day: number,
    stats: KingdomValues,
    activeModifierIds: ModifierId[],
    unlockedEventIds: string[]
): {
    nextDay: number;
    defeat: GameOverReason | null;
    nextDayEvents: GameEvent[];
    nextSceneModifierIds: ModifierId[];
    isClosing: boolean;
} {
    const nextDay = day + 1;
    const defeat = checkGameOver(stats);

    // Una derrota nocturna impide que se celebren
    // las audiencias normales del nuevo día.
    const nextDayEvents = defeat !== null
        ? []
        : getDayEvents(
            nextDay,
            unlockedEventIds
        );

    return {
        nextDay,
        defeat,
        nextDayEvents,

        nextSceneModifierIds: [
            ...activeModifierIds,
        ],

        isClosing:
            defeat === null &&
            nextDayEvents.length === 0,
    };
}
