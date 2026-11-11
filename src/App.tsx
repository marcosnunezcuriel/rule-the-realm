import { useState } from "react";
import { HomePage } from "./pages/HomePage";
import { IntroPage } from "./pages/IntroPage";
import { GamePage } from "./pages/GamePage";

function App() {
    const [screen, setScreen] = useState("home");

    return (
        <>
            {screen === "home" && (
                <HomePage onNewGame = {() => setScreen("intro")} />
            )}
            {screen === "intro" && (
                <IntroPage onFinished = {() => setScreen("game")}/>
            )}
            {screen === "game" && (
                <GamePage />
            )}
        </>
    )
}

export default App
