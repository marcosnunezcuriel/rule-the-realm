import type { SpecialSceneDefinition } from "../../../types/scene";

// Configuración visual del torneo de la coronación.
export const joustScene: SpecialSceneDefinition = {
    backgrounds: {
        king: "/assets/backgrounds/joust-king.png",
        queen: "/assets/backgrounds/joust-queen.png",
    },

    variants: [
        {
            requiredFlags: [
                "brother-is-advisor",
            ],

            backgrounds: {
                king: "/assets/backgrounds/joust-king-2.png",
                queen: "/assets/backgrounds/joust-queen-2.png",
            },
        },
    ],
};
