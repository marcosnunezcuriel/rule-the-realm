import type { GameNotification } from "../types/notifications";

function getPriority(
    notification: GameNotification
): number {
    switch (notification.kind) {
        case "stats":
            return 0;

        case "modifier-added":
        case "modifier-removed":
            return 1;

        case "achievement":
        case "anthem-unlocked":
            return 2;
    }
}

export function insertGameNotification(
    queue: GameNotification[],
    incoming: GameNotification,
    displayedSequence: number | null
): GameNotification[] {
    const first = queue[0];

    // No interrumpir la notificación que ya está visible.
    const keepFirst =
        first !== undefined &&
        first.sequence === displayedSequence;

    const waiting = keepFirst
        ? [...queue.slice(1), incoming]
        : [...queue, incoming];

    waiting.sort((a, b) => {
        return (
            getPriority(a) - getPriority(b) ||
            a.sequence - b.sequence
        );
    });

    return keepFirst
        ? [first, ...waiting]
        : waiting;
}
