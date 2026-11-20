
import { useCallback, useState } from "react";

import { welcomeParagraphs } from "../data/welcomeMessage";

import TypewriterText from "./TypewriterText";

import "../styles/WelcomeIntroduction.css";

type WelcomeIntroductionProps = {
    onFinish: () => void;
};

function WelcomeIntroduction({
    onFinish,
}: WelcomeIntroductionProps) {
    const [paragraphIndex, setParagraphIndex] = useState(0);
    const [textComplete, setTextComplete] = useState(false);
    const [skipTyping, setSkipTyping] = useState(false);

    const handleTextComplete = useCallback(() => {
        setTextComplete(true);
    }, []);

    const isLastParagraph =
        paragraphIndex === welcomeParagraphs.length - 1;

    // Mostrar el párrafo completo al pulsar el pergamino.
    function handleParchmentClick() {
        if (!textComplete) {
            setSkipTyping(true);
        }
    }

    function handleNext() {
        if (!textComplete) {
            return;
        }

        if (isLastParagraph) {
            onFinish();
            return;
        }

        setParagraphIndex((previous) => previous + 1);
        setTextComplete(false);
        setSkipTyping(false);
    }

    return (
        <main className="welcome">
            <button
                type="button"
                className="welcome__skip"
                onClick={onFinish}
            >
                Saltar introducción
            </button>

            <section
                className={[
                    "welcome__parchment",
                    !textComplete
                        ? "welcome__parchment--typing"
                        : "",
                ].filter(Boolean).join(" ")}
                onClick={handleParchmentClick}
                onKeyDown={(event) => {
                    if (
                        event.target === event.currentTarget &&
                        !textComplete &&
                        (
                            event.key === "Enter" ||
                            event.key === " "
                        )
                    ) {
                        event.preventDefault();
                        handleParchmentClick();
                    }
                }}
                tabIndex={0}
                aria-label={
                    textComplete
                        ? "Párrafo de bienvenida completo"
                        : "Pulsa para mostrar el párrafo completo"
                }
            >
                <img
                    className="welcome__emblem"
                    src="/assets/ui/astaria-emblem.png"
                    alt=""
                    draggable={false}
                />

                <h1 className="welcome__title">
                    Bienvenido a Astaria
                </h1>

                <div className="welcome__divider" />

                <div className="welcome__text">
                    <TypewriterText
                        key={paragraphIndex}
                        text={welcomeParagraphs[paragraphIndex]}
                        skip={skipTyping}
                        onComplete={handleTextComplete}
                        speed={30}
                    />
                </div>

                <div className="welcome__footer">
                    <span className="welcome__page">
                        {paragraphIndex + 1} / {welcomeParagraphs.length}
                    </span>
      
                    <button
                        type="button"
                        className={[
                            "welcome__button",
                            !textComplete
                                ? "welcome__button--hidden"
                                : "",
                        ].filter(Boolean).join(" ")}
                        onClick={handleNext}
                        disabled={!textComplete}
                    >
                        {isLastParagraph
                            ? "Comenzar a reinar"
                            : "Siguiente"}
                    </button>
                </div>
            </section>
        </main>
    );
}

export default WelcomeIntroduction;
