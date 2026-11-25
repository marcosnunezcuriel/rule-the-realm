import {
    closingDialogue,
    treasuryWarningDialogue,
    treasuryRecoveryDialogue,
    getDefeatAnnouncementDialogue,
} from "../data/narrative/specialAudiences";
import { BANKRUPTCY_LIMIT } from "../data/kingdom/rules";
import { applyStatChanges } from "./applyStatChanges";
import { checkGameOver } from "./checkGameOver";

import { getDebtAudience } from "./debtFlow";

import type { DialogueEvent, Decision } from "../types/dialogue";
import type { GameEvent } from "../types/events";
import type {
    AudiencePhase,
    SpecialAudience,
} from "../types/game";
import type { SceneTime } from "../types/scene";
import type { GameOverReason } from "../types/gameOver";
import type { ModifierId } from "../types/modifiers";
import type { KingdomValues } from "../types/stats";

import { adaptDialogueForMonarch } from "./adaptDialogueForMonarch";
import type { MonarchRole } from "../types/monarch";

type AudiencePresentationInput = {
    monarch: MonarchRole;
    dayEvents: GameEvent[];
    audienceIndex: number;
    isClosing: boolean;
    specialAudience: SpecialAudience;
    gameOverReason: GameOverReason | null;
};

export function getAudiencePresentation({
    dayEvents,
    audienceIndex,
    isClosing,
    specialAudience,
    gameOverReason,
    monarch,
}: AudiencePresentationInput): {
    currentAudience: GameEvent | undefined;
    morningCount: number;
    timeOfDay: SceneTime;
    visitorImage: string;
    dialogue: DialogueEvent;
    dialogueKey: string;
    continueLabel: string;
} {
    const currentAudience = dayEvents[audienceIndex];
    const morningCount = Math.ceil(dayEvents.length / 2);

    const timeOfDay: SceneTime = isClosing
        ? "night"
        : dayEvents.length === 0 || audienceIndex < morningCount
            ? "morning"
            : "evening";

    const visitorImage =
        isClosing || specialAudience !== null || !currentAudience
            ? "/assets/characters/courtiers/royal-advisor.png"
            : currentAudience.id === "10" && monarch === "queen"
                ? "/assets/characters/royalty/king-standing.png"
                : currentAudience.image;

    const originalDialogue =
        specialAudience === "defeat" && gameOverReason !== null
            ? getDefeatAnnouncementDialogue(gameOverReason)
            : specialAudience === "treasury-warning"
                ? treasuryWarningDialogue
                : specialAudience === "treasury-recovery"
                    ? treasuryRecoveryDialogue
                    : isClosing || !currentAudience
                        ? closingDialogue
                        : currentAudience.dialogue;

    const dialogue = adaptDialogueForMonarch(
        originalDialogue,
        specialAudience === null && !isClosing
            ? currentAudience?.id
            : undefined,
        monarch
    );

    const dialogueKey =
        specialAudience === "defeat"
            ? `defeat-${gameOverReason}`
            : specialAudience === "treasury-warning"
                ? "treasury-warning"
                : specialAudience === "treasury-recovery"
                    ? "treasury-recovery"
                    : isClosing
                        ? "closing"
                        : currentAudience?.id ?? "no-audiences";

    return {
        currentAudience,
        morningCount,
        timeOfDay,
        visitorImage,
        dialogue,
        dialogueKey,
        continueLabel:
            isClosing && specialAudience === null
                ? "Terminar día"
                : "Continuar",
    };
}

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

    // Al terminar la noche, comprobar si los cambios
    // económicos requieren una última audiencia.
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

        // Atender el aviso de tesorería pendiente antes de avanzar a la siguiente audiencia.
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

export function getDecisionConsequences(
    audience: GameEvent,
    answer: Decision,
    stats: KingdomValues
): {
    nextStats: KingdomValues | null;
    showTreasuryWarning: boolean;
    unlocks: string[];
    addModifiers: ModifierId[];
} {
    // Sumar los efectos comunes del acontecimiento y los de
    // la decisión, sin perder valores de una misma estadística.
    const baseStats = audience.baseEffects
        ? applyStatChanges(stats, audience.baseEffects)
        : null;

    const changes = audience.effects?.[answer];
    const nextStats = changes
        ? applyStatChanges(baseStats ?? stats, changes)
        : baseStats;

    const showTreasuryWarning =
        nextStats !== null &&
        stats.gold >= 0 &&
        nextStats.gold < 0 &&
        nextStats.gold > BANKRUPTCY_LIMIT &&
        checkGameOver(nextStats) === null;

    return {
        nextStats,
        showTreasuryWarning,
        unlocks: audience.unlocks?.[answer] ?? [],
        addModifiers: audience.addModifiers?.[answer] ?? [],
    };
}
