import {
    specialSceneRegistry,
} from "../data/scenes/specialSceneRegistry";

import type {
    SpecialSceneId,
} from "../data/scenes/specialSceneRegistry";

import type { SpecialSceneDefinition } from "../types/scene";
import type { MonarchRole } from "../types/monarch";
import type { StoryFlagId } from "../data/narrative/storyFlags";

// Seleccionar el fondo de un escenario según el
// protagonista y las condiciones narrativas activas.
export function getSpecialScenePresentation(
    id: SpecialSceneId,
    monarch: MonarchRole,
    storyFlags: readonly StoryFlagId[]
) {
    const definition: SpecialSceneDefinition =
        specialSceneRegistry[id];

    const variant = definition.variants?.find(
        (item) => {
            return item.requiredFlags.every(
                (flag) => storyFlags.includes(flag)
            );
        }
    );

    const backgrounds =
        variant?.backgrounds ??
        definition.backgrounds;

    return {
        id,
        background: backgrounds[monarch],
    };
}
