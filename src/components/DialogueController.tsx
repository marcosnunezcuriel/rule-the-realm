
import { useCallback, useState } from "react";

import SpeechBubble from "./SpeechBubble";
import TypewriterText from "./TypewriterText";

import type {
    Decision,
    DialogueEvent,
} from "../types/dialogue";

type DialogueControllerProps = {
    event: DialogueEvent;
    onContinue: () => void;
    continueLabel?: string;
};

function DialogueController({
    event,
    onContinue,
    continueLabel = "Continuar",
}: DialogueControllerProps) {

    const [decision, setDecision] = useState<Decision | null>(null);
    const [lineIndex, setLineIndex] = useState(0);

    const [isTextComplete, setIsTextComplete] = useState(false);
    const [skipTyping, setSkipTyping] = useState(false);

    // Seleccionar los textos correspondientes.
    const lines =
        decision === null || !event.responses
            ? event.introduction
            : event.responses[decision];


    const isLastLine = lineIndex === lines.length - 1;

    // Se ejecuta cuando termina la animación del texto.
    const handleTextComplete = useCallback(() => {
        setIsTextComplete(true);
    }, []);

    // Pasar al siguiente bloque de diálogo.
    function handleNext() {
        if (!isTextComplete || isLastLine) {
            return;
        }

        setLineIndex((previous) => previous + 1);
        setIsTextComplete(false);
        setSkipTyping(false);
    }

    // Guardar la decisión y comenzar su respuesta.
    function handleDecision(answer: Decision) {
        setDecision(answer);
        setLineIndex(0);

        setIsTextComplete(false);
        setSkipTyping(false);
    }

    return (
        <>
            <SpeechBubble
                variant="visitor"
                speaker={event.speaker}
                onSkip={
                    !isTextComplete
                        ? () => setSkipTyping(true)
                        : undefined
                }
            >
                <TypewriterText
                    key={`${decision ?? "introduction"}-${lineIndex}`}
                    text={lines[lineIndex]}
                    skip={skipTyping}
                    onComplete={handleTextComplete}
                />

                {isTextComplete && !isLastLine && (
                    <button
                        type="button"
                        className="speech-bubble__next"
                        onClick={handleNext}
                    >
                        Siguiente
                    </button>
                )}

                {isTextComplete &&
                    isLastLine &&
                    (decision !== null || !event.responses) && (
                        <button
                            type="button"
                            className="speech-bubble__next"
                            onClick={onContinue}
                        >
                            {continueLabel}
                        </button>
                    )}
            </SpeechBubble>

            {event.responses && decision === null && isLastLine && isTextComplete && (
                <SpeechBubble variant="king">
                    <div className="speech-bubble__choices">
                        <button
                            type="button"
                            className="speech-bubble__choice speech-bubble__choice--yes"
                            aria-label="Sí"
                            onClick={() => handleDecision("yes")}
                        >
                            Y
                        </button>

                        <span
                            className="speech-bubble__separator"
                            aria-hidden="true"
                        >
                            /
                        </span>

                        <button
                            type="button"
                            className="speech-bubble__choice speech-bubble__choice--no"
                            aria-label="No"
                            onClick={() => handleDecision("no")}
                        >
                            N
                        </button>
                    </div>
                </SpeechBubble>
            )}
        </>
    );
}

export default DialogueController;
