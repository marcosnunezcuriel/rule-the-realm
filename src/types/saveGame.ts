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

// Único formato de guardado del juego.
// Se actualizará cuando evolucionen las mecánicas.
export type SaveGame = {
    day: number;
    screen: GameScreen;

    chapterEndingParagraphIndex: number;

    stats: KingdomValues;
    dayStartStats: KingdomValues;
    closingStats: KingdomValues | null;

    audienceIndex: number;
    dayEventIds: string[];

    isClosing: boolean;
    dayClosed: boolean;

    selectedDecision: Decision | null;

    unlockedEventIds: string[];
    activeModifierIds: ModifierId[];
    sceneModifierIds: ModifierId[];

    modifierReport: DailyModifierReport;

    specialAudience: SpecialAudience;
    pendingTreasuryWarning: boolean;
    gameOverReason: GameOverReason | null;
};
