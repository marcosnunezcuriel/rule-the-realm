import { demoAudiences } from "../data/demoAudiences";

import type { GameEvent } from "../types/events";

export function getDayEvents(
    day: number,
    unlockedEventIds: string[]
): GameEvent[] {
    return demoAudiences
        .filter((event) => {
            // El evento debe corresponder al día actual.
            if (event.day !== day) {
                return false;
            }

            // Los eventos habituales siempre están disponibles.
            if (!event.requiresUnlock) {
                return true;
            }

            // Los condicionados necesitan haberse desbloqueado.
            return unlockedEventIds.includes(event.id);
        })
        .sort((a, b) => a.order - b.order);
}
