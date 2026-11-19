
import { useEffect, useState } from "react";

import Header from "./components/Header";
import ThroneScene from "./components/ThroneScene";
import DialogueController from "./components/DialogueController";
import DaySummary from "./components/DaySummary";
import KingdomStats from "./components/KingdomStats";

import { closingDialogue } from "./data/demoAudiences";
import { getDayEvents } from "./game/getDayEvents";

import { initialKingdomValues } from "./game/initialState";
import { applyStatChanges } from "./game/applyStatChanges";

import type { Decision } from "./types/dialogue";
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

    const [stats, setStats] = useState<KingdomValues>(
        initialKingdomValues
    );
    const [dayStartStats, setDayStartStats] = useState<KingdomValues>({
        ...initialKingdomValues,
    });

    // Eventos desbloqueados por decisiones anteriores.
    const [unlockedEventIds, setUnlockedEventIds] = useState<string[]>([]);

    // Audiencias que corresponden a la jornada actual.
    const [dayEvents, setDayEvents] = useState(() => {
        return getDayEvents(1, []);
    });

    // Audiencias disponibles.
    const availableAudiences = dayEvents;
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
    const visitorImage = isClosing || !currentAudience
        ? "/assets/characters/courtiers/royal-advisor.png"
        : currentAudience.image;

    const dialogue = isClosing || !currentAudience
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

    // Aplicar las consecuencias de la decisión.
    function handleDecision(answer: Decision) {
        if (
            isClosing ||
            phase !== "speaking" ||
            !currentAudience
        ) {
            return;
        }

        // Aplicar las consecuencias inmediatas.
        const changes = currentAudience.effects[answer];

        setStats((previous) => {
            return applyStatChanges(previous, changes);
        });

        // Comprobar si la elección desbloquea eventos.
        const newUnlocks =
            currentAudience.unlocks?.[answer] ?? [];

        if (newUnlocks.length > 0) {
            setUnlockedEventIds((previous) => {
                return [
                    ...new Set([
                        ...previous,
                        ...newUnlocks,
                    ]),
                ];
            });
        }
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
                const nextDay = day + 1;

                // Calcular qué eventos están disponibles.
                const nextDayEvents = getDayEvents(
                    nextDay,
                    unlockedEventIds
                );

                // Guardar las estadísticas de inicio de jornada.
                setDayStartStats({ ...stats });

                // Preparar el nuevo día.
                setDay(nextDay);
                setDayEvents(nextDayEvents);
                setAudienceIndex(0);

                // Si no hay eventos, preparar el cierre nocturno.
                setIsClosing(nextDayEvents.length === 0);

                // Esperar a que termine la transición visual.
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
                        startStats={dayStartStats}
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
                                : (currentAudience?.id ?? "no-audiences")
                        }
                        event={dialogue}
                        continueLabel={
                            isClosing ? "Terminar día" : "Continuar"
                        }
                        onDecision={handleDecision}
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
