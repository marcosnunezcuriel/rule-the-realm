import type { GameEvent } from "../../../types/events";

export const day07Events: GameEvent[] = [
    {
        id: "6.2",
        day: 7,
        order: 1,
        requiresUnlock: true,

        image: "/assets/characters/commoners/circus-ringmaster.png",

        dialogue: {
            speaker: "Director del circo",

            introduction: [
                "Majestad, vuestra hospitalidad ha sido maravillosa, pero las carpas deben desmontarse.",

                "Nuestros caminos siguen hacia otros reinos, llevándonos los aplausos y los recuerdos de Astaria.",
            ],
        },

        removeModifiersOnComplete: ["traveling-circus"],
    },
];
