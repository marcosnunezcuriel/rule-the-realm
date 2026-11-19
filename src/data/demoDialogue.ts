import type { DialogueEvent } from "../types/dialogue";

export const demoDialogue: DialogueEvent = {
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
};
