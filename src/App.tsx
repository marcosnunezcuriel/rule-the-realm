
import { useState } from "react";

import Header from "./components/Header";
import ThroneScene from "./components/ThroneScene";
import DialogueController from "./components/DialogueController";

import { demoDialogue } from "./data/demoDialogue";

type AudiencePhase = "entering" | "speaking" | "exiting" | "finished";

function App() {
    const [phase, setPhase] = useState<AudiencePhase>("entering");

    // Cambiar de fase al terminar una animación.
    function handleVisitorAnimationEnd() {
        setPhase((current) => {
            if (current === "entering") {
                return "speaking";
            }

            if (current === "exiting") {
                return "finished";
            }

            return current;
        });
    }

    // Iniciar la salida del personaje.
    function handleContinue() {
        setPhase("exiting");
    }

    // Repetir la audiencia de prueba.
    function handleRestart() {
        setPhase("entering");
    }

    return (
        <div className="app">
            <Header chapter="I" day={1} />

            <ThroneScene
                timeOfDay="morning"
                visitorPhase={phase}
                onVisitorAnimationEnd={handleVisitorAnimationEnd}
            >
                {phase === "speaking" && (
                    <DialogueController
                        event={demoDialogue}
                        onContinue={handleContinue}
                    />
                )}

                {phase === "finished" && (
                    <div className="audience-demo-end">
                        <p>La audiencia de prueba ha terminado.</p>

                        <button
                            type="button"
                            onClick={handleRestart}
                        >
                            Repetir audiencia
                        </button>
                    </div>
                )}
            </ThroneScene>
        </div>
    );
}

export default App;
