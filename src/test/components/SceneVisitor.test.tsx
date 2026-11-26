// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import SceneVisitor from "../../components/scene/SceneVisitor";

import type { AudiencePhase } from "../../types/game";

let container: HTMLDivElement;
let root: Root;

function renderVisitor(
    phase: AudiencePhase,
    onAnimationEnd: () => void = () => {}
) {
    act(() => {
        root.render(
            <SceneVisitor
                visitorPhase={phase}
                visitorImage="/assets/characters/courtiers/royal-advisor.png"
                visitorName="Consejera Real"
                onVisitorAnimationEnd={onAnimationEnd}
            />
        );
    });
}

describe("Componente común de visitantes", () => {
    beforeEach(() => {
        vi.stubGlobal(
            "IS_REACT_ACT_ENVIRONMENT",
            true
        );

        container = document.createElement("div");

        root = createRoot(container);
    });

    afterEach(() => {
        act(() => {
            root.unmount();
        });

        vi.unstubAllGlobals();
    });

    it.each([
        "entering",
        "speaking",
        "exiting",
    ] as const)(
        "muestra al visitante durante la fase %s",
        (phase) => {
            renderVisitor(phase);

            const visitor = container.querySelector(
                ".character--visitor"
            );

            expect(visitor).not.toBeNull();

            expect(
                visitor?.classList.contains(
                    `visitor--${phase}`
                )
            ).toBe(true);

            const image = visitor?.querySelector(
                "img"
            );

            expect(
                image?.getAttribute("alt")
            ).toBe("Consejera Real");

            expect(
                image?.getAttribute("src")
            ).toContain("royal-advisor.png");
        }
    );

    it.each([
        "waiting",
        "transitioning",
    ] as const)(
        "oculta al visitante durante la fase %s",
        (phase) => {
            renderVisitor(phase);

            expect(
                container.querySelector(
                    ".character--visitor"
                )
            ).toBeNull();
        }
    );

    it("solo notifica el final de la animación del visitante", () => {
        const onAnimationEnd = vi.fn();

        renderVisitor(
            "entering",
            onAnimationEnd
        );

        const visitor = container.querySelector(
            ".character--visitor"
        );

        const image = visitor?.querySelector(
            "img"
        );

        if (!visitor || !image) {
            throw new Error(
                "No se ha renderizado el visitante."
            );
        }

        // Simular las variantes del evento de animación
        // que React puede utilizar en jsdom.
        function dispatchAnimationEnd(element: Element) {
            act(() => {
                for (const eventName of [
                    "animationend",
                    "webkitAnimationEnd",
                ]) {
                    element.dispatchEvent(
                        new Event(eventName, {
                            bubbles: true,
                        })
                    );
                }
            });
        }

        // Una animación de un elemento interior
        // no debe avanzar la audiencia.
        dispatchAnimationEnd(image);

        expect(
            onAnimationEnd
        ).not.toHaveBeenCalled();

        // La animación del propio visitante
        // sí debe notificar al controlador.
        dispatchAnimationEnd(visitor);

        expect(
            onAnimationEnd
        ).toHaveBeenCalledTimes(1);
    });
});
