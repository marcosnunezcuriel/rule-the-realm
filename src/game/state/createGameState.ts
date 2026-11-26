import { getDayEvents } from "../getDayEvents";
import { getDebtAudience } from "../debtFlow";
import { initialKingdomValues } from "../initialState";

import type { GameState } from "../../types/gameState";
import type { SaveGame } from "../../types/saveGame";
import type { MonarchRole } from "../../types/monarch";

import { getSpecialEventForDay } from "../../data/events/eventRegistry";
import { finishSpecialScene } from "./dayState";

// Crear el estado inicial o recuperar una partida existente.
export function createGameState(
    monarch: MonarchRole,
    saved: SaveGame | null = null
): GameState {
    if (saved !== null) {
        const progress: SaveGame = {
            ...saved,
            monarch,
        };

        // Si el acontecimiento especial ya terminó antes de recargar, recuperar directamente el salón del trono.
        if (
            progress.screen === "special-scene" &&
            progress.specialEvent?.completed === true
        ) {
            const restored = finishSpecialScene({
                progress,
                phase: "waiting",
            });

            return {
                ...restored,
                phase: "entering",
            };
        }

        // Recuperar una jornada cuyo cierre económico
        // ya se aplicó antes de recargar el navegador.
        if (
            progress.dayClosed &&
            progress.screen === "scene"
        ) {
            const pendingAudience =
                progress.specialAudience ??
                getDebtAudience(
                    progress.stats,
                    progress.activeModifierIds
                );

            if (pendingAudience === null) {
                progress.screen = "sleep";
            } else if (
                progress.isClosing &&
                progress.specialAudience === null
            ) {
                progress.specialAudience = pendingAudience;
            }
        }

        return {
            progress,
            phase: "entering",
        };
    }

    const initialSpecialEvent =
        getSpecialEventForDay(1, []);

    return {
        progress: {
            monarch,
            day: 1,
            screen: initialSpecialEvent !== undefined
                ? "special-scene"
                : "scene",

            specialEvent: initialSpecialEvent !== undefined
                ? {
                    id: initialSpecialEvent.id,
                    completed: false,
                }
                : null,

            chapterEndingParagraphIndex: 0,

            stats: { ...initialKingdomValues },
            dayStartStats: { ...initialKingdomValues },
            closingStats: null,

            audienceIndex: 0,

            dayEventIds: getDayEvents(1, []).map(
                (event) => event.id
            ),

            isClosing: false,
            dayClosed: false,
            selectedDecision: null,

            unlockedEventIds: [],
            storyFlags: [],
            
            activeModifierIds: [],
            sceneModifierIds: [],

            modifierReport: {
                appliedIds: [],
                totalChanges: {},
            },

            specialAudience: null,
            pendingTreasuryWarning: false,
            gameOverReason: null,
        },

        phase: "entering",
    };
}
