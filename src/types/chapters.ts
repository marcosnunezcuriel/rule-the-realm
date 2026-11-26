import type { GameEvent } from "./events";
import type { AchievementDefinition } from "./achievements";

export type ChapterDefinition = {
    number: number;
    title: string;

    firstDay: number;
    lastDay: number;

    endingParagraphs: readonly string[];

    events: readonly GameEvent[];

    achievements: readonly AchievementDefinition[];
};
