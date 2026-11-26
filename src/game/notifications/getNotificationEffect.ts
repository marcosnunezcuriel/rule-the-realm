import type { GameNotification } from "../../types/notifications";
import type { SoundEffect } from "../../types/audio";

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
        case "anthem-unlocked":
            return "notification-achievement";
    }
}
