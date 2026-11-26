import { useEffect, useState } from "react";

import type {
    AudiencePhase,
    FadeStage,
} from "../../types/game";

const BACKGROUND_TRANSITION_DURATION = 1500;

type GameTransitionsInput = {
    phase: AudiencePhase;
    setPhase: (phase: AudiencePhase) => void;
};

type ScreenTransitionRequest = {
    fullScreen: boolean;

    // Operación que se ejecuta con la pantalla oscura.
    onDark: () => void;

    // Operación que se ejecuta al terminar el fundido.
    onLight?: () => void;
};

// Gestionar exclusivamente las transiciones visuales.
export function useGameTransitions({
    phase,
    setPhase,
}: GameTransitionsInput) {
    const [transitionStage, setTransitionStage] =
        useState<FadeStage>("idle");

    const [request, setRequest] =
        useState<ScreenTransitionRequest | null>(
            null
        );

    // Esperar a que termine el cambio de fondo
    // antes de introducir al siguiente visitante.
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

    function startScreenTransition(
        nextRequest: ScreenTransitionRequest
    ) {
        if (transitionStage !== "idle") {
            return;
        }

        setRequest(nextRequest);
        setTransitionStage("darkening");
    }

    function handleScreenFadeEnd() {
        if (request === null) {
            return;
        }

        if (transitionStage === "darkening") {
            request.onDark();

            setTransitionStage("lightening");
            return;
        }

        if (transitionStage === "lightening") {
            request.onLight?.();

            setTransitionStage("idle");
            setRequest(null);
        }
    }

    return {
        transitionStage,

        fullScreenFade:
            request?.fullScreen ?? false,

        startScreenTransition,
        handleScreenFadeEnd,
    };
}
