// Comprueba la selección de sonidos para los distintos avisos.

import { describe, expect, it } from "vitest";

import { getNotificationEffect } from "../../../game/notifications/getNotificationEffect";

describe("Sonidos de notificaciones", () => {
    it("utiliza un sonido para todos los cambios de estadísticas", () => {
        expect(getNotificationEffect({
            sequence: 1,
            kind: "stats",
            changes: {
                gold: 5,
                prestige: -3,
            },
        })).toBe("notification-stats");
    });

    it("distingue modificadores añadidos y eliminados", () => {
        expect(getNotificationEffect({
            sequence: 2,
            kind: "modifier-added",
            id: "traveling-circus",
        })).toBe("notification-modifier-added");

        expect(getNotificationEffect({
            sequence: 3,
            kind: "modifier-removed",
            id: "traveling-circus",
        })).toBe("notification-modifier-removed");
    });

    it("utiliza el sonido de logro para los desbloqueos", () => {
        expect(getNotificationEffect({
            sequence: 4,
            kind: "achievement",
            id: "first-steps",
        })).toBe("notification-achievement");

        expect(getNotificationEffect({
            sequence: 5,
            kind: "item-unlocked",
            id: "anthem-of-astaria",
        })).toBe("notification-achievement");
    });
});
