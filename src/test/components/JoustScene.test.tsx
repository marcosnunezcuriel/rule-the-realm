import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import JoustScene from "../../components/scene/JoustScene";

import type { MonarchRole } from "../../types/monarch";
import type { AudiencePhase } from "../../types/game";

function renderJoust(
    monarch: MonarchRole,
    withBrother: boolean,
    visitorPhase: AudiencePhase = "speaking"
): string {
    return renderToStaticMarkup(
        <JoustScene
            monarch={monarch}
            withBrother={withBrother}
            visitorPhase={visitorPhase}
            visitorImage="/assets/characters/commoners/knight-champion.png"
            visitorName="Caballero campeón"
            visitorKey="2.1"
            onVisitorAnimationEnd={() => {}}
        >
            <p>Diálogo del campeón</p>
        </JoustScene>
    );
}

describe("Escenario de la justa", () => {
    it("muestra el fondo del rey sin su hermano", () => {
        expect(
            renderJoust("king", false)
        ).toContain("joust-king.png");
    });

    it("muestra el fondo del rey con su hermano", () => {
        expect(
            renderJoust("king", true)
        ).toContain("joust-king-2.png");
    });

    it("muestra el fondo de la reina sin su hermano", () => {
        expect(
            renderJoust("queen", false)
        ).toContain("joust-queen.png");
    });

    it("muestra el fondo de la reina con su hermano", () => {
        expect(
            renderJoust("queen", true)
        ).toContain("joust-queen-2.png");
    });

    it("muestra al caballero campeón", () => {
        const html = renderJoust("king", false);

        expect(html).toContain(
            "knight-champion.png"
        );

        expect(html).toContain(
            "Caballero campeón"
        );
    });

    it("utiliza la animación habitual de entrada", () => {
        expect(
            renderJoust("king", false, "entering")
        ).toContain("visitor--entering");
    });

    it("utiliza la animación habitual de salida", () => {
        expect(
            renderJoust("king", false, "exiting")
        ).toContain("visitor--exiting");
    });

    it("oculta al caballero durante la espera", () => {
        expect(
            renderJoust("king", false, "waiting")
        ).not.toContain("knight-champion.png");
    });

    it("no añade un sprite independiente del monarca", () => {
        const html = renderJoust("king", false);

        expect(html).not.toContain(
            "character--monarch"
        );
    });

    it("muestra el contenido del diálogo", () => {
        expect(
            renderJoust("king", false)
        ).toContain("Diálogo del campeón");
    });
});
