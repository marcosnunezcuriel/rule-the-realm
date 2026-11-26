// Comprueba la presentación de los avisos de contenido.

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import NotificationToast from "../../components/shared/NotificationToast";

import { items } from "../../data/registries/itemRegistry";

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

    it.each([
        "anthem-of-astaria",
        "rough-emerald",
    ] as const)(
        "muestra la aparición y notificación del objeto %s",
        (id) => {
            const html = renderToStaticMarkup(
                <NotificationToast
                    notification={{
                        sequence: 5,
                        kind: "item-unlocked",
                        id,
                    }}
                />
            );

            expect(html).toContain(
                "notification-toast--item-unlocked"
            );

            expect(html).toContain(
                'class="item-reveal"'
            );

            expect(html).toContain(
                "¡Nuevo objeto conseguido!"
            );

            expect(html).toContain(items[id].name);
            expect(html).toContain(items[id].image);
            expect(html).toContain(items[id].description);
        }
    );
});
