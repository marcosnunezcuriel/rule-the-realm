import type { GameEvent } from "../../types/events";

import { chapter1Events } from "./chapter1";

// Registro global. Los próximos capítulos se añadirán aquí.
const allEvents: GameEvent[] = [
    ...chapter1Events,
];

// Índices para encontrar eventos sin recorrer todos los archivos.
const eventsById = new Map<string, GameEvent>();
const eventsByDay = new Map<number, GameEvent[]>();

for (const event of allEvents) {
    // Los identificadores deben ser únicos en todo el juego.
    // Un duplicado podría restaurar la audiencia equivocada
    // al cargar una partida guardada.
    if (eventsById.has(event.id)) {
        throw new Error(
            `Identificador de evento duplicado: ${event.id}`
        );
    }

    eventsById.set(event.id, event);

    const dayEvents = eventsByDay.get(event.day) ?? [];

    dayEvents.push(event);
    eventsByDay.set(event.day, dayEvents);
}

// Recuperar un evento concreto mediante su identificador.
export function getEventById(
    id: string
): GameEvent | undefined {
    return eventsById.get(id);
}

// Recuperar los eventos definidos para una jornada.
// Todavía no se comprueban aquí los desbloqueos.
export function getEventsForDay(
    day: number
): readonly GameEvent[] {
    return eventsByDay.get(day) ?? [];
}
