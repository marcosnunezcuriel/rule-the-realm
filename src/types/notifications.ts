import type { AchievementId } from "../data/achievements";
import type { ModifierId } from "./modifiers";

export type ModifierChange = "added" | "removed";

export type GameNotification =
    | {
        sequence: number;
        kind: "achievement";
        id: AchievementId;
    }
    | {
        sequence: number;
        kind: "modifier-added" | "modifier-removed";
        id: ModifierId;
    };
