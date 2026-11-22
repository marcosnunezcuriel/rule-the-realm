import type {
    Decision,
    DialogueEvent,
} from "./dialogue";

import type { StatChanges } from "./stats";
import type { ModifierId } from "./modifiers";

export type GameEvent = {
    id: string;
    day: number;
    order: number;
    image: string;
    dialogue: DialogueEvent;

    // Consecuencias elegidas por el jugador.
    effects?: Record<Decision, StatChanges>;

    // Consecuencias comunes a ambas respuestas, o al finalizar
    // un acontecimiento informativo que no pide decisión.
    baseEffects?: StatChanges;

    requiresUnlock?: boolean;
    unlocks?: Partial<Record<Decision, string[]>>;
    addModifiers?: Partial<Record<Decision, ModifierId[]>>;

    // Efectos de cierre que se aplican una vez al salir del evento,
    // independientemente de la respuesta del jugador.
    unlocksOnComplete?: string[];
    addModifiersOnComplete?: ModifierId[];
    removeModifiersOnComplete?: ModifierId[];
};
