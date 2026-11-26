import DialogueController from "../narrative/DialogueController";
import SpecialScene from "../scene/SpecialScene";
import ThroneScene from "../scene/ThroneScene";
import ChapterEnding from "./ChapterEnding";
import DaySummary from "./DaySummary";
import GameOver from "./GameOver";
import NightRest from "./NightRest";

import { toRomanNumber } from "../../data/chapters";

import type { useGameController } from "../../hooks/game/useGameController";

import type { MonarchRole } from "../../types/monarch";

type GameScreenContentProps = {
    controller: ReturnType<typeof useGameController>;
    monarch: MonarchRole;
    onOpenMenu: () => void;
    onGameOverMenu: () => void;
};

// Representar la pantalla interna de la partida.
function GameScreenContent({
    controller,
    monarch,
    onOpenMenu,
    onGameOverMenu,
}: GameScreenContentProps) {
    const {
        day,
        screen,
        specialScene,
        phase,
        timeOfDay,
        backgroundMap,
        sceneVisualClassName,
        visitorImage,
        dialogue,
        dialogueKey,
        continueLabel,
        selectedDecision,
        stats,
        visibleStats,
        dayStartStats,
        modifierReport,
        gameOverReason,

        handleVisitorAnimationEnd,
        handleDecision,
        handleContinue,
        handleSleepFinished,
        handleNextDay,

        chapter,
        summaryContinueLabel,
        handleStartNextChapter,
        chapterEndingParagraphIndex,
        setChapterEndingParagraphIndex,
    } = controller;

    switch (screen) {
        case "chapter-ending":
            return (
                <ChapterEnding
                    chapter={chapter}
                    initialParagraphIndex={
                        chapterEndingParagraphIndex
                    }
                    onParagraphChange={
                        setChapterEndingParagraphIndex
                    }
                    onNextChapter={handleStartNextChapter}
                    onMenu={onOpenMenu}
                />
            );

        case "sleep":
            return (
                <NightRest
                    onFinish={handleSleepFinished}
                />
            );

        case "gameover":
            if (gameOverReason !== null) {
                return (
                    <GameOver
                        reason={gameOverReason}
                        chapter={
                            toRomanNumber(chapter.number)
                        }
                        day={day}
                        stats={stats}
                        onMenu={onGameOverMenu}
                    />
                );
            }

            break;

        case "summary":
            return (
                <DaySummary
                    day={day}
                    stats={stats}
                    startStats={dayStartStats}
                    animatedFromStats={visibleStats}
                    modifierReport={modifierReport}
                    nextLabel={summaryContinueLabel}
                    onNextDay={handleNextDay}
                />
            );
    }

    const dialogueContent =
        phase === "speaking"
            ? (
                <DialogueController
                    key={dialogueKey}
                    event={dialogue}
                    initialDecision={selectedDecision}
                    continueLabel={continueLabel}
                    onDecision={handleDecision}
                    onContinue={handleContinue}
                />
            )
            : null;

    // Propiedades compartidas por todos los escenarios.
    const visitorProps = {
        visitorPhase: phase,
        visitorImage,
        visitorName: dialogue.speaker,
        visitorKey: dialogueKey,
        onVisitorAnimationEnd:
            handleVisitorAnimationEnd,
    };

    if (
        screen === "special-scene" &&
        specialScene !== null
    ) {
        return (
            <SpecialScene
                sceneId={specialScene.id}
                background={specialScene.background}
                {...visitorProps}
            >
                {dialogueContent}
            </SpecialScene>
        );
    }

    return (
        <ThroneScene
            monarch={monarch}
            timeOfDay={timeOfDay}
            backgroundMap={backgroundMap}
            visualClassName={sceneVisualClassName}
            {...visitorProps}
        >
            {dialogueContent}
        </ThroneScene>
    );
}

export default GameScreenContent;
