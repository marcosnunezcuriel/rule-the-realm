import { chapters } from "../chapters";

import type { GameEvent } from "../../types/events";

// Registro global de acontecimientos.
const allEvents: GameEvent[] = chapters.flatMap(
    (chapter) => chapter.events
);

// Índices de acontecimientos.
const eventsById = new Map<string, GameEvent>();
const eventsByDay = new Map<number, GameEvent[]>();

const specialEventsByDay =
    new Map<number, GameEvent>();

for (const event of allEvents) {
    if (eventsById.has(event.id)) {
        throw new Error(
            `Identificador de evento duplicado: ${event.id}`
        );
    }

    eventsById.set(event.id, event);

    // Los acontecimientos especiales no forman parte
    // de las audiencias normales del salón del trono.
    if (event.scene?.placement === "start-of-day") {
        if (specialEventsByDay.has(event.day)) {
            throw new Error(
                `Existe más de un evento especial para el día ${event.day}`
            );
        }

        specialEventsByDay.set(
            event.day,
            event
        );

        continue;
    }

    const dayEvents =
        eventsByDay.get(event.day) ?? [];

    dayEvents.push(event);

    eventsByDay.set(
        event.day,
        dayEvents
    );
}

// Recuperar cualquier acontecimiento por su identificador.
export function getEventById(
    id: string
): GameEvent | undefined {
    return eventsById.get(id);
}

// Recuperar las audiencias normales de una jornada.
export function getEventsForDay(
    day: number
): readonly GameEvent[] {
    return eventsByDay.get(day) ?? [];
}

// Recuperar el acontecimiento especial de una jornada
// si existe y cumple sus requisitos de desbloqueo.
export function getSpecialEventForDay(
    day: number,
    unlockedEventIds: readonly string[]
): GameEvent | undefined {
    const event = specialEventsByDay.get(day);

    if (event === undefined) {
        return undefined;
    }

    if (
        event.requiresUnlock &&
        !unlockedEventIds.includes(event.id)
    ) {
        return undefined;
    }

    return event;
}
