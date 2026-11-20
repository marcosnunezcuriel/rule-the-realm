import type { Decision } from "./dialogue";
import type { GameScreen } from "./game";
import type { GameOverReason } from "./gameOver";
import type {
    DailyModifierReport,
    ModifierId,
} from "./modifiers";
import type { KingdomValues } from "./stats";

export type SaveGameV1 = {
    version: 1;

    day: number;
    screen: GameScreen;

    chapterEndingParagraphIndex?: number;

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

    specialAudience: "treasury-warning" | "defeat" | null;
    pendingTreasuryWarning: boolean;
    gameOverReason: GameOverReason | null;
};
