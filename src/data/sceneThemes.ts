import type { ModifierId } from "../types/modifiers";

export type SceneTime = "morning" | "evening" | "night";

export type SceneBackgroundMap = Record<SceneTime, string>;

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
