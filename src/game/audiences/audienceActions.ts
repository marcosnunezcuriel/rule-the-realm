import {
    getDecisionAchievements,
    getEventCompletionAchievements,
} from "../../data/registries/achievementRegistry";
import type { AchievementId } from "../../data/registries/achievementRegistry";

import { getAudienceExit } from "./audienceFlow";
import { getDecisionConsequences } from "../consequences/getDecisionConsequences";
import { getEventCompletionConsequences } from "../consequences/getEventCompletionConsequences";
import { getModifierTransition } from "../consequences/getModifierTransition";
import type { ScreenTransitionPlan } from "../progression/screenFlow";
import { getScreenTransition } from "../progression/screenFlow";
import type { GameAction } from "../state/gameReducer";

import type { Decision } from "../../types/dialogue";
import type { GameEvent } from "../../types/events";
import type { GameState } from "../../types/gameState";
import type { ModifierId } from "../../types/modifiers";
import type { ModifierChange } from "../../types/notifications";
import type { GameReward } from "../../types/rewards";
import type { SaveGame } from "../../types/saveGame";
import type { SceneTime } from "../../types/scene";
import type { KingdomValues } from "../../types/stats";

// Efectos externos que el controlador debe ejecutar.
export type GameEffect =
    | {
        kind: "stats";
        previous: KingdomValues;
        next: KingdomValues;
    }
    | {
        kind: "modifier";
        id: ModifierId;
        change: ModifierChange;
    }
    | {
        kind: "achievement";
        id: AchievementId;
    }
    | {
        kind: "reward";
        reward: GameReward;
    };

type AudienceAction = Extract<
    GameAction,
    {
        type:
            | "MAKE_DECISION"
            | "COMPLETE_AUDIENCE";
    }
>;

type EventChanges = AudienceAction["changes"];

type Consequences =
    ReturnType<typeof getDecisionConsequences> & {
        removeModifiers?: ModifierId[];
    };

export type AudienceOperation = {
    action: AudienceAction;
    effects: GameEffect[];
    transition: ScreenTransitionPlan | null;
};

// Calcular los modificadores resultantes y preparar
// las notificaciones correspondientes.
function collectModifierChanges(
    currentIds: ModifierId[],
    effects: GameEffect[],
    toAdd: ModifierId[] = [],
    toRemove: ModifierId[] = []
): ModifierId[] {
    const transition = getModifierTransition(
        currentIds,
        toAdd,
        toRemove
    );

    if (
        transition.added.length === 0 &&
        transition.removed.length === 0
    ) {
        return currentIds;
    }

    for (const id of transition.added) {
        effects.push({
            kind: "modifier",
            id,
            change: "added",
        });
    }

    for (const id of transition.removed) {
        effects.push({
            kind: "modifier",
            id,
            change: "removed",
        });
    }

    return transition.next;
}

// Preparar los cambios de un acontecimiento
// sin modificar el estado de partida.
function collectConsequences(
    progress: SaveGame,
    consequences: Consequences | null,
    effects: GameEffect[]
): EventChanges {
    if (consequences?.nextStats != null) {
        effects.push({
            kind: "stats",
            previous: progress.stats,
            next: consequences.nextStats,
        });
    }

    return {
        stats:
            consequences?.nextStats ??
            progress.stats,

        activeModifierIds:
            collectModifierChanges(
                progress.activeModifierIds,
                effects,
                consequences?.addModifiers,
                consequences?.removeModifiers
            ),

        pendingTreasuryWarning:
            progress.pendingTreasuryWarning ||
            (consequences?.showTreasuryWarning ?? false),

        unlocks:
            consequences?.unlocks ?? [],

        addStoryFlags:
            consequences?.addStoryFlags ?? [],

        removeStoryFlags:
            consequences?.removeStoryFlags ?? [],
            };
}

// Preparar las recompensas declaradas por un acontecimiento.
function collectRewards(
    rewards: readonly GameReward[],
    effects: GameEffect[]
): void {
    for (const reward of rewards) {
        effects.push({
            kind: "reward",
            reward,
        });
    }
}

