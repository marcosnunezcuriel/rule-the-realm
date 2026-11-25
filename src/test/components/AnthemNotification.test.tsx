import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import NotificationToast from "../../components/shared/NotificationToast";

import {
    getEventCompletionAchievements,
} from "../../data/achievements";

import {
    insertGameNotification,
} from "../../game/insertGameNotification";

import type { GameNotification } from "../../types/notifications";

describe("Himno de Astaria", () => {
    it("el evento 24.1 ya no concede logros", () => {
        expect(
            getEventCompletionAchievements("24.1")
        ).toEqual([]);
    });

    it("muestra la notificación especial", () => {
        const html = renderToStaticMarkup(
            <NotificationToast
                notification={{
                    sequence: 9,
                    kind: "anthem-unlocked",
                }}
            />
        );

        expect(html).toContain(
            "Has desbloqueado el Himno de Astaria"
        );

        expect(html).toContain(
            "Consulta el panel de control de sonido."
        );
    });

    it("espera a las estadísticas y modificadores", () => {
        const notifications: GameNotification[] = [
            {
                sequence: 1,
                kind: "anthem-unlocked",
            },
            {
                sequence: 2,
                kind: "modifier-added",
                id: "traveling-circus",
            },
            {
                sequence: 3,
                kind: "stats",
                changes: {
                    prestige: 20,
                },
            },
        ];

        let queue: GameNotification[] = [];

        for (const notification of notifications) {
            queue = insertGameNotification(
                queue,
                notification,
                null
            );
        }

        expect(
            queue.map((item) => item.kind)
        ).toEqual([
            "stats",
            "modifier-added",
            "anthem-unlocked",
        ]);
    });
});
