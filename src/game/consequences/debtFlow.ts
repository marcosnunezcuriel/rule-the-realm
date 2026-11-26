import { applyDailyModifiers } from "./applyDailyModifiers";
import { checkGameOver } from "./checkGameOver";

import { BANKRUPTCY_LIMIT } from "../../data/kingdom/rules";

import type { ModifierId } from "../../types/modifiers";
import type { KingdomValues } from "../../types/stats";

export type DebtAudience =
    | "treasury-warning"
    | "treasury-recovery";

// Determinar qué audiencia económica corresponde.
// La bancarrota y las demás derrotas tienen prioridad.
export function getDebtAudience(
    stats: KingdomValues,
    activeModifierIds: ModifierId[]
): DebtAudience | null {
    if (checkGameOver(stats) !== null) {
        return null;
    }

    const isIndebted = activeModifierIds.includes("indebted");

    if (stats.gold < 0 && !isIndebted) {
        return "treasury-warning";
    }

    if (stats.gold > 0 && isIndebted) {
        return "treasury-recovery";
    }

    return null;
}

// Aplicar los efectos nocturnos.
// Si los otros modificadores saldan la deuda,
// no se cobran intereses esa misma noche.
export function applyDailyModifiersWithDebt(
    currentStats: KingdomValues,
    activeModifierIds: ModifierId[]
) {
    if (!activeModifierIds.includes("indebted")) {
        return applyDailyModifiers(
            currentStats,
            activeModifierIds
        );
    }

    const otherModifiers = activeModifierIds.filter(
        (id) => id !== "indebted"
    );

    const withoutInterest = applyDailyModifiers(
        currentStats,
        otherModifiers
    );

    // Se considera recuperado solamente si el oro
    // es estrictamente positivo.
    if (withoutInterest.nextStats.gold > 0) {
        return withoutInterest;
    }

    return applyDailyModifiers(
        currentStats,
        activeModifierIds
    );
}

// Detectar cuándo una consecuencia introduce al reino
// en una situación de deuda que no supone una derrota.
export function shouldShowTreasuryWarning(
    previous: KingdomValues,
    next: KingdomValues | null
): boolean {
    return (
        next !== null &&
        previous.gold >= 0 &&
        next.gold < 0 &&
        next.gold > BANKRUPTCY_LIMIT &&
        checkGameOver(next) === null
    );
}