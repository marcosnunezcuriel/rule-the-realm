import { describe, expect, it } from "vitest";

import { getNotificationEffect } from "../../game/getNotificationEffect";

describe("Sonidos de notificaciones", () => {
    it("utiliza un solo sonido para las estadísticas", () => {
        expect(getNotificationEffect({
            sequence: 1,
            kind: "stats",
            changes: {
                gold: 5,
                prestige: -3,
            },
        })).toBe("notification-stats");
    });

    it("distingue los dos cambios de modificadores", () => {
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

    it("el himno utiliza el sonido de logro", () => {
        expect(getNotificationEffect({
            sequence: 4,
            kind: "anthem-unlocked",
        })).toBe("notification-achievement");
    });
});
