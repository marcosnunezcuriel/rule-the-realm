// Representa los bocadillos de diálogo y los controles correspondientes.

import type { ReactNode } from "react";

import "../../styles/narrative/SpeechBubble.css";

type SpeechBubbleProps = {
    variant: "visitor" | "king";
    speaker?: string;
    children: ReactNode;
    onSkip?: () => void;
};

function SpeechBubble({
    variant,
    speaker,
    children,
    onSkip,
}: SpeechBubbleProps) {
    return (
        <div
            className={`speech-bubble speech-bubble--${variant}`}
            onClick={onSkip}
            role={onSkip ? "button" : undefined}
            tabIndex={onSkip ? 0 : undefined}
            aria-label={onSkip ? "Completar el texto" : undefined}
            onKeyDown={
                onSkip
                    ? (event) => {
                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {
                            event.preventDefault();
                            onSkip();
                        }
                    }
                    : undefined
            }
        >
            {speaker && (
                <h2 className="speech-bubble__speaker">
                    {speaker}
                </h2>
            )}

            {children}
        </div>
    );
}

export default SpeechBubble;
