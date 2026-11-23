import Header from "../layout/Header";
import ThroneScene from "../scene/ThroneScene";
import DialogueController from "../narrative/DialogueController";
import DaySummary from "./DaySummary";
import KingdomStats from "../kingdom/KingdomStats";
import GameOver from "./GameOver";
import ChapterEnding from "./ChapterEnding";

import { toRomanNumber } from "../../data/chapters";
import type { AchievementId } from "../../data/achievements";

import { useGameController } from "../../hooks/useGameController";
import NotificationToast from "../shared/NotificationToast";

import type { ModifierId } from "../../types/modifiers";
import type {
    GameNotification,
    ModifierChange,
} from "../../types/notifications";

import NightRest from "./NightRest";

type GameSessionProps = {
    onOpenMenu: () => void;
    onGameOverMenu: () => void;

    onAchievementUnlocked: (id: AchievementId) => void;
    onModifierChanged: (
        id: ModifierId,
        change: ModifierChange
    ) => void;

    notification: GameNotification | null;
    onDismissNotification: () => void;
};


// Presentación de la partida activa.
// El controlador solo existe mientras estamos jugando.
function GameSession({
    onOpenMenu,
    onGameOverMenu,
    onAchievementUnlocked,
    onModifierChanged,
    notification,
    onDismissNotification,
}: GameSessionProps) {

    const {
        day,
        screen,
        phase,
        timeOfDay,
        backgroundMap,
        visitorImage,
        dialogue,
        dialogueKey,
        continueLabel,
        selectedDecision,
        stats,
        visibleStats,
        dayStartStats,
        modifierReport,
        transitionStage,
        gameOverReason,
        handleVisitorAnimationEnd,
        handleDecision,
        handleContinue,
        handleSleepFinished,
        handleScreenFadeEnd,
        handleNextDay,
        chapter,
        summaryContinueLabel,
        fullScreenFade,
        handleStartNextChapter,
        chapterEndingParagraphIndex,
        setChapterEndingParagraphIndex,
    } = useGameController(
        onAchievementUnlocked,
        onModifierChanged
    );

    const fadeClassName = [
        "screen-fade",

        transitionStage === "darkening"
            ? "screen-fade--visible"
            : "",

        transitionStage !== "idle"
            ? "screen-fade--active"
            : "",

        fullScreenFade
            ? "screen-fade--full-screen"
            : "",
    ].filter(Boolean).join(" ");

    return (
        <>
            {screen !== "chapter-ending" && screen !== "sleep" && (
                <Header
                    chapter={toRomanNumber(chapter.number)}
                    day={day}
                    onMenu={
                        gameOverReason !== null
                            ? onGameOverMenu
                            : onOpenMenu
                    }
                />
            )}

            <div className="game-content">
                {notification !== null && (
                    <NotificationToast
                        key={notification.sequence}
                        notification={notification}
                        onDismiss={onDismissNotification}
                    />
                )}

                {screen === "scene" && (
                    <KingdomStats stats={visibleStats} />
                )}

                {screen === "chapter-ending" ? (
                    <ChapterEnding
                        chapter={chapter}
                        initialParagraphIndex={chapterEndingParagraphIndex}
                        onParagraphChange={setChapterEndingParagraphIndex}
                        onNextChapter={handleStartNextChapter}
                        onMenu={onOpenMenu}
                    />
                ) : screen === "sleep" ? (
                    <NightRest onFinish={handleSleepFinished} />
                ) : screen === "gameover" &&
                gameOverReason !== null ? (
                    <GameOver
                        reason={gameOverReason}
                        chapter={toRomanNumber(chapter.number)}
                        day={day}
                        stats={stats}
                        onMenu={onGameOverMenu}
                    />
                ) : screen === "summary" ? (
                    <DaySummary
                        day={day}
                        stats={stats}
                        startStats={dayStartStats}
                        animatedFromStats={visibleStats}
                        modifierReport={modifierReport}
                        nextLabel={summaryContinueLabel}
                        onNextDay={handleNextDay}
                    />
                ) : (
                    <ThroneScene
                        timeOfDay={timeOfDay}
                        backgroundMap={backgroundMap}
                        visitorPhase={phase}
                        visitorImage={visitorImage}
                        visitorName={dialogue.speaker}
                        visitorKey={dialogueKey}
                        onVisitorAnimationEnd={handleVisitorAnimationEnd}
                    >
                        {phase === "speaking" && (
                            <DialogueController
                                key={dialogueKey}
                                event={dialogue}
                                initialDecision={selectedDecision}
                                continueLabel={continueLabel}
                                onDecision={handleDecision}
                                onContinue={handleContinue}
                            />
                        )}
                    </ThroneScene>
                )}

                <div
                    className={fadeClassName}
                    aria-hidden="true"
                    onTransitionEnd={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            event.propertyName === "opacity"
                        ) {
                            handleScreenFadeEnd();
                        }
                    }}
                />
            </div>
        </>
    );
}

export default GameSession;
