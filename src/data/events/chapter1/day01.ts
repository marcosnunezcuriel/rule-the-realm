import type { GameEvent } from "../../../types/events";

export const day01Events: GameEvent[] = [
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

        dialogue: {
            speaker: "Consejera Real",

            introduction: [
                "Majestad. Seré vuestra consejera real y estaré a vuestro servicio mientras ocupéis el trono.",

                "Vuestra coronación ha despertado entusiasmo en todo Astaria.",

                "Los habitantes de la capital esperan celebraciones, banquetes y un torneo. ¿Deseáis celebrarlos?",
            ],

            responses: {
                yes: [
                    "Los festejos comenzarán al amanecer y durarán varios días.",

                    "El pueblo verá con buenos ojos a su nuevo monarca.",
                ],

                no: [
                    "Muchos esperaban algún tipo de celebración.",

                    "Aunque las arcas permanecerán intactas, algunos consideran vuestra decisión demasiado fría para el comienzo de un reinado.",
                ],
            },
        },

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
];
