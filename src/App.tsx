import Header from "./components/Header";
import ThroneScene from "./components/ThroneScene";
import DialogueController from "./components/DialogueController";
import DaySummary from "./components/DaySummary";
import KingdomStats from "./components/KingdomStats";

import { useGameController } from "./hooks/useGameController";

function App() {
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
        stats,
        visibleStats,
        dayStartStats,
        modifierReport,
        transitionStage,
        handleVisitorAnimationEnd,
        handleDecision,
        handleContinue,
        handleScreenFadeEnd,
        handleNextDay,
    } = useGameController();

    const fadeClassName = [
        "screen-fade",
        transitionStage === "darkening"
            ? "screen-fade--visible"
            : "",
        transitionStage !== "idle"
            ? "screen-fade--active"
            : "",
    ].filter(Boolean).join(" ");

    return (
        <div className="app">
            <Header chapter="I" day={day} />

            <div className="game-content">
                {screen === "scene" && (
                    <KingdomStats stats={visibleStats} />
                )}

                {screen === "summary" ? (
                    <DaySummary
                        day={day}
                        stats={stats}
                        startStats={dayStartStats}
                        animatedFromStats={visibleStats}
                        modifierReport={modifierReport}
                        onNextDay={handleNextDay}
                    />
                ) : (
                    <ThroneScene
                        timeOfDay={timeOfDay}
                        backgroundMap={backgroundMap}
                        visitorPhase={phase}
                        visitorImage={visitorImage}
                        visitorName={dialogue.speaker}
                        onVisitorAnimationEnd={handleVisitorAnimationEnd}
                    >
                        {phase === "speaking" && (
                            <DialogueController
                                key={dialogueKey}
                                event={dialogue}
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
        </div>
    );
}

export default App;
