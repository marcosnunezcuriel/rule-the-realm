import { Fragment } from "react";

type FormattedTextProps = {
    text: string;
    visibleLength?: number;
};

// Expresiones que deben aparecer en cursiva.
const SPECIAL_TERMS = /(\bfiebre negra\b)/gi;

function FormattedText({
    text,
    visibleLength,
}: FormattedTextProps) {
    const segments = text.split(SPECIAL_TERMS);

    const totalVisible =
        visibleLength ?? Array.from(text).length;

    return (
        <>
            {segments.map((segment, index) => {
                // Número de caracteres anteriores al segmento.
                const previousLength = Array.from(
                    segments.slice(0, index).join("")
                ).length;

                // Caracteres visibles de este segmento.
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

                const isSpecialTerm =
                    /^fiebre negra$/i.test(segment);

                return (
                    <Fragment key={index}>
                        {isSpecialTerm ? (
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
