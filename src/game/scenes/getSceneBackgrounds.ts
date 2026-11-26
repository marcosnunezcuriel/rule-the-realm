import {
    defaultSceneBackgrounds,
    sceneThemes,
} from "../../data/scenes/sceneThemes";

import type { ModifierId } from "../../types/modifiers";
import type { SceneBackgroundMap } from "../../types/scene";

export function getSceneBackgrounds(
    sceneModifierIds: readonly ModifierId[]
): SceneBackgroundMap {
    const activeTheme = sceneThemes.find((theme) => {
        return sceneModifierIds.includes(theme.modifierId);
    });

    return activeTheme?.backgrounds ?? defaultSceneBackgrounds;
}
