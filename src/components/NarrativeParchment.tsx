import { useCallback, useState } from "react";

import TypewriterText from "./TypewriterText";

import "../styles/WelcomeIntroduction.css";

type NarrativeParchmentProps = {
    title: string;
    paragraphs: readonly string[];

    finishLabel: string;
    onFinish: () => void;

    topActionLabel?: string;
    onTopAction?: () => void;

    finishDisabled?: boolean;
    finishNotice?: string;

    initialParagraphIndex?: number;
    onParagraphChange?: (index: number) => void;
};

function NarrativeParchment({
    title,
    paragraphs,
    finishLabel,
    onFinish,
    topActionLabel,
    onTopAction,
    finishDisabled = false,
    finishNotice,
    initialParagraphIndex = 0,
    onParagraphChange,
}: NarrativeParchmentProps) {
    const [paragraphIndex, setParagraphIndex] = useState(
        initialParagraphIndex
    );
    const [textComplete, setTextComplete] = useState(false);
    const [skipTyping, setSkipTyping] = useState(false);

    const handleTextComplete = useCallback(() => {
        setTextComplete(true);
    }, []);

    const isLastParagraph =
        paragraphIndex === paragraphs.length - 1;

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
            if (!finishDisabled) {
                onFinish();
            }

            return;
        }

        const nextIndex = paragraphIndex + 1;

        setParagraphIndex(nextIndex);
        onParagraphChange?.(nextIndex);

        setTextComplete(false);
        setSkipTyping(false);
    }

    return (
        <main className="welcome">
            {topActionLabel && onTopAction && (
                <button
                    type="button"
                    className="welcome__skip"
                    onClick={onTopAction}
                >
                    {topActionLabel}
                </button>
            )}

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
                        ? "Párrafo completo"
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
                    {title}
                </h1>

                <div className="welcome__divider" />

                <div className="welcome__text">
                    <TypewriterText
                        key={paragraphIndex}
                        text={paragraphs[paragraphIndex] ?? ""}
                        skip={skipTyping}
                        onComplete={handleTextComplete}
                        speed={30}
                    />
                </div>

                <div className="welcome__footer">
                    <span className="welcome__page">
                        {paragraphIndex + 1} / {paragraphs.length}
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
                        disabled={
                            !textComplete ||
                            (isLastParagraph && finishDisabled)
                        }
                    >
                        {isLastParagraph
                            ? finishLabel
                            : "Siguiente"}
                    </button>
                </div>

                {finishNotice && isLastParagraph && textComplete && (
                    <p className="welcome__availability">
                        {finishNotice}
                    </p>
                )}
            </section>
        </main>
    );
}

export default NarrativeParchment;
