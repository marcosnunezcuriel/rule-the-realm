// Calcula los modificadores resultantes y distingue las altas y las bajas efectivas.

import type { ModifierId } from "../../types/modifiers";

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

    // Incorporar los nuevos modificadores sin duplicarlos.
    for (const id of toAdd) {
        next.add(id);
    }

    // Las retiradas tienen prioridad si un modificador se añade y se elimina en la misma operación.
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
