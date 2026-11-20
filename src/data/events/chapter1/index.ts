import type { GameEvent } from "../../../types/events";

import { day01Events } from "./day01";
import { day02Events } from "./day02";
import { day07Events } from "./day07";

// Registro de eventos del Capítulo I.
// Añadir aquí los archivos de los nuevos días cuando existan.
export const chapter1Events: GameEvent[] = [
    ...day01Events,
    ...day02Events,
    ...day07Events,
];
