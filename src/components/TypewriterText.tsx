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
    const totalCharacters = characters.length;

    // Si el jugador salta la animación, mostramos todo
    // el texto directamente, sin modificar el estado.
    const displayedLength = skip
        ? totalCharacters
        : visibleLength;

    // Mostrar los caracteres progresivamente.
    useEffect(() => {
        if (skip || visibleLength >= totalCharacters) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setVisibleLength((previous) => previous + 1);
        }, speed);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [visibleLength, text, skip, speed, totalCharacters]);

    // Avisar cuando se haya mostrado todo el texto.
    useEffect(() => {
        if (displayedLength >= totalCharacters) {
            onComplete();
        }
    }, [displayedLength, text, totalCharacters, onComplete]);

    return (
        <p className="speech-bubble__text">
            {characters.slice(0, displayedLength).join("")}
        </p>
    );
}

export default TypewriterText;
