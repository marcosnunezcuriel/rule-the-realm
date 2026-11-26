// Reúne todos los acontecimientos normales y especiales del capítulo I.

import { day01Events } from "./day01";
import { day02Events } from "./day02";
import { day03Events } from "./day03";
import { day04Events } from "./day04";
import { day05Events } from "./day05";
import { day06Events } from "./day06";
import { day07Events } from "./day07";
import { joustEvent } from "./joust";

import type { GameEvent } from "../../../../types/events";

export const chapter1Events: GameEvent[] = [
    ...day01Events,
    joustEvent,
    ...day02Events,
    ...day03Events,
    ...day04Events,
    ...day05Events,
    ...day06Events,
    ...day07Events,
];
