import { useState } from "react";

import Header from "./components/Header";
import ThroneScene from "./components/ThroneScene";
import DialogueController from "./components/DialogueController";
import SpeechBubble from "./components/SpeechBubble";

import { demoDialogue } from "./data/demoDialogue";

function App() {
	const [finished, setFinished] = useState(false);

	return (
		<div className="app">
			<Header chapter="I" day={1} />

			<ThroneScene timeOfDay="morning">
				{finished ? (
					<SpeechBubble variant="visitor" speaker="Consejera Real" >
						<p className="speech-bubble__text">
							La audiencia de prueba ha terminado.
						</p>

						<button
							type="button"
							className="speech-bubble__next"
							onClick={() => setFinished(false)}
						>
							Repetir prueba
						</button>
					</SpeechBubble>
					) : (
					<DialogueController
						event={demoDialogue}
						onContinue={() => setFinished(true)}
					/>
				)}
			</ThroneScene>
		</div>
	);
}

export default App;
