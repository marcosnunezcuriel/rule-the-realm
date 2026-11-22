import { useCallback, useState } from "react";

import MainMenu from "./components/screens/MainMenu";
import AchievementsScreen from "./components/screens/AchievementsScreen";
import WelcomeIntroduction from "./components/screens/WelcomeIntroduction";
import GameSession from "./components/screens/GameSession";

import {
    clearSavedGame,
    hasSavedGame,
} from "./storage/gameStorage";

import { unlockAchievement } from "./storage/achievementsStorage";

import type { AchievementId } from "./data/achievements";
import type { FadeStage } from "./types/game";

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

    // Los logros permanecen aunque se cambie de partida.
    const [achievementQueue, setAchievementQueue] =
        useState<AchievementId[]>([]);

    function handleAchievementUnlocked(id: AchievementId) {
        if (!unlockAchievement(id)) {
            return;
        }

        setAchievementQueue((previous) => [
            ...previous,
            id,
        ]);
    }

    const handleDismissAchievement = useCallback(() => {
        setAchievementQueue((previous) => previous.slice(1));
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
                    achievementNotification={
                        achievementQueue[0] ?? null
                    }
                    onDismissAchievement={handleDismissAchievement}
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
