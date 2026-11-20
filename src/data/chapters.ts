
export type ChapterDefinition = {
    number: number;
    title: string;
    firstDay: number;
    lastDay: number;
    endingParagraphs: readonly string[];
};

export const chapters: ChapterDefinition[] = [
    {
        number: 1,
        title: "Los primeros días de reinado",
        firstDay: 1,
        lastDay: 7,

        endingParagraphs: [
            "Las campanas de la capital ya no repican con la misma ligereza que el primer día de reinado. " +
            "Las decisiones tomadas, los decretos firmados y los caminos elegidos han trazado el destino de Astaria, " +
            "dejando una huella imborrable en las arcas, en las murallas y en el alma del pueblo.",

            "Has gobernado entre la lealtad de tus consejeros y las exigencias de la nobleza, " +
            "respondiendo a las crisis con firmeza o compasión. " +
            "Cada moneda guardada o gastada, cada vida atendida o ignorada, " +
            "ha moldeado un reino que hoy se encuentra al borde de su prueba más dura.",

            "Ahora, mientras la fiebre negra cruza las fronteras y amenaza con devorar cada rincón del reino, " +
            "la corte aguarda en silencio el siguiente paso de su soberano. " +
            "El primer capítulo llega a su fin, Majestad, pero el verdadero juicio de la historia... apenas comienza.",
        ],
    },
];

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
