import {
    describe,
    expect,
    it,
} from "vitest";

import { renderToStaticMarkup } from "react-dom/server";

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
            'class="navigation-fade"'
        );

        expect(html).not.toContain(
            "navigation-fade--active"
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
            'class="navigation-fade navigation-fade--visible navigation-fade--active"'
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
            'class="screen-fade screen-fade--active screen-fade--full-screen"'
        );

        expect(html).not.toContain(
            "screen-fade--visible"
        );
    });
});
