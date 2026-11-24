import { useCallback, useEffect, useRef, useState } from "react";

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

import { getStatDifferences } from "./game/getStatDifferences";
import { insertGameNotification } from "./game/insertGameNotification";

import type { KingdomValues } from "./types/stats";
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

    // Cola compartida de estadísticas, modificadores y logros.
    const [notificationQueue, setNotificationQueue] =
        useState<GameNotification[]>([]);

    const nextNotificationId = useRef(0);

    // Identifica la notificación que ya está mostrándose.
    // No debe ser interrumpida por avisos nuevos.
    const displayedSequenceRef = useRef<number | null>(null);

    function enqueueNotification(notification: GameNotification) {
        const displayedSequence = displayedSequenceRef.current;

        setNotificationQueue((previous) => {
            return insertGameNotification(
                previous,
                notification,
                displayedSequence
            );
        });
    }

    // Cambios de estadísticas de una decisión o audiencia.
    function handleStatsChanged(
        previous: KingdomValues,
        next: KingdomValues
    ) {
        const changes = getStatDifferences(previous, next);

        if (Object.keys(changes).length === 0) {
            return;
        }

        nextNotificationId.current += 1;

        enqueueNotification({
            sequence: nextNotificationId.current,
            kind: "stats",
            changes,
        });
    }

    // Activación o retirada de un modificador.
    function handleModifierChanged(
        id: ModifierId,
        change: ModifierChange
    ) {
        nextNotificationId.current += 1;

        enqueueNotification({
            sequence: nextNotificationId.current,
            kind: change === "added"
                ? "modifier-added"
                : "modifier-removed",
            id,
        });
    }

    // Desbloquear un logro y anunciarlo.
    function handleAchievementUnlocked(id: AchievementId) {
        if (!unlockAchievement(id)) {
            return;
        }

        nextNotificationId.current += 1;

        enqueueNotification({
            sequence: nextNotificationId.current,
            kind: "achievement",
            id,
        });
    }

    // Retirar exclusivamente la notificación indicada.
    const handleDismissNotification = useCallback(
        (sequence: number) => {
            setNotificationQueue((previous) => {
                if (previous[0]?.sequence !== sequence) {
                    return previous;
                }

                return previous.slice(1);
            });
        },
        []
    );

    const activeNotificationSequence =
        notificationQueue[0]?.sequence ?? null;

    // Un solo temporizador para los tres tipos de avisos.
    // Sigue funcionando aunque cambie la pantalla del juego.
    useEffect(() => {
        displayedSequenceRef.current =
            activeNotificationSequence;

        if (activeNotificationSequence === null) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            handleDismissNotification(
                activeNotificationSequence
            );
        }, 5000);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [
        activeNotificationSequence,
        handleDismissNotification,
    ]);

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
                    onStatsChanged={handleStatsChanged}
                    notification={notificationQueue[0] ?? null}
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
