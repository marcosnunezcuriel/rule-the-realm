import type { ModifierId } from "../types/modifiers";

export type ModifierTransition = {
    next: ModifierId[];
    added: ModifierId[];
    removed: ModifierId[];
};

export function getModifierTransition(
    current: ModifierId[],
    toAdd: ModifierId[] = [],
    toRemove: ModifierId[] = []
): ModifierTransition {
    const previous = new Set(current);
    const next = new Set(current);

    // Primero añadir los nuevos modificadores.
    for (const id of toAdd) {
        next.add(id);
    }

    // Después retirar los que hayan finalizado.
    for (const id of toRemove) {
        next.delete(id);
    }

    const nextIds = [...next];

    return {
        next: nextIds,

        added: nextIds.filter(
            (id) => !previous.has(id)
        ),

        removed: [...previous].filter(
            (id) => !next.has(id)
        ),
    };
}