// Preparar una decisión del jugador.
export function planDecision(
    state: GameState,
    audience: GameEvent | undefined,
    answer: Decision
): AudienceOperation | null {
    const progress = state.progress;

    if (
        progress.isClosing ||
        progress.specialAudience !== null ||
        state.phase !== "speaking" ||
        progress.selectedDecision !== null ||
        audience === undefined
    ) {
        return null;
    }

    const effects: GameEffect[] = [];

    const consequences = getDecisionConsequences(
        audience,
        answer,
        progress.stats
    );

    const changes = collectConsequences(
        progress,
        consequences,
        effects
    );

    const achievements = getDecisionAchievements(
        audience.id,
        answer
    );

    for (const id of achievements) {
        effects.push({
            kind: "achievement",
            id,
        });
    }

    collectRewards(
        audience.rewards?.[answer] ?? [],
        effects
    );

    return {
        action: {
            type: "MAKE_DECISION",
            decision: answer,
            changes,
        },

        effects,
        transition: null,
    };
}

type AudienceCompletionInput = {
    currentAudience: GameEvent | undefined;
    morningCount: number;
    timeOfDay: SceneTime;
};

// Preparar la finalización de la audiencia actual.
export function planAudienceCompletion(
    state: GameState,
    {
        currentAudience,
        morningCount,
        timeOfDay,
    }: AudienceCompletionInput
): AudienceOperation | null {
    if (
        state.phase !== "exiting" ||
        state.progress.specialEvent?.completed === true
    ) {
        return null;
    }

    const progress = state.progress;
    const effects: GameEffect[] = [];

    const audience =
        !progress.isClosing &&
        progress.specialAudience === null
            ? currentAudience
            : undefined;

    const completion = audience
        ? getEventCompletionConsequences(
            audience,
            progress.stats
        )
        : null;

    const changes = collectConsequences(
        progress,
        completion,
        effects
    );

    // Recompensas por completar acontecimientos.
    if (audience !== undefined) {
        const achievements =
            getEventCompletionAchievements(
                audience.id
            );

        for (const id of achievements) {
            effects.push({
                kind: "achievement",
                id,
            });
        }

        collectRewards(
            audience.rewardsOnComplete ?? [],
            effects
        );
    }

    // Activar los intereses tras el aviso de deuda.
    if (
        progress.specialAudience === "treasury-warning" &&
        changes.stats.gold < 0
    ) {
        changes.activeModifierIds =
            collectModifierChanges(
                changes.activeModifierIds,
                effects,
                ["indebted"]
            );
    }

    // Cancelar los intereses tras saldar la deuda.
    if (
        progress.specialAudience === "treasury-recovery" &&
        changes.stats.gold > 0
    ) {
        changes.activeModifierIds =
            collectModifierChanges(
                changes.activeModifierIds,
                effects,
                [],
                ["indebted"]
            );
    }

    const exit = progress.screen === "special-scene"
        ? null
        : getAudienceExit({
            specialAudience:
                progress.specialAudience,

            isClosing: progress.isClosing,

            stats: changes.stats,

            pendingTreasuryWarning:
                changes.pendingTreasuryWarning,

            activeModifierIds:
                changes.activeModifierIds,

            audienceIndex:
                progress.audienceIndex,

            dayEventsCount:
                progress.dayEventIds.length,

            morningCount,
            timeOfDay,
        });

    let transition: ScreenTransitionPlan | null =
        null;

    if (exit === null) {
        transition = getScreenTransition(
            progress.screen,
            {
                type: "FINISH_SPECIAL_SCENE",
            }
        );
    } else if (exit.kind === "gameover") {
        transition = getScreenTransition(
            progress.screen,
            {
                type: "SET_SCREEN",
                screen: "gameover",
            }
        );
    } else if (exit.kind === "summary") {
        transition = getScreenTransition(
            progress.screen,
            {
                type: "SET_SCREEN",
                screen: "sleep",
            }
        );
    }

    return {
        action: {
            type: "COMPLETE_AUDIENCE",
            changes,
            exit,
        },

        effects,
        transition,
    };
}
