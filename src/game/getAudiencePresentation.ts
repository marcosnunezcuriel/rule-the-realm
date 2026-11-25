import {
    closingDialogue,
    treasuryWarningDialogue,
    treasuryRecoveryDialogue,
    getDefeatAnnouncementDialogue,
} from "../data/narrative/specialAudiences";

import { adaptDialogueForMonarch } from "./adaptDialogueForMonarch";

import type { DialogueEvent } from "../types/dialogue";
import type { GameEvent } from "../types/events";
import type { SpecialAudience } from "../types/game";
import type { SceneTime } from "../types/scene";
import type { GameOverReason } from "../types/gameOver";
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
