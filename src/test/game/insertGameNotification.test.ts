import { describe, expect, it } from "vitest";

import { insertGameNotification } from "../../game/insertGameNotification";

import type { GameNotification } from "../../types/notifications";

const achievement: GameNotification = {
    sequence: 1,
    kind: "achievement",
    id: "hand-of-king",
};

const modifier: GameNotification = {
    sequence: 2,
    kind: "modifier-added",
    id: "traveling-circus",
};

const stats: GameNotification = {
    sequence: 3,
    kind: "stats",
    changes: {
        gold: -10,
        prestige: 5,
    },
};

const anthem: GameNotification = {
    sequence: 4,
    kind: "anthem-unlocked",
};

describe("Cola de notificaciones", () => {
    it("prioriza estadísticas, modificadores y logros", () => {
        let queue: GameNotification[] = [];

        for (const notification of [
            achievement,
            modifier,
            stats,
        ]) {
            queue = insertGameNotification(
                queue,
                notification,
                null
            );
        }

        expect(queue.map((item) => item.kind)).toEqual([
            "stats",
            "modifier-added",
            "achievement",
        ]);
    });

    it("no interrumpe una notificación visible", () => {
        let queue: GameNotification[] = [achievement];

        queue = insertGameNotification(
            queue,
            modifier,
            achievement.sequence
        );

        queue = insertGameNotification(
            queue,
            stats,
            achievement.sequence
        );

        expect(queue.map((item) => item.kind)).toEqual([
            "achievement",
            "stats",
            "modifier-added",
        ]);
    });

    it("conserva el orden de avisos con igual prioridad", () => {
        const anotherModifier: GameNotification = {
            sequence: 5,
            kind: "modifier-removed",
            id: "traveling-circus",
        };

        let queue: GameNotification[] = [];

        queue = insertGameNotification(
            queue,
            modifier,
            null
        );

        queue = insertGameNotification(
            queue,
            anotherModifier,
            null
        );

        expect(queue.map((item) => item.sequence)).toEqual([
            2,
            5,
        ]);
    });

    it("muestra el himno después de las estadísticas y modificadores", () => {
        let queue: GameNotification[] = [];

        for (const notification of [
            anthem,
            modifier,
            stats,
        ]) {
            queue = insertGameNotification(
                queue,
                notification,
                null
            );
        }

        expect(queue.map((item) => item.kind)).toEqual([
            "stats",
            "modifier-added",
            "anthem-unlocked",
        ]);
    });

    it("mantiene agrupados los cambios de una decisión", () => {
        const queue = insertGameNotification(
            [],
            stats,
            null
        );

        expect(queue).toHaveLength(1);
        expect(queue[0]).toMatchObject({
            kind: "stats",
            changes: {
                gold: -10,
                prestige: 5,
            },
        });
    });
});
