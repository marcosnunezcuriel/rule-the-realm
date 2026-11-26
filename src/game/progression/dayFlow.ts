import { checkGameOver } from "../consequences/checkGameOver";
import { getDayEvents } from "./getDayEvents";

import { getSpecialEventForDay } from "../../data/registries/eventRegistry";

import type { GameEvent } from "../../types/events";
import type { GameOverReason } from "../../types/gameOver";
import type { ModifierId } from "../../types/modifiers";
import type { KingdomValues } from "../../types/stats";

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
    specialEventId: string | null;
    nextSceneModifierIds: ModifierId[];
    isClosing: boolean;
} {
    const nextDay = day + 1;
    const defeat = checkGameOver(stats);

    // Una derrota impide celebrar acontecimientos,
    // incluidos los escenarios especiales.
    const nextDayEvents = defeat !== null
        ? []
        : getDayEvents(
            nextDay,
            unlockedEventIds
        );

    const specialEvent = defeat !== null
        ? undefined
        : getSpecialEventForDay(
            nextDay,
            unlockedEventIds
        );

    return {
        nextDay,
        defeat,
        nextDayEvents,

        specialEventId:
            specialEvent?.id ?? null,

        nextSceneModifierIds: [
            ...activeModifierIds,
        ],

        isClosing:
            defeat === null &&
            specialEvent === undefined &&
            nextDayEvents.length === 0,
    };
}
