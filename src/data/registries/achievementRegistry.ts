import type { Decision } from "../../types/dialogue";

import { chapters } from "../chapters";

// Inferir los logros registrados en todos los capítulos.
type RegisteredAchievement =
    (typeof chapters)[number]["achievements"][number];

// Registro global de logros.
export const achievements = chapters.flatMap<
    RegisteredAchievement
>(
    (chapter) => chapter.achievements
);

export type AchievementId =
    RegisteredAchievement["id"];

export function getDecisionAchievements(
    eventId: string,
    answer: Decision
): AchievementId[] {
    return achievements
        .filter((achievement) => {
            const trigger = achievement.trigger;

            return (
                trigger.type === "decision" &&
                trigger.eventId === eventId &&
                trigger.answer === answer
            );
        })
        .map((achievement) => achievement.id);
}

export function getEventCompletionAchievements(
    eventId: string
): AchievementId[] {
    return achievements
        .filter((achievement) => {
            const trigger = achievement.trigger;

            return (
                trigger.type === "event-complete" &&
                trigger.eventId === eventId
            );
        })
        .map((achievement) => achievement.id);
}

export function getChapterCompletionAchievements(
    chapter: number
): AchievementId[] {
    return achievements
        .filter((achievement) => {
            const trigger = achievement.trigger;

            return (
                trigger.type === "chapter-complete" &&
                trigger.chapter === chapter
            );
        })
        .map((achievement) => achievement.id);
}
