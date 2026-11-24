import type { AchievementId } from "../data/achievements";
import type { ModifierId } from "./modifiers";
import type { StatChanges } from "./stats";

export type ModifierChange = "added" | "removed";

export type StatChangeNotification = {
    sequence: number;
    changes: StatChanges;
};

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
    }
    | (StatChangeNotification & {
        kind: "stats";
    });
