import {
    achievements,
    type AchievementId,
} from "../data/achievements";

export const ACHIEVEMENTS_KEY = "rule-the-realm.achievements";

const validIds = new Set<string>(
    achievements.map((achievement) => achievement.id)
);

export function loadUnlockedAchievements(): AchievementId[] {
    try {
        const raw = window.localStorage.getItem(
            ACHIEVEMENTS_KEY
        );

        if (raw === null) {
            return [];
        }

        const parsed: unknown = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
            return [];
        }

        const valid = parsed.filter(
            (id: unknown): id is AchievementId => {
                return (
                    typeof id === "string" &&
                    validIds.has(id)
                );
            }
        );

        return [...new Set(valid)];
    } catch {
        return [];
    }
}

export function unlockAchievement(
    id: AchievementId
): boolean {
    const unlocked = loadUnlockedAchievements();

    if (unlocked.includes(id)) {
        return false;
    }

    try {
        window.localStorage.setItem(
            ACHIEVEMENTS_KEY,
            JSON.stringify([...unlocked, id])
        );

        return true;
    } catch {
        console.warn("No se pudo guardar el logro.");
        return false;
    }
}
