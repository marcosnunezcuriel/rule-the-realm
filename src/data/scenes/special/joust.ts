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

    layout: {
        aspectRatio: [3, 2],

        visitor: {
            right: 2,
            bottom: 20,
            width: 26,
        },

        dialogue: {
            visitor: {
                left: 57,
                bottom: 60,
                width: 40,
                tailRight: 14,
            },

            monarch: {
                top: 7,
                left: 25,
                tailLeft: 12,
            },
        },
    },
};
