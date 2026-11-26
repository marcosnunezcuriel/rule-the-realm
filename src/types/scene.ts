import type { StoryFlagId } from "../data/narrative/storyFlags";

import type { MonarchRole } from "./monarch";

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

// Distribución visual de un escenario especial.
// Las posiciones y anchuras se expresan en porcentajes.
export type SpecialSceneLayout = {
    aspectRatio: readonly [
        width: number,
        height: number,
    ];

    visitor: {
        right: number;
        bottom: number;
        width: number;
    };

    dialogue: {
        visitor: {
            left: number;
            bottom: number;
            width: number;
            tailRight: number;
        };

        monarch: {
            top: number;
            left: number;
            tailLeft: number;
        };
    };
};

// Configuración visual de un escenario especial.
export type SpecialSceneDefinition = {
    backgrounds: SpecialSceneBackgrounds;
    variants?: readonly SpecialSceneVariant[];
    layout: SpecialSceneLayout;
};
