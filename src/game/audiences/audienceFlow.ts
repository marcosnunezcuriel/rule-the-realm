import { checkGameOver } from "../consequences/checkGameOver";
import { getDebtAudience } from "../consequences/debtFlow";

import type {
    AudiencePhase,
    SpecialAudience,
} from "../../types/game";
import type { GameOverReason } from "../../types/gameOver";
import type { ModifierId } from "../../types/modifiers";
import type { SceneTime } from "../../types/scene";
import type { KingdomValues } from "../../types/stats";

type AudienceExitInput = {
    specialAudience: SpecialAudience;
    isClosing: boolean;
    stats: KingdomValues;
    pendingTreasuryWarning: boolean;
    audienceIndex: number;
    dayEventsCount: number;
    morningCount: number;
    timeOfDay: SceneTime;
    activeModifierIds: ModifierId[];
};

export type AudienceExit =
    | { kind: "gameover" }
    | { kind: "summary" }
    | { kind: "defeat"; reason: GameOverReason }
    | { kind: "treasury-warning" }
    | { kind: "treasury-recovery" }
    | {
        kind: "next-audience";
        index: number;
        phase: AudiencePhase;
        clearSpecialAudience: boolean;
    }
    | {
        kind: "closing";
        clearSpecialAudience: boolean;
    };

// Determinar qué ocurre al finalizar una audiencia.
export function getAudienceExit({
    specialAudience,
    isClosing,
    stats,
    pendingTreasuryWarning,
    activeModifierIds,
    audienceIndex,
    dayEventsCount,
    morningCount,
    timeOfDay,
}: AudienceExitInput): AudienceExit {
    if (specialAudience === "defeat") {
        return { kind: "gameover" };
    }

    // Comprobar las audiencias económicas pendientes
    // antes de terminar la jornada.
    if (isClosing) {
        if (specialAudience === null) {
            const debtAudience = getDebtAudience(
                stats,
                activeModifierIds
            );

            if (debtAudience !== null) {
                return { kind: debtAudience };
            }
        }

        return { kind: "summary" };
    }

    const clearSpecialAudience =
        specialAudience === "treasury-warning" ||
        specialAudience === "treasury-recovery";

    if (!clearSpecialAudience) {
        const defeat = checkGameOver(stats);

        if (defeat !== null) {
            return {
                kind: "defeat",
                reason: defeat,
            };
        }

        if (
            pendingTreasuryWarning &&
            stats.gold < 0 &&
            !activeModifierIds.includes("indebted")
        ) {
            return { kind: "treasury-warning" };
        }

        const debtAudience = getDebtAudience(
            stats,
            activeModifierIds
        );

        if (debtAudience !== null) {
            return { kind: debtAudience };
        }
    }

    const nextIndex = audienceIndex + 1;

    if (nextIndex < dayEventsCount) {
        const nextTimeOfDay =
            nextIndex < morningCount
                ? "morning"
                : "evening";

        return {
            kind: "next-audience",
            index: nextIndex,

            phase: nextTimeOfDay !== timeOfDay
                ? "transitioning"
                : "entering",

            clearSpecialAudience,
        };
    }

    return {
        kind: "closing",
        clearSpecialAudience,
    };
}
