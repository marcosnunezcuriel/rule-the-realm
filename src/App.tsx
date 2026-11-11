import { useState } from "react";
import { HomePage } from "./pages/HomePage";
import { IntroPage } from "./pages/IntroPage";

function App() {
    const [screen, setScreen] = useState("home");

    return (
        <>
            {screen === "home" && (
                <HomePage onNewGame={() => setScreen("intro")} />
            )}
            {screen === "intro" && (
                <IntroPage />
            )}
        </>
    )
}

export default App
