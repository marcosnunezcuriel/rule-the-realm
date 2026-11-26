// Comprueba los estados visuales y el alcance de los fundidos.

import { renderToStaticMarkup } from "react-dom/server";
import {
    describe,
    expect,
    it,
} from "vitest";

import FadeOverlay from "../../components/shared/FadeOverlay";

describe("Fundidos entre pantallas", () => {
    it("mantiene inactiva la capa de navegación cuando no hay transición", () => {
        const html = renderToStaticMarkup(
            <FadeOverlay
                variant="navigation"
                stage="idle"
                onFadeEnd={() => {}}
            />
        );

        expect(html).toContain(
            'class="fade-overlay fade-overlay--navigation"'
        );

        expect(html).not.toContain(
            "fade-overlay--active"
        );
    });

    it("oscurece la pantalla durante la navegación", () => {
        const html = renderToStaticMarkup(
            <FadeOverlay
                variant="navigation"
                stage="darkening"
                onFadeEnd={() => {}}
            />
        );

        expect(html).toContain(
            'class="fade-overlay fade-overlay--navigation fade-overlay--visible fade-overlay--active"'
        );
    });

    it("conserva el fundido a pantalla completa durante los cambios de capítulo", () => {
        const html = renderToStaticMarkup(
            <FadeOverlay
                variant="screen"
                stage="lightening"
                fullScreen={true}
                onFadeEnd={() => {}}
            />
        );

        expect(html).toContain(
            'class="fade-overlay fade-overlay--active fade-overlay--full-screen"'
        );

        expect(html).not.toContain(
            "fade-overlay--visible"
        );
    });

    it("limita los fundidos ordinarios al contenido de la partida", () => {
        const html = renderToStaticMarkup(
            <FadeOverlay
                variant="screen"
                stage="darkening"
                onFadeEnd={() => {}}
            />
        );

        expect(html).toContain(
            'class="fade-overlay fade-overlay--visible fade-overlay--active"'
        );

        expect(html).not.toContain(
            "fade-overlay--navigation"
        );

        expect(html).not.toContain(
            "fade-overlay--full-screen"
        );
    });
});
