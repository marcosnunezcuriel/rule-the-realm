import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ThroneScene from "../../components/scene/ThroneScene";

import { getSceneBackgrounds } from "../../game/scenes/getSceneBackgrounds";
import { getSceneVisualClassName } from "../../game/scenes/getSceneVisualClassName";

import type { MonarchRole } from "../../types/monarch";
import type {
    SceneTime,
    SceneBackgroundMap,
} from "../../types/scene";

function renderScene(
    blackFeverActive: boolean,
    monarch: MonarchRole = "king",
    timeOfDay: SceneTime = "morning",
    backgroundMap: SceneBackgroundMap =
        getSceneBackgrounds([])
): string {
    return renderToStaticMarkup(
        <ThroneScene
            monarch={monarch}
            timeOfDay={timeOfDay}
            backgroundMap={backgroundMap}
            visualClassName={
                getSceneVisualClassName(
                    blackFeverActive
                        ? ["black-fever"]
                        : []
                )
            }
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

    it("mantiene los diálogos fuera de la capa visual", () => {
        const html = renderScene(true);

        expect(html).toContain(
            '</div><div class="throne-stage__dialogue">'
        );

        expect(html).toContain(
            'class="throne-stage__dialogue"><p>Diálogo de prueba</p>'
        );
    });

    it("mantiene los tres fondos montados para sus transiciones", () => {
        const html = renderScene(
            false,
            "king",
            "evening"
        );

        expect(
            html.match(
                /class="throne-stage__background(?: |")/g
            )
        ).toHaveLength(3);

        expect(
            html.match(
                /class="throne-stage__background throne-stage__background--active"/g
            )
        ).toHaveLength(1);

        expect(html).toMatch(
            /class="throne-stage__background throne-stage__background--active"[^>]*src="[^"]*background-evening\.png"/
        );
    });

    it("conserva los fondos del circo y la pose correspondiente", () => {
        const html = renderScene(
            false,
            "queen",
            "evening",
            getSceneBackgrounds([
                "traveling-circus",
            ])
        );

        expect(html).toContain(
            "background-morning-circus.png"
        );

        expect(html).toContain(
            "background-evening-circus.png"
        );

        expect(html).toContain(
            "background-night-circus.png"
        );

        expect(html).toMatch(
            /class="throne-stage__background throne-stage__background--active"[^>]*src="[^"]*background-evening-circus\.png"/
        );

        expect(html).toMatch(
            /class="character character--monarch character--monarch--active"[^>]*src="[^"]*queen-throne-pose-2\.png"/
        );

        expect(html).not.toContain(
            "scene-stage--special"
        );
    });
});
