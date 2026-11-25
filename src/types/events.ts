import type {
    Decision,
    DialogueEvent,
} from "./dialogue";

import type { StatChanges } from "./stats";
import type { ModifierId } from "./modifiers";
import type { StoryFlagId } from "../data/narrative/storyFlags";

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

    // Desbloqueos de acontecimientos futuros.
    requiresUnlock?: boolean;
    unlocks?: Partial<Record<Decision, string[]>>;

    // Condiciones narrativas de cada decisión.
    addStoryFlags?: Partial<Record<Decision, StoryFlagId[]>>;
    removeStoryFlags?: Partial<Record<Decision, StoryFlagId[]>>;

    // Modificadores activados por cada decisión.
    addModifiers?: Partial<Record<Decision, ModifierId[]>>;

    // Consecuencias al completar el acontecimiento.
    unlocksOnComplete?: string[];

    addStoryFlagsOnComplete?: StoryFlagId[];
    removeStoryFlagsOnComplete?: StoryFlagId[];

    addModifiersOnComplete?: ModifierId[];
    removeModifiersOnComplete?: ModifierId[];
};
