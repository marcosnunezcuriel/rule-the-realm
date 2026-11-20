import { useState } from "react";

import MainMenu from "./components/MainMenu";
import WelcomeIntroduction from "./components/WelcomeIntroduction";
import GameSession from "./components/GameSession";

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
