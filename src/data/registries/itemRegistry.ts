// Catálogo de los objetos que pueden incorporarse a la colección real.

export const items = {
    "anthem-of-astaria": {
        name: "Himno de Astaria",
        description: "La partitura original del himno oficial de Astaria. Puedes escucharlo desde el panel de sonido.",
        image: "/assets/items/anthem-of-astaria.png",
    },

    "royal-portrait-king": {
        name: "Retrato real del rey",
        description: "El retrato oficial del rey de Astaria, realizado por el pintor de la corte para inmortalizar su reinado.",
        image: "/assets/items/royal-portrait-king.png",
    },

    "royal-portrait-queen": {
        name: "Retrato real de la reina",
        description: "El retrato oficial de la reina de Astaria, realizado por el pintor de la corte para inmortalizar su reinado.",
        image: "/assets/items/royal-portrait-queen.png",
    },

    "white-wolf-fur-rug": {
        name: "Alfombra de piel de lobo",
        description: "Una valiosa alfombra de piel de lobo blanco, obtenida de los furtivos que saqueaban las reservas del duque.",
        image: "/assets/items/white-wolf-fur-rug.png",
    },

    "rough-emerald": {
        name: "Esmeralda en bruto",
        description: "Una esmeralda extraída de las cuevas descubiertas en las montañas del este de Astaria.",
        image: "/assets/items/rough-emerald.png",
    },

    "book-of-eight-virtues": {
        name: "Libro de las Ocho Virtudes",
        description: "Una antigua reliquia sagrada, obsequio del Duque de Bosqueencantado como muestra de lealtad a la Corona.",
        image: "/assets/items/book-of-eight-virtues.png",
    },
} as const;

export type ItemId = keyof typeof items;

// El himno conserva su sistema de desbloqueo musical.
export type ItemRewardId =
    Exclude<ItemId, "anthem-of-astaria">;
