import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import NotificationToast from "../../components/shared/NotificationToast";

describe("Notificaciones del juego", () => {
    it("muestra un logro con su nombre", () => {
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
        expect(html).toContain("Logro desbloqueado");
    });

    it("distingue los modificadores añadidos y eliminados", () => {
        const added = renderToStaticMarkup(
            <NotificationToast
                notification={{
                    sequence: 2,
                    kind: "modifier-added",
                    id: "traveling-circus",
                }}
            />
        );

        const removed = renderToStaticMarkup(
            <NotificationToast
                notification={{
                    sequence: 3,
                    kind: "modifier-removed",
                    id: "traveling-circus",
                }}
            />
        );

        expect(added).toContain(
            "notification-toast--modifier-added"
        );
        expect(added).toContain("Circo ambulante");

        expect(removed).toContain(
            "notification-toast--modifier-removed"
        );
        expect(removed).toContain("Modificador eliminado");
    });

    it("mantiene el formato narrativo de los modificadores", () => {
        const html = renderToStaticMarkup(
            <NotificationToast
                notification={{
                    sequence: 4,
                    kind: "modifier-added",
                    id: "black-fever",
                }}
            />
        );

        expect(html).toContain("<em>Fiebre negra</em>");
    });

    it("muestra el desbloqueo musical como aviso especial", () => {
        const html = renderToStaticMarkup(
            <NotificationToast
                notification={{
                    sequence: 5,
                    kind: "anthem-unlocked",
                }}
            />
        );

        expect(html).toContain(
            "notification-toast--anthem-unlocked"
        );

        expect(html).toContain(
            "Has desbloqueado el Himno de Astaria"
        );

        expect(html).toContain(
            "Consulta el panel de control de sonido."
        );
    });
});
