import type { DialogueEvent } from "../types/dialogue";
import { demoDialogue } from "./demoDialogue";

type DemoAudience = {
    id: string;
    image: string;
    dialogue: DialogueEvent;
};

export const demoAudiences: DemoAudience[] = [
    {
        id: "mayordomo",
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
    },
    {
        id: "consejera",
        image: "/assets/characters/courtiers/royal-advisor.png",
        dialogue: demoDialogue,
    },
];

export const closingDialogue: DialogueEvent = {
    speaker: "Consejera Real",

    introduction: [
        "Ya no quedan más audiencias por hoy, Majestad.",
    ],
};
