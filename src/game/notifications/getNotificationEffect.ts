// Selecciona el efecto de sonido correspondiente a cada notificación.

import type { SoundEffect } from "../../types/audio";
import type { GameNotification } from "../../types/notifications";

export function getNotificationEffect(
    notification: GameNotification
): SoundEffect {
    switch (notification.kind) {
        case "stats":
            return "notification-stats";

        case "modifier-added":
            return "notification-modifier-added";

        case "modifier-removed":
            return "notification-modifier-removed";

        case "achievement":
        case "item-unlocked":
            return "notification-achievement";
    }
}
