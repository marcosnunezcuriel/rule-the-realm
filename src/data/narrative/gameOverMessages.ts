import type { GameOverReason } from "../../types/gameOver";
import type { KingdomValues } from "../../types/stats";

type GameOverMessage = {
    title: string;
    stat: keyof KingdomValues;
    announcement: string;
    ending: string;
};

export const gameOverMessages: Record<
    GameOverReason,
    GameOverMessage
> = {
    bankruptcy: {
        title: "Bancarrota",
        stat: "gold",

        announcement:
            "Las arcas de Astaria se han vaciado y la corona " +
            "ya no puede sostener el reino.",

        ending:
            "Las deudas de la corona han superado sus posibilidades. " +
            "Sin recursos para sostener Astaria, " +
            "vuestro tiempo en el trono ha terminado.",
    },

    abandoned: {
        title: "Reino abandonado",
        stat: "population",

        announcement:
            "La población ha desaparecido y Astaria " +
            "se ha convertido en un reino desierto.",

        ending:
            "Las aldeas han quedado vacías y las calles " +
            "de la capital permanecen en silencio. " +
            "Ya no queda pueblo sobre el que reinar.",
    },

    invasion: {
        title: "Invasión",
        stat: "army",

        announcement:
            "Sin ejército para defender sus fronteras, " +
            "Astaria ha caído ante sus enemigos.",

        ending:
            "Los invasores han atravesado las murallas " +
            "y tomado la capital. La Corona de las Estrellas " +
            "ha caído en manos extranjeras.",
    },

    "religious-crisis": {
        title: "Crisis religiosa",
        stat: "faith",

        announcement:
            "La corona ha perdido el apoyo espiritual " +
            "del reino y su autoridad se desmorona.",

        ending:
            "Los templos han cerrado sus puertas a la corona. " +
            "Sin la confianza de los fieles ni el respaldo " +
            "del clero, vuestro reinado ha llegado a su fin.",
    },

    overthrown: {
        title: "Derrocamiento",
        stat: "prestige",

        announcement:
            "La Corona ha perdido su legitimidad y el pueblo " +
            "y los nobles se han alzado contra el trono.",

        ending:
            "Los juramentos de lealtad han sido rotos. " +
            "Las puertas del palacio han caído y Astaria " +
            "tendrá un nuevo gobernante.",
    },
};
