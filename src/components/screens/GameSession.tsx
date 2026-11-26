import Header from "../layout/Header";
import GameScreenContent from "./GameScreenContent";

import KingdomStats from "../kingdom/KingdomStats";
import StatChangeToast from "../kingdom/StatChangeToast";

import NotificationToast from "../shared/NotificationToast";
import FadeOverlay from "../shared/FadeOverlay";

import { toRomanNumber } from "../../data/chapters";

import { useGameController } from "../../hooks/useGameController";
import { useGameAudio } from "../../hooks/useGameAudio";

import type { AchievementId } from "../../data/achievements";
import type { ModifierId } from "../../types/modifiers";
import type { KingdomValues } from "../../types/stats";
import type { MonarchRole } from "../../types/monarch";
import type { GameReward } from "../../types/rewards";

import type {
    GameNotification,
    ModifierChange,
} from "../../types/notifications";

type GameSessionProps = {
    monarch: MonarchRole;
    onOpenMenu: () => void;
    onGameOverMenu: () => void;

    onAchievementUnlocked: (id: AchievementId) => void;

    onModifierChanged: (
        id: ModifierId,
        change: ModifierChange
    ) => void;

    onStatsChanged: (
        previous: KingdomValues,
        next: KingdomValues
    ) => void;

    notification: GameNotification | null;

    onSoundSettings: () => void;

    onRewardUnlocked: (reward: GameReward) => void;
};

// Coordinar la interfaz de la partida activa.
function GameSession({
    monarch,
    onOpenMenu,
    onGameOverMenu,
    onAchievementUnlocked,
    onModifierChanged,
    onStatsChanged,
    notification,
    onSoundSettings,
    onRewardUnlocked,
}: GameSessionProps) {
    const controller = useGameController(
        onAchievementUnlocked,
        onModifierChanged,
        onStatsChanged,
        onRewardUnlocked,
        monarch
    );

    const {
        day,
        screen,
        phase,
        dialogueKey,
        chapter,
        visibleStats,
        gameOverReason,
        transitionStage,
        fullScreenFade,
        handleScreenFadeEnd,
    } = controller;

    const isAudienceScreen =
        screen === "scene" ||
        screen === "special-scene";

    useGameAudio({
        day,
        screen,
        phase,
        dialogueKey,
        isAudienceScreen,
    });

    return (
        <>
            {screen !== "chapter-ending" && screen !== "sleep" && (
                <Header
                    chapter={toRomanNumber(chapter.number)}
                    day={day}
                    onSoundSettings={onSoundSettings}
                    onMenu={
                        gameOverReason !== null
                            ? onGameOverMenu
                            : onOpenMenu
                    }
                />
            )}

            <div className="game-content">
                {notification !== null && notification.kind !== "stats" && (
                    <NotificationToast
                        key={notification.sequence}
                        notification={notification}
                    />
                )}

                {isAudienceScreen && notification?.kind === "stats" && (
                    <StatChangeToast
                        key={notification.sequence}
                        notification={notification}
                    />
                )}

                {isAudienceScreen && (
                    <KingdomStats stats={visibleStats} />
                )}

                <GameScreenContent
                    controller={controller}
                    monarch={monarch}
                    onOpenMenu={onOpenMenu}
                    onGameOverMenu={onGameOverMenu}
                />

                <FadeOverlay
                    variant="screen"
                    stage={transitionStage}
                    fullScreen={fullScreenFade}
                    onFadeEnd={handleScreenFadeEnd}
                />
            </div>
        </>
    );
}

export default GameSession;
