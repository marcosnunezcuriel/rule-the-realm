import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import NotificationToast from "../../components/shared/NotificationToast";

describe("Notificaciones del juego", () => {
    it("muestra un logro con el estilo dorado", () => {
        const html = renderToStaticMarkup(
            <NotificationToast
                notification={{
                    sequence: 1,
                    kind: "achievement",
                    id: "hand-of-king",
                }}
            />
        );

        expect(html).toContain(
            "notification-toast--achievement"
        );
        expect(html).toContain("Mano del rey");
    });

    it("muestra un modificador añadido en verde", () => {
        const html = renderToStaticMarkup(
            <NotificationToast
                notification={{
                    sequence: 2,
                    kind: "modifier-added",
                    id: "traveling-circus",
                }}
            />
        );

        expect(html).toContain(
            "notification-toast--modifier-added"
        );
        expect(html).toContain("Modificador añadido");
        expect(html).toContain("Circo ambulante");
    });

    it("muestra un modificador eliminado en rojo", () => {
        const html = renderToStaticMarkup(
            <NotificationToast
                notification={{
                    sequence: 3,
                    kind: "modifier-removed",
                    id: "traveling-circus",
                }}
            />
        );

        expect(html).toContain(
            "notification-toast--modifier-removed"
        );
        expect(html).toContain("Modificador eliminado");
    });

    it("muestra Fiebre negra en cursiva", () => {
        const html = renderToStaticMarkup(
            <NotificationToast
                notification={{
                    sequence: 4,
                    kind: "modifier-added",
                    id: "black-fever",
                }}
            />
        );

        expect(html).toContain(
            "<em>Fiebre negra</em>"
        );
    });
});
