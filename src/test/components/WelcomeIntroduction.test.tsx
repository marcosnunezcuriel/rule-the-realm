// Comprueba la presentación de la introducción para ambos protagonistas.

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import WelcomeIntroduction from "../../components/screens/WelcomeIntroduction";

describe("Pantalla de introducción", () => {
    it("da la bienvenida al rey", () => {
        const html = renderToStaticMarkup(
            <WelcomeIntroduction
                monarch="king"
                onFinish={() => {}}
            />
        );

        expect(html).toContain(
            "Bienvenido a Astaria"
        );
    });

    it("da la bienvenida a la reina", () => {
        const html = renderToStaticMarkup(
            <WelcomeIntroduction
                monarch="queen"
                onFinish={() => {}}
            />
        );

        expect(html).toContain(
            "Bienvenida a Astaria"
        );
    });
});
