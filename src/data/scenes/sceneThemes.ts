// Define los fondos del salón del trono y los efectos ambientales asociados a modificadores.

import type { ModifierId } from "../../types/modifiers";
import type { SceneBackgroundMap } from "../../types/scene";

type SceneTheme = {
    modifierId: ModifierId;
    backgrounds: SceneBackgroundMap;
};

export const defaultSceneBackgrounds: SceneBackgroundMap = {
    morning: "/assets/backgrounds/background-morning.png",
    evening: "/assets/backgrounds/background-evening.png",
    night: "/assets/backgrounds/background-night.png",
};

export const sceneThemes: SceneTheme[] = [
    {
        modifierId: "traveling-circus",
        backgrounds: {
            morning: "/assets/backgrounds/background-morning-circus.png",
            evening: "/assets/backgrounds/background-evening-circus.png",
            night: "/assets/backgrounds/background-night-circus.png",
        },
    },
];

// Efectos ambientales que cambian inmediatamente
// cuando se activa o desactiva un modificador.
type SceneVisualEffect = {
    modifierId: ModifierId;
    className: string;
};

export const sceneVisualEffects: SceneVisualEffect[] = [
    {
        modifierId: "black-fever",
        className: "throne-stage__visuals--black-fever",
    },
];
