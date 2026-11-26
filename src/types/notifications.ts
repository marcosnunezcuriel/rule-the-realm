// Define los avisos generados por las acciones y consecuencias del juego.

import type { AchievementId } from "../data/registries/achievementRegistry";
import type { ItemId } from "../data/registries/itemRegistry";

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
        kind: "item-unlocked";
        id: ItemId;
    }
    | (StatChangeNotification & {
        kind: "stats";
    });
