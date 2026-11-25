import { useEffect, useRef } from "react";

import { soundEngine } from "../../audio/soundEngine";

import Header from "../layout/Header";
import ThroneScene from "../scene/ThroneScene";
import DialogueController from "../narrative/DialogueController";
import DaySummary from "./DaySummary";
import KingdomStats from "../kingdom/KingdomStats";
import StatChangeToast from "../kingdom/StatChangeToast";
import GameOver from "./GameOver";
import ChapterEnding from "./ChapterEnding";

import NotificationToast from "../shared/NotificationToast";

import { toRomanNumber } from "../../data/chapters";
import type { AchievementId } from "../../data/achievements";

import { useGameController } from "../../hooks/useGameController";

import type { ModifierId } from "../../types/modifiers";
import type { KingdomValues } from "../../types/stats";
import type { MonarchRole } from "../../types/monarch";
import type {
    GameNotification,
    ModifierChange,
} from "../../types/notifications";

import JoustScene from "../scene/JoustScene";

import NightRest from "./NightRest";


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
    onAnthemUnlocked: () => void;
};

// Presentación de la partida activa.
// El controlador solo existe mientras estamos jugando.
function GameSession({
    monarch,
    onOpenMenu,
    onGameOverMenu,
    onAchievementUnlocked,
    onModifierChanged,
    onStatsChanged,
    notification,
    onSoundSettings,
    onAnthemUnlocked,
}: GameSessionProps) {

    const {
        day,
        screen,
        withBrother,
        phase,
        timeOfDay,
        backgroundMap,
        blackFeverActive,
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
        onModifierChanged,
        onStatsChanged,
        onAnthemUnlocked,
        monarch
    );

    const isAudienceScreen =
        screen === "scene" ||
        screen === "joust";

    const lastVisitorSound = useRef<string | null>(null);
    const lastScreenSound = useRef<string | null>(null);

    // Reproducir pasos cuando entra o sale un visitante.
    useEffect(() => {
        if (
            !isAudienceScreen ||
            (
                phase !== "entering" &&
                phase !== "exiting"
            )
        ) {
            return;
        }

        const key = `${day}-${dialogueKey}-${phase}`;

        if (lastVisitorSound.current === key) {
            return;
        }

        lastVisitorSound.current = key;

        soundEngine.playEffect(
            phase === "entering"
                ? "visitor-enter"
                : "visitor-exit"
        );
    }, [
        day,
        dialogueKey,
        phase,
        isAudienceScreen,
    ]);

    // Reproducir los efectos de cada pantalla.
    useEffect(() => {
        soundEngine.setAmbientActive(
            isAudienceScreen
        );

        if (lastScreenSound.current === screen) {
            return;
        }

        lastScreenSound.current = screen;

        switch (screen) {
            case "sleep":
                soundEngine.playEffect("day-end");
                break;

            case "summary":
                soundEngine.playEffect("day-summary");
                break;

            case "gameover":
                soundEngine.playEffect("game-over");
                break;

            case "chapter-ending":
                soundEngine.playEffect("chapter-complete");
                break;
        }
    }, [
        screen,
        isAudienceScreen
    ]);

    // Al salir de la partida, restaurar el ambiente.
    useEffect(() => {
        return () => {
            soundEngine.setAmbientActive(true);
        };
    }, []);

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

    const dialogueContent = phase === "speaking" ? (
        <DialogueController
            key={dialogueKey}
            event={dialogue}
            initialDecision={selectedDecision}
            continueLabel={continueLabel}
            onDecision={handleDecision}
            onContinue={handleContinue}
        />
    ) : null;

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
                ) : screen === "joust" ? (
                    <JoustScene
                        monarch={monarch}
                        withBrother={withBrother}
                        visitorPhase={phase}
                        visitorImage={visitorImage}
                        visitorName={dialogue.speaker}
                        visitorKey={dialogueKey}
                        onVisitorAnimationEnd={handleVisitorAnimationEnd}
                    >
                        {dialogueContent}
                    </JoustScene>
                ) : (
                    <ThroneScene
                        monarch={monarch}
                        timeOfDay={timeOfDay}
                        backgroundMap={backgroundMap}
                        blackFeverActive={blackFeverActive}
                        visitorPhase={phase}
                        visitorImage={visitorImage}
                        visitorName={dialogue.speaker}
                        visitorKey={dialogueKey}
                        onVisitorAnimationEnd={handleVisitorAnimationEnd}
                    >
                        {dialogueContent}
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
