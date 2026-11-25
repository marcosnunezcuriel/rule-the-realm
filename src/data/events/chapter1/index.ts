import type { GameEvent } from "../../../types/events";

import { day01Events } from "./day01";
import { joustEvent } from "./joust";
import { day02Events } from "./day02";
import { day03Events } from "./day03";
import { day04Events } from "./day04";
import { day05Events } from "./day05";
import { day06Events } from "./day06";
import { day07Events } from "./day07";

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
