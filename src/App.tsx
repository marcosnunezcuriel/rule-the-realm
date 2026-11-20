import { useState } from "react";

import Header from "./components/Header";
import ThroneScene from "./components/ThroneScene";
import DialogueController from "./components/DialogueController";
import DaySummary from "./components/DaySummary";
import KingdomStats from "./components/KingdomStats";
import GameOver from "./components/GameOver";
import MainMenu from "./components/MainMenu";
import WelcomeIntroduction from "./components/WelcomeIntroduction";
import ChapterEnding from "./components/ChapterEnding";

import { toRomanNumber } from "./data/chapters";

import { useGameController } from "./hooks/useGameController";

import {
    clearSavedGame,
    hasSavedGame,
} from "./storage/gameStorage";

import "./styles/Navigation.css";

type AppView = "menu" | "intro" | "game";

type NavigationStage =
    | "idle"
    | "darkening"
    | "lightening";

type GameSessionProps = {
    onOpenMenu: () => void;
    onGameOverMenu: () => void;
};

// El controlador solo existe cuando estamos jugando.
function GameSession({
    onOpenMenu,
    onGameOverMenu
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

function App() {
    // La web siempre comienza en el menú principal.
    const [view, setView] = useState<AppView>("menu");

    const [savedAvailable, setSavedAvailable] = useState(
        () => hasSavedGame()
    );

    const [confirmNewGame, setConfirmNewGame] =
        useState(false);

    // Control del fundido entre las pantallas principales.
    const [navigationStage, setNavigationStage] =
        useState<NavigationStage>("idle");

    const [navigationTarget, setNavigationTarget] =
        useState<AppView | null>(null);

    const [discardSaveOnMenu, setDiscardSaveOnMenu] =
        useState(false);

    function navigateTo(
        target: AppView,
        discardSave = false
    ) {
        if (navigationStage !== "idle") {
            return;
        }

        setDiscardSaveOnMenu(discardSave);
        setNavigationTarget(target);
        setNavigationStage("darkening");
    }

    // Nueva partida: pedir confirmación si hay un guardado.
    function startNewGame() {
        if (savedAvailable) {
            setConfirmNewGame(true);
            return;
        }

        confirmStartNewGame();
    }

    // Eliminar el progreso anterior y abrir la introducción.
    function confirmStartNewGame() {
        clearSavedGame();

        setSavedAvailable(false);
        setConfirmNewGame(false);

        navigateTo("intro");
    }

    // Recuperar la partida guardada.
    function continueGame() {
        if (!hasSavedGame()) {
            setSavedAvailable(false);
            return;
        }

        navigateTo("game");
    }

    // Cambiar de pantalla cuando el fundido está negro.
    function handleNavigationFadeEnd() {
        if (
            navigationStage === "darkening" &&
            navigationTarget !== null
        ) {
            // Actualizar el guardado antes de mostrar el menú.
            if (navigationTarget === "menu") {
                if (discardSaveOnMenu) {
                    // El reinado terminó: eliminar la partida.
                    clearSavedGame();
                    setSavedAvailable(false);
                } else {
                    // Regreso normal: conservar la partida.
                    setSavedAvailable(hasSavedGame());
                }
            }

            // Cambiar de pantalla mientras está negra.
            setView(navigationTarget);
            setNavigationStage("lightening");

            return;
        }

        if (navigationStage === "lightening") {
            setNavigationStage("idle");
            setNavigationTarget(null);
            setDiscardSaveOnMenu(false);
        }
    }

    const navigationFadeClassName = [
        "navigation-fade",

        navigationStage === "darkening"
            ? "navigation-fade--visible"
            : "",

        navigationStage !== "idle"
            ? "navigation-fade--active"
            : "",
    ].filter(Boolean).join(" ");

    return (
        <div className="app">
            {view === "menu" ? (
                <MainMenu
                    hasSave={savedAvailable}
                    showNewGameConfirmation={confirmNewGame}
                    onNewGame={startNewGame}
                    onContinue={continueGame}
                    onConfirmNewGame={confirmStartNewGame}
                    onCancelNewGame={() => {
                        setConfirmNewGame(false);
                    }}
                />
            ) : view === "intro" ? (
                <WelcomeIntroduction
                    onFinish={() => navigateTo("game")}
                />
            ) : (        
                <GameSession
                    onOpenMenu={() => navigateTo("menu")}
                    onGameOverMenu={() => navigateTo("menu", true)}
                />
            )}

            <div
                className={navigationFadeClassName}
                aria-hidden="true"
                onTransitionEnd={(event) => {
                    if (
                        event.target === event.currentTarget &&
                        event.propertyName === "opacity"
                    ) {
                        handleNavigationFadeEnd();
                    }
                }}
            />
        </div>
    );
}

export default App;
