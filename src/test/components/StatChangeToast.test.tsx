import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import StatChangeToast from "../../components/kingdom/StatChangeToast";

describe("Notificaciones de estadísticas", () => {
    it("muestra dos cambios simultáneos en un solo grupo", () => {
        const html = renderToStaticMarkup(
            <StatChangeToast
                notification={{
                    sequence: 1,
                    changes: {
                        gold: 1,
                        prestige: -3,
                    },
                }}
            />
        );

        expect(html).toContain('aria-label="Oro: +1"');
        expect(html).toContain('aria-label="Prestigio: -3"');

        const groups = html.match(
            /class="stat-change-toast"/g
        );

        const cards = html.match(
            /class="stat-change-toast__item /g
        );

        expect(groups).toHaveLength(1);
        expect(cards).toHaveLength(2);
    });

    it("distingue ganancias y pérdidas", () => {
        const html = renderToStaticMarkup(
            <StatChangeToast
                notification={{
                    sequence: 2,
                    changes: {
                        faith: 5,
                        population: -2,
                    },
                }}
            />
        );

        expect(html).toContain(
            "stat-change-toast__item--positive"
        );

        expect(html).toContain(
            "stat-change-toast__item--negative"
        );
    });

    it("utiliza los iconos SVG originales", () => {
        const html = renderToStaticMarkup(
            <StatChangeToast
                notification={{
                    sequence: 3,
                    changes: {
                        gold: 10,
                    },
                }}
            />
        );

        expect(html).toContain("<svg");
        expect(html).toContain("<ellipse");
        expect(html).toContain('aria-label="Oro: +10"');
    });
});
