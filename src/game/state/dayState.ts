import { getNextDayPlan } from "../dayFlow";
import { checkGameOver } from "../checkGameOver";

import {
    applyDailyModifiersWithDebt,
    getDebtAudience,
} from "../debtFlow";

import type { GameState } from "../../types/gameState";

// Aplicar los efectos nocturnos una sola vez.
export function closeDay(
    state: GameState
): GameState {
    const progress = state.progress;

    if (progress.dayClosed) {
        return state;
    }

    const result = applyDailyModifiersWithDebt(
        progress.stats,
        progress.activeModifierIds
    );

    return {
        progress: {
            ...progress,

            dayClosed: true,

            closingStats: {
                ...progress.stats,
            },

            stats: result.nextStats,

            modifierReport: result.report,
        },

        phase: "exiting",
    };
}

// Preparar una nueva jornada y determinar
// automáticamente su escenario inicial.
export function startDay(
    state: GameState
): GameState {
    const progress = state.progress;

    if (
        progress.screen !== "summary" &&
        progress.screen !== "chapter-ending"
    ) {
        return state;
    }

    const plan = getNextDayPlan(
        progress.day,
        progress.stats,
        progress.activeModifierIds,
        progress.unlockedEventIds
    );

    const specialEvent =
        plan.specialEventId === null
            ? null
            : {
                id: plan.specialEventId,
                completed: false,
            };

    const nextSpecialAudience =
        plan.defeat !== null
            ? "defeat"
            : specialEvent !== null
                ? null
                : getDebtAudience(
                    progress.stats,
                    progress.activeModifierIds
                );

    return {
        progress: {
            ...progress,

            day: plan.nextDay,

            screen: specialEvent !== null
                ? "special-scene"
                : "scene",

            specialEvent,

            dayStartStats: {
                ...progress.stats,
            },

            closingStats: null,

            dayClosed: false,

            sceneModifierIds:
                plan.nextSceneModifierIds,

            modifierReport: {
                appliedIds: [],
                totalChanges: {},
            },

            dayEventIds: plan.nextDayEvents.map(
                (event) => event.id
            ),

            selectedDecision: null,
            pendingTreasuryWarning: false,

            gameOverReason: plan.defeat,
            specialAudience: nextSpecialAudience,

            audienceIndex:
                nextSpecialAudience === null
                    ? 0
                    : -1,

            isClosing:
                plan.isClosing &&
                nextSpecialAudience === null,
        },

        phase: "waiting",
    };
}

// Regresar al salón del trono después de completar
// cualquier acontecimiento especial.
export function finishSpecialScene(
    state: GameState
): GameState {
    const progress = state.progress;

    if (
        progress.screen !== "special-scene" ||
        progress.specialEvent?.completed !== true
    ) {
        return state;
    }

    const defeat = checkGameOver(
        progress.stats
    );

    const nextSpecialAudience =
        defeat !== null
            ? "defeat"
            : getDebtAudience(
                progress.stats,
                progress.activeModifierIds
            );

    return {
        progress: {
            ...progress,

            screen: "scene",
            specialEvent: null,

            gameOverReason: defeat,
            specialAudience: nextSpecialAudience,

            audienceIndex:
                nextSpecialAudience === null
                    ? 0
                    : -1,

            selectedDecision: null,
            pendingTreasuryWarning: false,

            isClosing:
                progress.dayEventIds.length === 0 &&
                nextSpecialAudience === null,
        },

        phase: "waiting",
    };
}
