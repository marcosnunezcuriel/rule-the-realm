import {
    getChapterForDay,
    getChapterForDisplay,
    getNextChapter,
    toRomanNumber,
} from "../data/chapters";

import { getChapterCompletionAchievements } from "../data/achievements";

import { checkGameOver } from "./checkGameOver";
import { getDayStartTarget } from "./dayFlow";
import { getScreenTransition } from "./screenFlow";

import type { AchievementId } from "../data/achievements";
import type { KingdomValues } from "../types/stats";
import type { SaveGame } from "../types/saveGame";
import type { ScreenTransitionPlan } from "./screenFlow";

// Un capítulo se completa únicamente si el reino
// sobrevive a su último cierre nocturno.
export function hasCompletedChapter(
    day: number,
    stats: KingdomValues
): boolean {
    const chapter = getChapterForDay(day);

    return (
        chapter !== null &&
        day === chapter.lastDay &&
        checkGameOver(stats) === null
    );
}

// Información del capítulo que necesita la interfaz.
export function getChapterPresentation(
    day: number,
    stats: KingdomValues
) {
    const chapter = getChapterForDisplay(day);

    return {
        chapter,

        summaryContinueLabel:
            hasCompletedChapter(day, stats)
                ? `Fin capítulo ${toRomanNumber(chapter.number)}`
                : "Siguiente día",
    };
}

type DayAdvancePlan = {
    transition: ScreenTransitionPlan;
    achievements: AchievementId[];
    resetEndingParagraph: boolean;
};

// Determinar si corresponde comenzar otro día
// o mostrar el epílogo del capítulo.
export function planDayAdvance(
    progress: SaveGame
): DayAdvancePlan | null {
    if (progress.screen !== "summary") {
        return null;
    }

    if (
        hasCompletedChapter(
            progress.day,
            progress.stats
        )
    ) {
        const chapter = getChapterForDisplay(
            progress.day
        );

        return {
            transition: getScreenTransition(
                progress.screen,
                {
                    type: "SET_SCREEN",
                    screen: "chapter-ending",
                }
            ),

            achievements:
                getChapterCompletionAchievements(
                    chapter.number
                ),

            resetEndingParagraph: true,
        };
    }

    return {
        transition: getScreenTransition(
            progress.screen,
            {
                type: "START_DAY",

                target: getDayStartTarget(
                    progress
                ),
            }
        ),

        achievements: [],

        resetEndingParagraph: false,
    };
}

// Comprobar que el próximo capítulo está disponible.
export function planChapterAdvance(
    progress: SaveGame
): ScreenTransitionPlan | null {
    if (progress.screen !== "chapter-ending") {
        return null;
    }

    const chapter = getChapterForDisplay(
        progress.day
    );

    if (getNextChapter(chapter) === null) {
        return null;
    }

    return getScreenTransition(
        progress.screen,
        {
            type: "START_DAY",
            target: "scene",
        }
    );
}
