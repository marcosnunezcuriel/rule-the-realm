// Coordina la navegación, las preferencias de sonido y las notificaciones de la aplicación.

import AuthScreen from "./components/auth/AuthScreen";
import AchievementsScreen from "./components/menu/AchievementsScreen";
import MainMenu from "./components/menu/MainMenu";
import MonarchSelection from "./components/menu/MonarchSelection";
import SoundPanel from "./components/modals/SoundPanel";
import GameSession from "./components/screens/GameSession";
import WelcomeIntroduction from "./components/screens/WelcomeIntroduction";
import FadeOverlay from "./components/shared/FadeOverlay";
import ItemsScreen from "./components/menu/ItemsScreen";

import { useAppNavigation } from "./hooks/app/useAppNavigation";
import { useGameNotifications } from "./hooks/app/useGameNotifications";
import { useSoundSettings } from "./hooks/app/useSoundSettings";

import type { GameReward } from "./types/rewards";

function App() {
    const notifications =
        useGameNotifications();

    const navigation = useAppNavigation(
        notifications.clearNotifications,
        "auth"
    );

    const audio = useSoundSettings(
        notifications.notifyAnthemUnlocked
    );

    // Distribuir las recompensas según su naturaleza.
    function handleRewardUnlocked(
        reward: GameReward
    ) {
        if (reward.kind === "music") {
            audio.handleRewardUnlocked(reward);
            return;
        }

        notifications.handleItemReward(
            reward,
            navigation.monarch
        );
    }

    function renderView() {
        switch (navigation.view) {
            case "auth":
                return (
                    <AuthScreen
                        onGuest={() => {
                            navigation.navigateTo("menu");
                        }}
                    />
                );

            case "menu":
                return (
                    <MainMenu
                        onAccess={() => {
                            navigation.navigateTo("auth");
                        }}
                        hasSave={
                            navigation.savedAvailable
                        }
                        showNewGameConfirmation={
                            navigation.confirmNewGame
                        }
                        onNewGame={
                            navigation.startNewGame
                        }
                        onContinue={
                            navigation.continueGame
                        }
                        onAchievements={() => {
                            navigation.navigateTo(
                                "achievements"
                            );
                        }}
                        onItems={() => {
                            navigation.navigateTo("items");
                        }}
                        onSoundSettings={
                            audio.openSoundPanel
                        }
                        onConfirmNewGame={
                            navigation.confirmStartNewGame
                        }
                        onCancelNewGame={
                            navigation.cancelNewGame
                        }
                    />
                );

            case "achievements":
                return (
                    <AchievementsScreen
                        onBack={() => {
                            navigation.navigateTo("menu");
                        }}
                    />
                );

            case "items":
                return (
                    <ItemsScreen
                        onBack={() => {
                            navigation.navigateTo("menu");
                        }}
                    />
                );

            case "choose-monarch":
                return (
                    <MonarchSelection
                        onChoose={
                            navigation.chooseMonarch
                        }
                        onBack={() => {
                            navigation.navigateTo("menu");
                        }}
                    />
                );

            case "intro":
                return (
                    <WelcomeIntroduction
                        monarch={navigation.monarch}
                        onFinish={() => {
                            navigation.navigateTo("game");
                        }}
                    />
                );

            case "game":
                return (
                    <GameSession
                        monarch={navigation.monarch}
                        onOpenMenu={() => {
                            navigation.navigateTo("menu");
                        }}
                        onGameOverMenu={() => {
                            navigation.navigateTo(
                                "menu",
                                true
                            );
                        }}
                        onSoundSettings={
                            audio.openSoundPanel
                        }
                        onAchievementUnlocked={
                            notifications.handleAchievementUnlocked
                        }
                        onRewardUnlocked={
                            handleRewardUnlocked
                        }
                        onModifierChanged={
                            notifications.handleModifierChanged
                        }
                        onStatsChanged={
                            notifications.handleStatsChanged
                        }
                        notification={
                            notifications.activeNotification
                        }
                    />
                );
        }
    }

    return (
        <div
            className="app"
            onPointerDownCapture={audio.unlockAudio}
            onKeyDownCapture={audio.unlockAudio}
            onClickCapture={audio.handleAppClick}
        >
            {renderView()}

            {audio.soundPanelOpen && (
                <SoundPanel
                    settings={audio.soundSettings}
                    hymnUnlocked={audio.hymnUnlocked}
                    onChange={audio.updateSoundSettings}
                    onClose={audio.closeSoundPanel}
                />
            )}

            <FadeOverlay
                variant="navigation"
                stage={navigation.navigationStage}
                onFadeEnd={
                    navigation.handleNavigationFadeEnd
                }
            />
        </div>
    );
}

export default App;
