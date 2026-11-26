import type { MonarchRole } from "./monarch";
import type { StoryFlagId } from "../data/narrative/storyFlags";

export type SceneTime =
    | "morning"
    | "evening"
    | "night";

export type SceneBackgroundMap = Record<SceneTime, string>;

// Fondos disponibles según el protagonista.
export type SpecialSceneBackgrounds =
    Record<MonarchRole, string>;

// Variante visual condicionada por la historia.
export type SpecialSceneVariant = {
    requiredFlags: readonly StoryFlagId[];
    backgrounds: SpecialSceneBackgrounds;
};

// Configuración visual de un escenario especial.
export type SpecialSceneDefinition = {
    backgrounds: SpecialSceneBackgrounds;
    variants?: readonly SpecialSceneVariant[];
};
