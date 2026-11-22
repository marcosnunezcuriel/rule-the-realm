import { useCallback, useRef, useState } from "react";

import MainMenu from "./components/screens/MainMenu";
import AchievementsScreen from "./components/screens/AchievementsScreen";
import WelcomeIntroduction from "./components/screens/WelcomeIntroduction";
import GameSession from "./components/screens/GameSession";

import type { AchievementId } from "./data/achievements";

import {
    clearSavedGame,
    hasSavedGame,
} from "./storage/gameStorage";
import { unlockAchievement } from "./storage/achievementsStorage";

import type { FadeStage } from "./types/game";
import type { ModifierId } from "./types/modifiers";
import type {
    GameNotification,
    ModifierChange,
} from "./types/notifications";


import "./styles/layout/Navigation.css";

type AppView =
    | "menu"
    | "achievements"
    | "intro"
    | "game";

function App() {
    const [view, setView] = useState<AppView>("menu");

    const [savedAvailable, setSavedAvailable] = useState(
        () => hasSavedGame()
    );

    const [confirmNewGame, setConfirmNewGame] =
        useState(false);

    const [navigationStage, setNavigationStage] =
        useState<FadeStage>("idle");

    const [navigationTarget, setNavigationTarget] =
        useState<AppView | null>(null);

    const [discardSaveOnMenu, setDiscardSaveOnMenu] =
        useState(false);

    
    // Una sola cola para logros y cambios de modificadores.
    const [notificationQueue, setNotificationQueue] =
        useState<GameNotification[]>([]);

    // Cada aparición tiene un identificador diferente.
    const nextNotificationId = useRef(0);

    // Desbloquear y anunciar un logro nuevo.
    function handleAchievementUnlocked(id: AchievementId) {
        if (!unlockAchievement(id)) {
            return;
        }

        nextNotificationId.current += 1;

        const sequence = nextNotificationId.current;

        setNotificationQueue((previous) => [
            ...previous,
            {
                sequence,
                kind: "achievement",
                id,
            },
        ]);
    }

    // Anunciar la activación o eliminación de un modificador.
    function handleModifierChanged(
        id: ModifierId,
        change: ModifierChange
    ) {
        nextNotificationId.current += 1;

        const sequence = nextNotificationId.current;

        setNotificationQueue((previous) => [
            ...previous,
            {
                sequence,
                kind: change === "added"
                    ? "modifier-added"
                    : "modifier-removed",
                id,
            },
        ]);
    }

    // Mostrar la siguiente notificación.
    const handleDismissNotification = useCallback(() => {
        setNotificationQueue(
            (previous) => previous.slice(1)
        );
    }, []);

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

    function startNewGame() {
        if (savedAvailable) {
            setConfirmNewGame(true);
            return;
        }

        confirmStartNewGame();
    }

    function confirmStartNewGame() {
        clearSavedGame();

        setSavedAvailable(false);
        setConfirmNewGame(false);

        navigateTo("intro");
    }

    function continueGame() {
        if (!hasSavedGame()) {
            setSavedAvailable(false);
            return;
        }

        navigateTo("game");
    }

    function handleNavigationFadeEnd() {
        if (
            navigationStage === "darkening" &&
            navigationTarget !== null
        ) {
            if (navigationTarget === "menu") {
                setNotificationQueue([]);
                if (discardSaveOnMenu) {
                    clearSavedGame();
                    setSavedAvailable(false);
                } else {
                    setSavedAvailable(hasSavedGame());
                }
            }

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
                    onAchievements={() => {
                        navigateTo("achievements");
                    }}
                    onConfirmNewGame={confirmStartNewGame}
                    onCancelNewGame={() => {
                        setConfirmNewGame(false);
                    }}
                />
            ) : view === "achievements" ? (
                <AchievementsScreen
                    onBack={() => navigateTo("menu")}
                />
            ) : view === "intro" ? (
                <WelcomeIntroduction
                    onFinish={() => navigateTo("game")}
                />
            ) : (
                <GameSession
                    onOpenMenu={() => navigateTo("menu")}
                    onGameOverMenu={() => navigateTo("menu", true)}
                    onAchievementUnlocked={handleAchievementUnlocked}
                    onModifierChanged={handleModifierChanged}
                    notification={notificationQueue[0] ?? null}
                    onDismissNotification={handleDismissNotification}
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
