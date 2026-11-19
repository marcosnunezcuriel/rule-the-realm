
import { useEffect, useState } from "react";

type TypewriterTextProps = {
    text: string;
    skip: boolean;
    onComplete: () => void;
    speed?: number;
};

function TypewriterText({
    text,
    skip,
    onComplete,
    speed = 30,
}: TypewriterTextProps) {
    const [visibleLength, setVisibleLength] = useState(0);

    const characters = Array.from(text);

    // Mostrar los caracteres progresivamente.
    useEffect(() => {
        if (skip) {
            setVisibleLength(characters.length);
            return;
        }

        if (visibleLength >= characters.length) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setVisibleLength((previous) => previous + 1);
        }, speed);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [visibleLength, text, skip, speed]);

    // Avisar cuando se haya mostrado todo el texto.
    useEffect(() => {
        if (visibleLength >= characters.length) {
            onComplete();
        }
    }, [visibleLength, text, onComplete]);

    return (
        <p className="speech-bubble__text">
            {characters.slice(0, visibleLength).join("")}
        </p>
    );
}

export default TypewriterText;
