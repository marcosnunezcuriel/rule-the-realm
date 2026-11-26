// Determina si el estado del reino provoca una derrota.

import { BANKRUPTCY_LIMIT } from "../../data/kingdom/rules";

import type { GameOverReason } from "../../types/gameOver";
import type { KingdomValues } from "../../types/stats";

export function checkGameOver(
    stats: KingdomValues
): GameOverReason | null {
    // Si coinciden varias causas de derrota, prevalece la primera según este orden.
    if (stats.gold <= BANKRUPTCY_LIMIT) {
        return "bankruptcy";
    }

    if (stats.population <= 0) {
        return "abandoned";
    }

    if (stats.army <= 0) {
        return "invasion";
    }

    if (stats.faith <= 0) {
        return "religious-crisis";
    }

    if (stats.prestige <= 0) {
        return "overthrown";
    }

    return null;
}
