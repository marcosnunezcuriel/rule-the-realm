import type { SaveGame } from "../../types/saveGame";

import { createStats } from "./createStats";

export function createSave(
    overrides: Partial<SaveGame> = {}
): SaveGame {
    return {
        monarch: "king",
        day: 1,
        screen: "scene",

        stats: createStats(),
        dayStartStats: createStats(),
        closingStats: null,

        audienceIndex: 0,

        dayEventIds: [
            "1", "2", "3", "4", "5",
            "6", "7", "8", "9", "10",
        ],

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

        chapterEndingParagraphIndex: 0,

        ...overrides,
    };
}