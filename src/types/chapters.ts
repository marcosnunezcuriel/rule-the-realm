import type { AchievementDefinition } from "./achievements";
import type { GameEvent } from "./events";

export type ChapterDefinition = {
    number: number;
    title: string;

    firstDay: number;
    lastDay: number;

    endingParagraphs: readonly string[];

    events: readonly GameEvent[];

    achievements: readonly AchievementDefinition[];
};
