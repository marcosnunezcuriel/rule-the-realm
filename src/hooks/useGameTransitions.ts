import { useEffect, useState } from "react";

import type { Dispatch, SetStateAction } from "react";
import type {
    AudiencePhase,
    GameScreen,
    FadeStage,
} from "../types/game";

const BACKGROUND_TRANSITION_DURATION = 1500;

type GameTransitionsInput = {
    phase: AudiencePhase;
    setPhase: Dispatch<SetStateAction<AudiencePhase>>;
    screen: GameScreen;
    setScreen: Dispatch<SetStateAction<GameScreen>>;
    prepareNextDay: () => void;
};

// Se ocupa únicamente de los fundidos y del tiempo de
// espera antes de que entre el siguiente visitante.
export function useGameTransitions({
    phase,
    setPhase,
    screen,
    setScreen,
    prepareNextDay,
}: GameTransitionsInput) {
    const [transitionStage, setTransitionStage] =
        useState<FadeStage>("idle");

    const [transitionTarget, setTransitionTarget] =
        useState<GameScreen | null>(null);

    const [fullScreenFade, setFullScreenFade] = useState(false);

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
            if (transitionTarget === "scene") {
                prepareNextDay();
            }

            setScreen(transitionTarget);
            setTransitionStage("lightening");
            return;
        }

        if (transitionStage === "lightening") {
            if (transitionTarget === "scene") {
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
