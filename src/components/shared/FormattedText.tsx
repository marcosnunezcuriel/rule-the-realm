// Aplica el formato narrativo manteniendo la compatibilidad con la escritura progresiva.

import { Fragment } from "react";

import { italicTerms } from "../../data/narrative/formattedTerms";

type FormattedTextProps = {
    text: string;
    visibleLength?: number;
};

// Escapar caracteres especiales de expresiones regulares.
function escapeRegExp(text: string): string {
    return text.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
}

const escapedTerms = italicTerms.map(
    escapeRegExp
);

const italicPattern =
    escapedTerms.length > 0
        ? new RegExp(
            `(\\b(?:${escapedTerms.join("|")})\\b)`,
            "gi"
        )
        : null;

function FormattedText({
    text,
    visibleLength,
}: FormattedTextProps) {
    const segments = italicPattern !== null
        ? text.split(italicPattern)
        : [text];

    const totalVisible =
        visibleLength ?? Array.from(text).length;

    return (
        <>
            {segments.map((segment, index) => {
                const previousLength = Array.from(
                    segments.slice(0, index).join("")
                ).length;

                const availableLength = Math.max(
                    0,
                    totalVisible - previousLength
                );

                const visibleText = Array.from(segment)
                    .slice(0, availableLength)
                    .join("");

                if (!visibleText) {
                    return null;
                }

                // Los grupos capturados por split aparecen
                // en las posiciones impares.
                const isItalicTerm =
                    index % 2 === 1;

                return (
                    <Fragment key={index}>
                        {isItalicTerm ? (
                            <em>{visibleText}</em>
                        ) : (
                            visibleText
                        )}
                    </Fragment>
                );
            })}
        </>
    );
}

export default FormattedText;
