import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import StatChangeToast from "../../components/kingdom/StatChangeToast";

describe("Notificaciones de estadísticas", () => {
    it("agrupa varios cambios en una notificación", () => {
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

        expect(html).toContain(
            'aria-label="Oro: +1"'
        );

        expect(html).toContain(
            'aria-label="Prestigio: -3"'
        );

        expect(
            html.match(/class="stat-change-toast"/g)
        ).toHaveLength(1);

        expect(
            html.match(/class="stat-change-toast__item /g)
        ).toHaveLength(2);
    });

    it("distingue valores positivos y negativos", () => {
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

    it("utiliza los iconos originales de las estadísticas", () => {
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
        expect(html).toContain(
            'aria-label="Oro: +10"'
        );
    });
});
