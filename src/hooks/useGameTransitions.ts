import { useEffect, useState } from "react";

import type {
    AudiencePhase,
    GameScreen,
    FadeStage,
} from "../types/game";

const BACKGROUND_TRANSITION_DURATION = 1500;

type GameTransitionsInput = {
    phase: AudiencePhase;
    setPhase: (phase: AudiencePhase) => void;

    screen: GameScreen;
    setScreen: (screen: GameScreen) => void;

    prepareNextDay: (
        target: "scene" | "joust"
    ) => void;

    finishJoust: () => void;
};

// Se ocupa únicamente de los fundidos y del tiempo de
// espera antes de que entre el siguiente visitante.
export function useGameTransitions({
    phase,
    setPhase,
    screen,
    setScreen,
    prepareNextDay,
    finishJoust,
}: GameTransitionsInput) {
    const [transitionStage, setTransitionStage] =
        useState<FadeStage>("idle");

    const [transitionTarget, setTransitionTarget] =
        useState<GameScreen | null>(null);

    const [fullScreenFade, setFullScreenFade] =
        useState(false);

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
    }, [phase, setPhase]);

    function startScreenTransition(target: GameScreen) {
        if (transitionStage !== "idle") {
            return;
        }

        setFullScreenFade(
            target === "chapter-ending" ||
            screen === "chapter-ending" ||
            target === "sleep" ||
            screen === "sleep"
        );

        setTransitionTarget(target);
        setTransitionStage("darkening");
    }

    function handleScreenFadeEnd() {
        if (
            transitionStage === "darkening" &&
            transitionTarget !== null
        ) {
            // Regresar al salón del trono sin avanzar de día.
            if (
                screen === "joust" &&
                transitionTarget === "scene"
            ) {
                finishJoust();
            }

            // Comenzar una nueva jornada.
            else if (
                transitionTarget === "scene" ||
                transitionTarget === "joust"
            ) {
                prepareNextDay(transitionTarget);
            }

            // El resto de pantallas no requiere preparar
            // una nueva jornada.
            else {
                setScreen(transitionTarget);
            }

            setTransitionStage("lightening");
            return;
        }

        if (transitionStage === "lightening") {
            if (
                transitionTarget === "scene" ||
                transitionTarget === "joust"
            ) {
                setPhase("entering");
            }

            setTransitionStage("idle");
            setTransitionTarget(null);
            setFullScreenFade(false);
        }
    }

    return {
        transitionStage,
        fullScreenFade,
        startScreenTransition,
        handleScreenFadeEnd,
    };
}
