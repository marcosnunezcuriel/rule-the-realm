import type { GameEvent } from "../types/events";
import type { DialogueEvent } from "../types/dialogue";

import { demoDialogue } from "./demoDialogue";

export const demoAudiences: GameEvent[] = [
    {
        id: "1",
        day: 1,
        order: 1,

        image: "/assets/characters/courtiers/butler.png",

        dialogue: {
            speaker: "Mayordomo",

            introduction: [
                "Buenos días, Majestad. Seré vuestro humilde mayordomo y me encargaré de que la corte funcione como un reloj.",

                "El antiguo rey dejó los aposentos reales bastante descuidados y el personal es escaso.",

                "¿Debo contratar más servidumbre para recibir dignamente a vuestros invitados?",
            ],

            responses: {
                yes: [
                    "¡Excelente decisión! El castillo brillará como el oro.",

                    "Los nobles notarán al instante la majestuosidad de vuestra corte.",
                ],

                no: [
                    "Como ordenéis, Majestad. Nos apañaremos con lo que tenemos.",

                    "Al menos ahorraremos unas cuantas monedas de oro para asuntos más urgentes.",
                ],
            },
        },

        effects: {
            yes: {
                gold: -10,
                prestige: 5,
            },

            no: {
                prestige: -5,
            },
        },
    },

    {
        id: "2",
        day: 1,
        order: 2,

        image: "/assets/characters/courtiers/royal-advisor.png",

        dialogue: demoDialogue,

        effects: {
            yes: {
                gold: -20,
                prestige: 5,
            },

            no: {
                prestige: -10,
            },
        },

        unlocks: {
            yes: ["2.1", "2.2"],
        },
    },

    {
        id: "2.1",
        day: 2,
        order: 1,
        requiresUnlock: true,

        image: "/assets/characters/commoners/tavern-keeper.png",

        dialogue: {
            speaker: "Tabernera",

            introduction: [
                "¡Majestad, una desgracia! Con los festejos de la coronación, mi taberna en el cruce se convirtió en un campo de batalla.",

                "Los ánimos se caldearon, rompieron todo el mobiliario y los malhechores escaparon.",

                "Exijo una compensación por los destrozos y que la guardia persiga a los culpables.",
            ],

            responses: {
                yes: [
                    "Gracias por los fondos para reparar mi local…",

                    "… y por enviar las patrullas para capturar a los vándalos.",
                ],

                no: [
                    "¿No os importa vuestro pueblo?",
                ],
            },
        },

        effects: {
            yes: {
                gold: -3,
                prestige: 5,
            },

            no: {
                prestige: -5,
            },
        },
    },

    {
        id: "2.2",
        day: 2,
        order: 2,
        requiresUnlock: true,

        image: "/assets/characters/commoners/knight-champion.png",

        dialogue: {
            speaker: "Caballero campeón",

            introduction: [
                "¡Salud, soberano! Fui yo quien alzó la espada victorioso en el gran torneo de la coronación.",

                "La gloria está muy bien, pero la sangre derramada y el esfuerzo merecen una recompensa real.",

                "Exijo la bolsa de oro prometida al campeón.",
            ],

            responses: {
                yes: [
                    "Juro lealtad eterna a vuestra espada y me uno humildemente a vuestras filas.",
                ],

                no: [
                    "¿Me negáis el oro que gané con sudor y acero?",

                    "¡Esto es una afrenta imperdonable para un caballero!",

                    "Me voy de vuestra corte con mis hombres. Buscaos a otros héroes que os salven el pellejo.",
                ],
            },
        },

        effects: {
            yes: {
                gold: -15,
                army: 10,
            },

            no: {
                army: -10,
            },
        },
    },
];

export const closingDialogue: DialogueEvent = {
    speaker: "Consejera Real",

    introduction: [
        "Ya no quedan más audiencias por hoy, Majestad.",
    ],
};
