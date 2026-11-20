import type { DialogueEvent } from "../../types/dialogue";
import type { GameOverReason } from "../../types/gameOver";

import { gameOverMessages } from "./gameOverMessages";

// Despedida habitual al terminar las audiencias.
export const closingDialogue: DialogueEvent = {
    speaker: "Consejera Real",

    introduction: [
        "Ya no quedan más audiencias por hoy, Majestad.",
    ],
};

// Advertencia cuando las arcas se agotan.
export const treasuryWarningDialogue: DialogueEvent = {
    speaker: "Consejera Real",

    introduction: [
        "Majestad, las arcas reales se han agotado.",

        "El tesoro de Astaria está vacío y la corona " +
        "ha comenzado a acumular deudas.",

        "Debemos recuperar ingresos cuanto antes. " +
        "Si llegamos a deber cincuenta monedas de oro, " +
        "el reino entrará en bancarrota.",
    ],
};

// Anuncio de una derrota.
export function getDefeatAnnouncementDialogue(
    reason: GameOverReason
): DialogueEvent {
    const message = gameOverMessages[reason];

    return {
        speaker: "Consejera Real",

        introduction: [
            "Majestad, debo comunicaros una noticia terrible.",

            `${message.title}: ${message.announcement}`,

            "Vuestro reinado ha llegado a su fin, Majestad.",
        ],
    };
}
