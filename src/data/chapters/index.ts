import { chapter1 } from "./chapter1";

import type { ChapterDefinition } from "../../types/chapters";

export type { ChapterDefinition } from "../../types/chapters";

// Registro global de capítulos disponibles.
export const chapters = [
    chapter1,
] as const satisfies readonly ChapterDefinition[];

export function getChapterForDay(
    day: number
): ChapterDefinition | null {
    return chapters.find((chapter) => {
        return day >= chapter.firstDay && day <= chapter.lastDay;
    }) ?? null;
}

export function getChapterForDisplay(
    day: number
): ChapterDefinition {
    const currentChapter = getChapterForDay(day);

    if (currentChapter !== null) {
        return currentChapter;
    }

    // Si la derrota se anuncia al día siguiente,
    // todavía pertenece al capítulo que ha terminado.
    return [...chapters]
        .reverse()
        .find((chapter) => chapter.lastDay < day) ?? chapters[0];
}

export function getNextChapter(
    currentChapter: ChapterDefinition
): ChapterDefinition | null {
    return chapters.find((chapter) => {
        return (
            chapter.number === currentChapter.number + 1 &&
            chapter.firstDay === currentChapter.lastDay + 1
        );
    }) ?? null;
}

export function toRomanNumber(number: number): string {
    const numerals: Array<[number, string]> = [
        [1000, "M"],
        [900, "CM"],
        [500, "D"],
        [400, "CD"],
        [100, "C"],
        [90, "XC"],
        [50, "L"],
        [40, "XL"],
        [10, "X"],
        [9, "IX"],
        [5, "V"],
        [4, "IV"],
        [1, "I"],
    ];

    let remaining = number;
    let result = "";

    for (const [value, numeral] of numerals) {
        while (remaining >= value) {
            result += numeral;
            remaining -= value;
        }
    }

    return result;
}
