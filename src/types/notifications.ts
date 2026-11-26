import type { AchievementId } from "../data/registries/achievementRegistry";
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
    | {
        sequence: number;
        kind: "anthem-unlocked";
    }
    | (StatChangeNotification & {
        kind: "stats";
    });
