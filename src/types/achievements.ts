import type { Decision } from "./dialogue";

export type AchievementTrigger =
    | {
        type: "decision";
        eventId: string;
        answer: Decision;
    }
    | {
        type: "event-complete";
        eventId: string;
    }
    | {
        type: "chapter-complete";
        chapter: number;
    };

export type AchievementDefinition = {
    id: string;
    name: string;
    description: string;
    trigger: AchievementTrigger;
};