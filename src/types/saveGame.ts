import type { Decision } from "./dialogue";
import type {
    GameScreen,
    SpecialAudience,
} from "./game";
import type { GameOverReason } from "./gameOver";
import type {
    DailyModifierReport,
    ModifierId,
} from "./modifiers";
import type { KingdomValues } from "./stats";
import type { MonarchRole } from "./monarch";
import type { StoryFlagId } from "../data/narrative/storyFlags";

// Único formato de guardado del juego.
// Se actualizará cuando evolucionen las mecánicas.
export type SaveGame = {
    monarch: MonarchRole;
    day: number;
    screen: GameScreen;

    chapterEndingParagraphIndex: number;

    stats: KingdomValues;
    dayStartStats: KingdomValues;
    closingStats: KingdomValues | null;

    audienceIndex: number;
    dayEventIds: string[];

    // Acontecimiento especial de la jornada en curso.
    specialEvent: {
        id: string;
        completed: boolean;
    } | null;

    isClosing: boolean;
    dayClosed: boolean;

    selectedDecision: Decision | null;

    unlockedEventIds: string[];
    storyFlags: StoryFlagId[];
    
    activeModifierIds: ModifierId[];
    sceneModifierIds: ModifierId[];

    modifierReport: DailyModifierReport;

    specialAudience: SpecialAudience;
    pendingTreasuryWarning: boolean;
    gameOverReason: GameOverReason | null;
};
