import MainMenu from "./components/menu/MainMenu";
import AchievementsScreen from "./components/menu/AchievementsScreen";
import WelcomeIntroduction from "./components/screens/WelcomeIntroduction";
import GameSession from "./components/screens/GameSession";
import MonarchSelection from "./components/menu/MonarchSelection";

import SoundPanel from "./components/modals/SoundPanel";
import FadeOverlay from "./components/shared/FadeOverlay";

import { useAppNavigation } from "./hooks/app/useAppNavigation";
import { useGameNotifications } from "./hooks/app/useGameNotifications";
import { useSoundSettings } from "./hooks/app/useSoundSettings";

function App() {
    const notifications =
        useGameNotifications();

    const navigation = useAppNavigation(
        notifications.clearNotifications
    );

    const audio = useSoundSettings(
        notifications.notifyAnthemUnlocked
    );

    function renderView() {
        switch (navigation.view) {
            case "menu":
                return (
                    <MainMenu
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
                            audio.handleRewardUnlocked
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
