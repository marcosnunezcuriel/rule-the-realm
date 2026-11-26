import { sceneVisualEffects } from "../../data/scenes/sceneThemes";

import type { ModifierId } from "../../types/modifiers";

// Resolver los efectos ambientales activos.
export function getSceneVisualClassName(
    activeModifierIds: readonly ModifierId[]
): string | undefined {
    const classNames = sceneVisualEffects
        .filter((effect) => {
            return activeModifierIds.includes(
                effect.modifierId
            );
        })
        .map((effect) => effect.className);

    return classNames.length > 0
        ? classNames.join(" ")
        : undefined;
}
