import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import ThroneScene from "../../components/scene/ThroneScene";

import { getSceneBackgrounds } from "../../game/getSceneBackgrounds";

import type { MonarchRole } from "../../types/monarch";

function renderScene(
    blackFeverActive: boolean,
    monarch: MonarchRole = "king"
): string {
    return renderToStaticMarkup(
        <ThroneScene
            monarch={monarch}
            timeOfDay="morning"
            backgroundMap={getSceneBackgrounds([])}
            blackFeverActive={blackFeverActive}
            visitorPhase="speaking"
            visitorImage="/assets/characters/courtiers/royal-advisor.png"
            visitorName="Consejera Real"
            visitorKey="test"
            onVisitorAnimationEnd={() => {}}
        >
            <p>Diálogo de prueba</p>
        </ThroneScene>
    );
}

describe("Escenario del salón del trono", () => {
    it("mantiene el aspecto normal sin Fiebre negra", () => {
        const html = renderScene(false);

        expect(html).toContain(
            'class="throne-stage__visuals"'
        );

        expect(html).not.toContain(
            "throne-stage__visuals--black-fever"
        );
    });

    it("aplica el efecto visual durante la Fiebre negra", () => {
        const html = renderScene(true);

        expect(html).toContain(
            'class="throne-stage__visuals throne-stage__visuals--black-fever"'
        );
    });

    it("aplica el efecto visual también con la reina", () => {
        const html = renderScene(true, "queen");

        expect(html).toContain(
            "throne-stage__visuals--black-fever"
        );

        expect(html).toContain(
            "queen-throne-pose-1.png"
        );
    });

    it("recupera el aspecto normal sin el modificador", () => {
        expect(renderScene(true)).toContain(
            "throne-stage__visuals--black-fever"
        );

        expect(renderScene(false)).not.toContain(
            "throne-stage__visuals--black-fever"
        );
    });

    it("mantiene los diálogos fuera de la capa visual", () => {
        const html = renderScene(true);

        expect(html).toContain(
            '</div><div class="throne-stage__dialogue">'
        );

        expect(html).toContain(
            'class="throne-stage__dialogue"><p>Diálogo de prueba</p>'
        );
    });
});
