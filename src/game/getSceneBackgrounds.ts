import {
    defaultSceneBackgrounds,
    sceneThemes,
} from "../data/sceneThemes";

import type { SceneBackgroundMap } from "../data/sceneThemes";
import type { ModifierId } from "../types/modifiers";

export function getSceneBackgrounds(
    sceneModifierIds: readonly ModifierId[]
): SceneBackgroundMap {
    const activeTheme = sceneThemes.find((theme) => {
        return sceneModifierIds.includes(theme.modifierId);
    });

    return activeTheme?.backgrounds ?? defaultSceneBackgrounds;
}
