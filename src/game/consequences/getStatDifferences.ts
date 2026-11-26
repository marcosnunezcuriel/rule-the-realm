import { statDefinitions } from "../../data/kingdom/statDefinitions";

import type {
    KingdomValues,
    StatChanges,
} from "../../types/stats";

// Calcula los cambios reales, incluyendo únicamente
// las estadísticas cuyo valor es diferente.
export function getStatDifferences(
    previous: KingdomValues,
    next: KingdomValues
): StatChanges {
    const changes: StatChanges = {};

    for (const { key } of statDefinitions) {
        const difference = Number(
            (next[key] - previous[key]).toFixed(10)
        );

        if (difference !== 0) {
            changes[key] = difference;
        }
    }

    return changes;
}
