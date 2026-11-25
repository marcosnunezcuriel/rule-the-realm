import { getNextDayPlan } from "../dayFlow";
import { checkGameOver } from "../checkGameOver";

import {
    applyDailyModifiersWithDebt,
    getDebtAudience,
} from "../debtFlow";

import type { AudienceExit } from "../audienceFlow";
import type { GameState } from "../../types/gameState";
import type { Decision } from "../../types/dialogue";
import type { ModifierId } from "../../types/modifiers";
import type { KingdomValues } from "../../types/stats";

import type {
    AudiencePhase,
    GameScreen,
} from "../../types/game";

type EventChanges = {
    stats: KingdomValues;
    activeModifierIds: ModifierId[];
    pendingTreasuryWarning: boolean;
    unlocks: string[];
};

// Operaciones que pueden modificar el estado de partida.
export type GameAction =
    | {
        type: "SET_PHASE";
        phase: AudiencePhase;
    }
    | {
        type: "SET_SCREEN";
        screen: GameScreen;
    }
    | {
        type: "SET_ENDING_PARAGRAPH";
        index: number;
    }
    | {
        type: "MAKE_DECISION";
        decision: Decision;
        changes: EventChanges;
    }
    | {
        type: "COMPLETE_AUDIENCE";
        changes: EventChanges;
        exit: AudienceExit | null;
    }
    | {
        type: "CONTINUE";
    }
    | {
        type: "START_DAY";
        target: "scene" | "joust";
    }
    | {
        type: "FINISH_JOUST";
    };

// Incorporar nuevos desbloqueos sin duplicarlos.
function mergeUnlocks(
    current: string[],
    added: string[]
): string[] {
    return added.length === 0
        ? current
        : [...new Set([...current, ...added])];
}

// Actualizar el estado sin modificar el estado anterior
// ni ejecutar efectos externos.
export function gameReducer(
    state: GameState,
    action: GameAction
): GameState {
    const progress = state.progress;

    switch (action.type) {
        case "SET_PHASE":
            return state.phase === action.phase
                ? state
                : {
                    ...state,
                    phase: action.phase,
                };

        case "SET_SCREEN":
            return progress.screen === action.screen
                ? state
                : {
                    ...state,
                    progress: {
                        ...progress,
                        screen: action.screen,
                    },
                };

        case "SET_ENDING_PARAGRAPH":
            return progress.chapterEndingParagraphIndex === action.index
                ? state
                : {
                    ...state,
                    progress: {
                        ...progress,
                        chapterEndingParagraphIndex: action.index,
                    },
                };

        case "MAKE_DECISION": {
            if (
                state.phase !== "speaking" ||
                progress.isClosing ||
                progress.specialAudience !== null ||
                progress.selectedDecision !== null
            ) {
                return state;
            }

            const changes = action.changes;

            return {
                ...state,
                progress: {
                    ...progress,

                    selectedDecision: action.decision,
                    stats: changes.stats,

                    activeModifierIds:
                        changes.activeModifierIds,

                    pendingTreasuryWarning:
                        changes.pendingTreasuryWarning,

                    unlockedEventIds: mergeUnlocks(
                        progress.unlockedEventIds,
                        changes.unlocks
                    ),
                },
            };
        }

        case "COMPLETE_AUDIENCE": {
            if (state.phase !== "exiting") {
                return state;
            }

            const changes = action.changes;

            const updated = {
                ...progress,

                stats: changes.stats,

                activeModifierIds:
                    changes.activeModifierIds,

                pendingTreasuryWarning:
                    changes.pendingTreasuryWarning,

                unlockedEventIds: mergeUnlocks(
                    progress.unlockedEventIds,
                    changes.unlocks
                ),
            };

            const exit = action.exit;

            // La justa conserva la decisión hasta
            // regresar al salón del trono.
            if (exit === null) {
                return {
                    progress: updated,
                    phase: "waiting",
                };
            }

            updated.selectedDecision = null;

            switch (exit.kind) {
                case "gameover":
                case "summary":
                    return {
                        progress: updated,
                        phase: "waiting",
                    };

                case "defeat":
                    return {
                        progress: {
                            ...updated,
                            gameOverReason: exit.reason,
                            pendingTreasuryWarning: false,
                            specialAudience: "defeat",
                        },
                        phase: "entering",
                    };

                case "treasury-warning":
                case "treasury-recovery":
                    return {
                        progress: {
                            ...updated,
                            pendingTreasuryWarning: false,
                            specialAudience: exit.kind,
                        },
                        phase: "entering",
                    };

                case "next-audience":
                    return {
                        progress: {
                            ...updated,

                            specialAudience:
                                exit.clearSpecialAudience
                                    ? null
                                    : updated.specialAudience,

                            audienceIndex: exit.index,
                        },
                        phase: exit.phase,
                    };

                case "closing":
                    return {
                        progress: {
                            ...updated,

                            specialAudience:
                                exit.clearSpecialAudience
                                    ? null
                                    : updated.specialAudience,

                            isClosing: true,
                        },
                        phase: "transitioning",
                    };
                
                default:
                    return state;
            }
        }

        case "CONTINUE": {
            if (state.phase !== "speaking") {
                return state;
            }

            // Aplicar los modificadores nocturnos
            // exactamente una vez por jornada.
            if (
                progress.isClosing &&
                progress.specialAudience === null
            ) {
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

            return {
                ...state,
                phase: "exiting",
            };
        }

        case "START_DAY": {
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

            const nextSpecialAudience =
                plan.defeat !== null
                    ? "defeat"
                    : action.target === "joust"
                        ? null
                        : getDebtAudience(
                            progress.stats,
                            progress.activeModifierIds
                        );

            return {
                progress: {
                    ...progress,

                    day: plan.nextDay,
                    screen: action.target,

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

        case "FINISH_JOUST": {
            if (progress.screen !== "joust") {
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
    }
}
