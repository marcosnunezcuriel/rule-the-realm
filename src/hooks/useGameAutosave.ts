import { useEffect } from "react";

import { saveGame } from "../storage/gameStorage";

import type { RefObject } from "react";
import type { GameEvent } from "../types/events";
import type { SaveGame } from "../types/saveGame";

type GameAutosaveInput = Omit<
    SaveGame,
    "dayClosed" | "dayEventIds"
> & {
    dayEvents: GameEvent[];
    dayClosedRef: RefObject<boolean>;
};

// Solo guardar cuando cambia el estado lógico de la partida.
// Las fases visuales y los fundidos no provocan guardados.
export function useGameAutosave({
    monarch,
    day,
    screen,
    stats,
    dayStartStats,
    closingStats,
    audienceIndex,
    dayEvents,
    isClosing,
    dayClosedRef,
    selectedDecision,
    unlockedEventIds,
    activeModifierIds,
    sceneModifierIds,
    modifierReport,
    specialAudience,
    pendingTreasuryWarning,
    gameOverReason,
    chapterEndingParagraphIndex,
}: GameAutosaveInput): void {
    useEffect(() => {
        const savedState: SaveGame = {
            monarch,
            day,
            screen,
            stats,
            dayStartStats,
            closingStats,
            audienceIndex,
            dayEventIds: dayEvents.map((event) => event.id),
            isClosing,
            dayClosed: dayClosedRef.current,
            selectedDecision,
            unlockedEventIds,
            activeModifierIds,
            sceneModifierIds,
            modifierReport,
            specialAudience,
            pendingTreasuryWarning,
            gameOverReason,
            chapterEndingParagraphIndex,
        };

        saveGame(savedState);
    }, [
        monarch,
        day,
        screen,
        stats,
        dayStartStats,
        closingStats,
        audienceIndex,
        dayEvents,
        isClosing,
        dayClosedRef,
        selectedDecision,
        unlockedEventIds,
        activeModifierIds,
        sceneModifierIds,
        modifierReport,
        specialAudience,
        pendingTreasuryWarning,
        gameOverReason,
        chapterEndingParagraphIndex,
    ]);
}
