
import { useEffect, useState } from "react";

import Header from "./components/Header";
import ThroneScene from "./components/ThroneScene";
import DialogueController from "./components/DialogueController";
import DaySummary from "./components/DaySummary";
import KingdomStats from "./components/KingdomStats";

import { demoAudiences, closingDialogue, } from "./data/demoAudiences";

import { initialKingdomValues } from "./game/initialState";

import type { KingdomValues } from "./types/stats";

type AudiencePhase =
    | "entering"
    | "speaking"
    | "exiting"
    | "transitioning"
    | "waiting";

type GameScreen = "scene" | "summary";

type TransitionStage =
    | "idle"
    | "darkening"
    | "lightening";

const BACKGROUND_TRANSITION_DURATION = 1500;

function App() {
    const [day, setDay] = useState(1);
    const [screen, setScreen] = useState<GameScreen>("scene");
    const [phase, setPhase] = useState<AudiencePhase>("entering");
    const [audienceIndex, setAudienceIndex] = useState(0);
    const [isClosing, setIsClosing] = useState(false);

    // Control del fundido entre pantallas.
    const [transitionStage, setTransitionStage] =
        useState<TransitionStage>("idle");

    const [transitionTarget, setTransitionTarget] =
        useState<GameScreen | null>(null);

    const [stats] = useState<KingdomValues>(initialKingdomValues);

    // Audiencias disponibles.
    const availableAudiences = demoAudiences;
    const currentAudience = availableAudiences[audienceIndex];

    const morningCount = Math.ceil(
        availableAudiences.length / 2
    );

    // Seleccionar el momento del día.
    const timeOfDay = isClosing
        ? "night"
        : audienceIndex < morningCount
            ? "morning"
            : "evening";

    // Seleccionar el visitante y su diálogo.
    const visitorImage = isClosing
        ? "/assets/characters/courtiers/royal-advisor.png"
        : currentAudience.image;

    const dialogue = isClosing
        ? closingDialogue
        : currentAudience.dialogue;

    // Esperar al fundido del fondo antes de que entre
    // el siguiente personaje.
    useEffect(() => {
        if (phase !== "transitioning") {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setPhase("entering");
        }, BACKGROUND_TRANSITION_DURATION);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [phase]);

    // Iniciar el fundido entre escenario y resumen.
    function startScreenTransition(target: GameScreen) {
        if (transitionStage !== "idle") {
            return;
        }

        setTransitionTarget(target);
        setTransitionStage("darkening");
    }

    // Controlar el final de cada animación del visitante.
    function handleVisitorAnimationEnd() {
        if (phase === "entering") {
            setPhase("speaking");
            return;
        }

        if (phase !== "exiting") {
            return;
        }

        // La consejera ha salido después del cierre.
        if (isClosing) {
            startScreenTransition("summary");
            return;
        }

        const nextIndex = audienceIndex + 1;

        // Quedan audiencias normales.
        if (nextIndex < availableAudiences.length) {
            const nextTimeOfDay =
                nextIndex < morningCount
                    ? "morning"
                    : "evening";

            setAudienceIndex(nextIndex);

            // Esperar solo si cambia el fondo.
            setPhase(
                nextTimeOfDay !== timeOfDay
                    ? "transitioning"
                    : "entering"
            );

            return;
        }

        // No quedan audiencias: comienza el cierre nocturno.
        setIsClosing(true);
        setPhase("transitioning");
    }

    // El jugador ha terminado un diálogo.
    function handleContinue() {
        setPhase("exiting");
    }

    // Controlar el fundido a negro y su desaparición.
    function handleScreenFadeEnd() {
        // La pantalla acaba de oscurecerse.
        if (
            transitionStage === "darkening" &&
            transitionTarget !== null
        ) {
            if (transitionTarget === "scene") {
                // Preparar el siguiente día.
                setDay((previous) => previous + 1);
                setAudienceIndex(0);
                setIsClosing(false);

                // Esperar a que el escenario sea visible.
                setPhase("waiting");
            }

            // Sustituir el contenido mientras está negro.
            setScreen(transitionTarget);
            setTransitionStage("lightening");

            return;
        }

        // La nueva pantalla ya es totalmente visible.
        if (transitionStage === "lightening") {
            if (transitionTarget === "scene") {
                setPhase("entering");
            }

            setTransitionStage("idle");
            setTransitionTarget(null);
        }
    }

    // El jugador pulsa Siguiente día desde el resumen.
    function handleNextDay() {
        startScreenTransition("scene");
    }

    return (
        <div className="app">
            <Header chapter="I" day={day} />

            <div className="game-content">
                {screen === "scene" && (
                    <KingdomStats stats={stats} />
                )}

                {screen === "summary" ? (
                    <DaySummary
                        day={day}
                        stats={stats}
                        onNextDay={handleNextDay}
                    />
                ) : (
                    <ThroneScene
                        timeOfDay={timeOfDay}
                        visitorPhase={phase}
                        visitorImage={visitorImage}
                        visitorName={dialogue.speaker}
                        onVisitorAnimationEnd={handleVisitorAnimationEnd}
                    >
                        {phase === "speaking" && (
                            <DialogueController
                                key={
                                    isClosing
                                        ? "closing"
                                        : currentAudience.id
                                }
                                event={dialogue}
                                continueLabel={
                                    isClosing
                                        ? "Terminar día"
                                        : "Continuar"
                                }
                                onContinue={handleContinue}
                            />
                        )}
                    </ThroneScene>
                )}

                <div
                    className={[
                        "screen-fade",
                        transitionStage === "darkening"
                            ? "screen-fade--visible"
                            : "",
                        transitionStage !== "idle"
                            ? "screen-fade--active"
                            : "",
                    ].filter(Boolean).join(" ")}
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
