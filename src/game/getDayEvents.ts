import { getEventsForDay } from "../data/events/eventRegistry";

import type { GameEvent } from "../types/events";

export function getDayEvents(
    day: number,
    unlockedEventIds: string[]
): GameEvent[] {
    return getEventsForDay(day)
        .filter((event) => {
            // Los eventos habituales siempre están disponibles.
            if (!event.requiresUnlock) {
                return true;
            }

            // Los condicionados necesitan haberse desbloqueado.
            return unlockedEventIds.includes(event.id);
        })
        .sort((a, b) => a.order - b.order);
}
