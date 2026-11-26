import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import FormattedText from "../../components/shared/FormattedText";

describe("Formato de textos narrativos", () => {
    it("muestra Fiebre negra en cursiva", () => {
        const html = renderToStaticMarkup(
            <FormattedText text="Se extiende la Fiebre negra." />
        );

        expect(html).toContain("<em>Fiebre negra</em>");
    });

    it("reconoce la expresión en minúsculas", () => {
        const html = renderToStaticMarkup(
            <FormattedText text="La fiebre negra amenaza Astaria." />
        );

        expect(html).toContain("<em>fiebre negra</em>");
    });

    it("mantiene la cursiva durante la escritura", () => {
        const html = renderToStaticMarkup(
            <FormattedText
                text="La Fiebre negra."
                visibleLength={7}
            />
        );

        expect(html).toContain("<em>Fieb</em>");
    });

    it("no modifica textos normales", () => {
        const html = renderToStaticMarkup(
            <FormattedText text="El reino prospera." />
        );

        expect(html).toBe("El reino prospera.");
    });

    it("formatea todas las apariciones", () => {
        const html = renderToStaticMarkup(
            <FormattedText
                text="La Fiebre negra, también llamada fiebre negra."
            />
        );

        expect(html).toContain("<em>Fiebre negra</em>");
        expect(html).toContain("<em>fiebre negra</em>");
    });

    it("reconoce los términos independientemente de sus mayúsculas", () => {
        const html = renderToStaticMarkup(
            <FormattedText
                text="La FIEBRE NEGRA amenaza el reino."
            />
        );

        expect(html).toContain(
            "<em>FIEBRE NEGRA</em>"
        );
    });

    it("no formatea coincidencias parciales de palabras", () => {
        const html = renderToStaticMarkup(
            <FormattedText
                text="Se mencionaron distintas fiebres negras."
            />
        );

        expect(html).not.toContain("<em>");

        expect(html).toBe(
            "Se mencionaron distintas fiebres negras."
        );
    });
});
