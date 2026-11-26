import type {
    Decision,
    DialogueEvent,
} from "./dialogue";

import type { StatChanges } from "./stats";
import type { MonarchRole } from "./monarch";
import type { ModifierId } from "./modifiers";
import type { GameReward } from "./rewards";

import type { StoryFlagId } from "../data/narrative/storyFlags";
import type { SpecialSceneId } from "../data/scenes/specialSceneRegistry";

// Adaptaciones de un acontecimiento según el protagonista.
export type MonarchEventVariant = {
    image?: string;
    speaker?: string;

    replacements?: readonly (
        readonly [string, string]
    )[];
};

export type GameEvent = {
    id: string;
    day: number;
    order: number;
    image: string;
    dialogue: DialogueEvent;

    // Variantes narrativas y visuales según el monarca.
    monarchVariants?: Partial<
        Record<MonarchRole, MonarchEventVariant>
    >;

    // Escenario alternativo en el que se celebra el evento.
    scene?: {
        id: SpecialSceneId;
        placement: "start-of-day";
    };

    // Consecuencias elegidas por el jugador.
    effects?: Record<Decision, StatChanges>;

    // Recompensas permanentes al tomar una decisión.
    rewards?: Partial<Record<Decision, GameReward[]>>;

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

    // Recompensas permanentes al finalizar el acontecimiento.
    rewardsOnComplete?: GameReward[];

    addStoryFlagsOnComplete?: StoryFlagId[];
    removeStoryFlagsOnComplete?: StoryFlagId[];

    addModifiersOnComplete?: ModifierId[];
    removeModifiersOnComplete?: ModifierId[];
};
