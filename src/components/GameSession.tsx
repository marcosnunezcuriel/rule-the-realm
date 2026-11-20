import Header from "./Header";
import ThroneScene from "./ThroneScene";
import DialogueController from "./DialogueController";
import DaySummary from "./DaySummary";
import KingdomStats from "./KingdomStats";
import GameOver from "./GameOver";
import ChapterEnding from "./ChapterEnding";

import { toRomanNumber } from "../data/chapters";

import { useGameController } from "../hooks/useGameController";

type GameSessionProps = {
    onOpenMenu: () => void;
    onGameOverMenu: () => void;
};

// Presentación de la partida activa.
// El controlador solo existe mientras estamos jugando.
function GameSession({
    onOpenMenu,
    onGameOverMenu,
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
        handleScreenFadeEnd,
        handleNextDay,
        chapter,
        summaryContinueLabel,
        fullScreenFade,
        handleStartNextChapter,
        chapterEndingParagraphIndex,
        setChapterEndingParagraphIndex,
    } = useGameController();

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
            {screen !== "chapter-ending" && (
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
