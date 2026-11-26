import { chapter1Events } from "./events";
import { chapter1Ending } from "./ending";
import { chapter1Achievements } from "./achievements";

import type { ChapterDefinition } from "../../../types/chapters";

// Definición completa del Capítulo I.
export const chapter1 = {
    number: 1,
    title: "Los primeros días de reinado",

    firstDay: 1,
    lastDay: 7,

    endingParagraphs: chapter1Ending,

    events: chapter1Events,

    achievements: chapter1Achievements,
} satisfies ChapterDefinition;
