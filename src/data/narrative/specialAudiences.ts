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
// Advertencia al entrar en deuda.
export const treasuryWarningDialogue: DialogueEvent = {
    speaker: "Consejera Real",

    introduction: [
        "Majestad, debo advertiros que las arcas reales han entrado en números negativos.",

        "El reino ha comenzado a acumular deudas y nuestros " +
        "acreedores exigen intereses.",

        "Hasta que recuperemos el tesoro, deberemos pagar " +
        "cinco monedas de oro cada jornada.",

        "Debemos conseguir nuevos ingresos cuanto antes. " +
        "Si llegamos a deber cincuenta monedas de oro, " +
        "el reino entrará en bancarrota.",
    ],
};

// Anuncio de recuperación económica.
export const treasuryRecoveryDialogue: DialogueEvent = {
    speaker: "Consejera Real",

    introduction: [
        "¡Os traigo buenas noticias Majestad!",

        "Hemos saldado nuestras deudas y las arcas reales " +
        "vuelven a llenarse.",

        "Nuestros acreedores han quedado satisfechos. " +
        "Ya no tendremos que pagar cinco monedas de oro " +
        "diarias en intereses.",
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
