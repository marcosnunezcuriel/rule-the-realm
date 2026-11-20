import { getChapterForDay } from "../data/chapters";
import { checkGameOver } from "./checkGameOver";
import { getDayEvents } from "./getDayEvents";

import type { GameEvent } from "../types/events";
import type { GameOverReason } from "../types/gameOver";
import type { ModifierId } from "../types/modifiers";
import type { KingdomValues } from "../types/stats";

// Un capítulo solo se completa si el reino sobrevive
// también a los modificadores del último cierre nocturno.
export function hasCompletedChapter(
    day: number,
    stats: KingdomValues
): boolean {
    const chapter = getChapterForDay(day);

    return (
        chapter !== null &&
        day === chapter.lastDay &&
        checkGameOver(stats) === null
    );
}

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

    // Tras una derrota nocturna, la nueva jornada solo
    // mostrará la audiencia especial de la consejera.
    const nextDayEvents = defeat !== null
        ? []
        : getDayEvents(nextDay, unlockedEventIds);

    return {
        nextDay,
        defeat,
        nextDayEvents,
        nextSceneModifierIds: [...activeModifierIds],
        isClosing: defeat === null && nextDayEvents.length === 0,
    };
}
