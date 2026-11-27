import { useState } from "react";

import {
    clearSavedGame,
    hasSavedGame,
    loadGame,
} from "../../storage/gameStorage";

import type { FadeStage } from "../../types/game";
import type { MonarchRole } from "../../types/monarch";

type AppView =
    | "auth"
    | "menu"
    | "achievements"
    | "items"
    | "choose-monarch"
    | "intro"
    | "game";

type NavigationRequest = {
    target: AppView;
    discardSave: boolean;
};

// Navegación entre las pantallas principales.
export function useAppNavigation(
    onReturnToMenu: () => void,
    initialView: AppView = "menu"
) {
    const [view, setView] =
        useState<AppView>(initialView);

    const [monarch, setMonarch] =
        useState<MonarchRole>(
            () => loadGame()?.monarch ?? "king"
        );

    const [savedAvailable, setSavedAvailable] =
        useState(hasSavedGame);

    const [confirmNewGame, setConfirmNewGame] =
        useState(false);

    const [navigationStage, setNavigationStage] =
        useState<FadeStage>("idle");

    const [navigationRequest, setNavigationRequest] =
        useState<NavigationRequest | null>(null);

    function navigateTo(
        target: AppView,
        discardSave = false
    ) {
        if (navigationStage !== "idle") {
            return;
        }

        setNavigationRequest({
            target,
            discardSave,
        });

        setNavigationStage("darkening");
    }

    function startNewGame() {
        if (navigationStage !== "idle") {
            return;
        }

        if (savedAvailable) {
            setConfirmNewGame(true);
            return;
        }

        navigateTo("choose-monarch");
    }

    // Sobrescribir la partida únicamente después de recibir la confirmación del jugador.
    function confirmStartNewGame() {
        if (
            !confirmNewGame ||
            navigationStage !== "idle"
        ) {
            return;
        }

        clearSavedGame();
        setSavedAvailable(false);
        setConfirmNewGame(false);

        navigateTo("choose-monarch");
    }

    function cancelNewGame() {
        setConfirmNewGame(false);
    }

    function chooseMonarch(choice: MonarchRole) {
        if (navigationStage !== "idle") {
            return;
        }

        setMonarch(choice);
        navigateTo("intro");
    }

    function continueGame() {
        if (navigationStage !== "idle") {
            return;
        }

        const saved = loadGame();

        if (saved === null) {
            setSavedAvailable(false);
            return;
        }

        setMonarch(saved.monarch);
        navigateTo("game");
    }

    // Cambiar de pantalla cuando el fundido está completamente oscuro.
    function handleNavigationFadeEnd() {
        if (
            navigationStage === "darkening" &&
            navigationRequest !== null
        ) {
            const {
                target,
                discardSave,
            } = navigationRequest;

            if (target === "menu") {
                onReturnToMenu();

                if (discardSave) {
                    clearSavedGame();
                    setSavedAvailable(false);
                } else {
                    setSavedAvailable(
                        hasSavedGame()
                    );
                }
            }

            setView(target);
            setNavigationStage("lightening");

            return;
        }

        if (navigationStage === "lightening") {
            setNavigationStage("idle");
            setNavigationRequest(null);
        }
    }

    return {
        view,
        monarch,
        savedAvailable,
        confirmNewGame,
        navigationStage,

        navigateTo,
        startNewGame,
        confirmStartNewGame,
        cancelNewGame,
        chooseMonarch,
        continueGame,
        handleNavigationFadeEnd,
    };
}
