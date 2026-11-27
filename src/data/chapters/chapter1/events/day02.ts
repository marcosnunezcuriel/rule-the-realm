import type { GameEvent } from "../../../../types/events";

// Capítulo I · día 02. Acontecimientos, decisiones y consecuencias.

export const day02Events: GameEvent[] = [
    // Evento 3.1 — Pelea en la taberna
    {
        id: "3.1",
        day: 2,
        order: 2,
        requiresUnlock: true,
        image: "/assets/characters/commoners/tavern-keeper.png",
        dialogue: {
            speaker: "Tabernera",
            introduction: [
                "Mi señor, una desgracia! Con los miles de visitantes que han llegado a la capital, mi taberna en el cruce se convirtió en un campo de batalla.",
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
            yes: { gold: -3, prestige: 5 },
            no: { prestige: -5 },
        },
    },

    // Evento 11 — Ha llegado el circo
    {
        id: "11",
        day: 2,
        order: 3,
        image: "/assets/characters/courtiers/royal-advisor.png",
        dialogue: {
            speaker: "Consejera Real",
            introduction: [
                "Mi señor, os traigo noticias alegres desde las puertas de la capital.",
                "Un gran circo ambulante ha instalado sus coloridas carpas en las afueras.",
                "Su director solicita permiso para actuar ante el pueblo y los nobles. ¿Permitimos que ofrezcan sus espectáculos?",
            ],
            responses: {
                yes: [
                    "¡Una excelente elección, Majestad! Las funciones han comenzado y el dinero entra a raudales en las arcas gracias a las entradas.",
                    "Además, he oído que un juglar del circo está tan inspirado que quiere actuar directamente en la plaza mayor.",
                ],
                no: [
                    "Como deseéis. He ordenado a la guardia que rechace a los artistas.",
                    "Las calles seguirán tranquilas, aunque el pueblo se ha quedado con ganas de un poco de diversión.",
                ],
            },
        },
        effects: {
            yes: { gold: 20 },
            no: { prestige: -3 },
        },
        unlocks: {
            yes: ["11.1", "11.2"],
        },
        addModifiers: {
            yes: ["traveling-circus"],
        },
    },

    // Evento 12 — Exploración de las montañas del este
    {
        id: "12",
        day: 2,
        order: 4,
        image: "/assets/characters/commoners/cartographer.png",
        dialogue: {
            speaker: "Cartógrafo",
            introduction: [
                "Mi señor, durante mis viajes he oído historias sobre las montañas del este.",
                "Las leyendas hablan de riquezas ocultas entre sus cuevas y barrancos.",
                "Necesitaré financiación para organizar una expedición. ¿Deseáis apoyarla?",
            ],
            responses: {
                yes: [
                    "Reuniré a mis mejores hombres y partiremos cuanto antes.",
                    "Esperemos que las leyendas sean ciertas…",
                ],
                no: [
                    "Comprendo vuestra decisión, Majestad.",
                    "Las montañas permanecerán inexploradas.",
                ],
            },
        },
        effects: {
            yes: { gold: -30, prestige: 1 },
            no: { prestige: -3 },
        },
        unlocks: {
            yes: ["12.1"],
        },
    },

    // Evento 13 — El mendigo pide limosna
    {
        id: "13",
        day: 2,
        order: 5,
        image: "/assets/characters/commoners/beggar.png",
        dialogue: {
            speaker: "Mendigo",
            introduction: [
                "¡Piedad, mi señor! Llevo días sin probar bocado y el frío de las calles cala hasta los huesos.",
                "¿Podríais concederle unas pocas monedas a este humilde súbdito para comprar algo de pan?",
            ],
            responses: {
                yes: [
                    "¡Que los cielos os bendigan, Majestad! Jamás olvidaré vuestra generosidad.",
                ],
                no: [
                    "Entiendo... gobernar un reino debe de ser más importante que la miseria de un pobre viejo.",
                ],
            },
        },
        effects: {
            yes: { gold: -1, prestige: 3 },
            no: { prestige: -3 },
        },
        unlocks: {
            yes: ["13.1"],
        },
    },

    // Evento 14 — El recaudador ofrece aumentar los impuestos
    {
        id: "14",
        day: 2,
        order: 6,
        image: "/assets/characters/courtiers/tax-collector.png",
        dialogue: {
            speaker: "Recaudador de impuestos",
            introduction: [
                "Mi señor, las arcas reales necesitan un respiro. He preparado un nuevo decreto fiscal.",
                "Si endurecemos los cobros y aumentamos los impuestos a los comerciantes y al pueblo, ingresaremos mucho más oro de inmediato.",
                "¿Deseáis que aplique esta nueva medida de recaudación?",
            ],
            responses: {
                yes: [
                    "¡Una decisión muy acertada para el tesoro de la corona, Majestad!",
                    "Las arcas se llenarán rápidamente, aunque veremos caras muy largas en el mercado.",
                ],
                no: [
                    "Como mandéis, Majestad. Dejaremos las tasas como están por ahora.",
                ],
            },
        },
        effects: {
            yes: {},
            no: { prestige: 5 },
        },
        unlocks: {
            yes: ["14.1"],
        },
        addModifiers: {
            yes: ["high-taxes"],
        },
    },

    // Evento 15 — La crisis del trigo
    {
        id: "15",
        day: 2,
        order: 7,
        image: "/assets/characters/commoners/baker.png",
        dialogue: {
            speaker: "Panadero",
            introduction: [
                "Mi señor, el precio del grano en los mercados se ha disparado por la nubes.",
                "El pueblo apenas puede permitirse comprar una simple hogaza de pan.",
                "¿Os dignaríais a subvencionar el precio del trigo para aliviar nuestra hambre?",
            ],
            responses: {
                yes: [
                    "¡Vuestra generosidad es inmensa, Majestad!",
                    "Las familias podrán alimentarse con tranquilidad este mes.",
                ],
                no: [
                    "Comprendo… Las arcas reales son sagradas.",
                    "El hambre en las calles empieza a volverse peligrosa.",
                ],
            },
        },
        effects: {
            yes: { gold: -15, prestige: 5 },
            no: { prestige: -5 },
        },
        unlocks: {
            yes: ["15.1"],
            no: ["15.2"],
        },
    },

    // Evento 16 — Los primeros decretos de la corona
    {
        id: "16",
        day: 2,
        order: 8,
        image: "/assets/characters/courtiers/royal-herald.png",
        dialogue: {
            speaker: "Heraldo Real",
            introduction: [
                "¡Majestad! Vuestro reinado ha comenzado y los primeros decretos de la corona ya han sido proclamados en la capital.",
                "Sin embargo, Astaria es un reino extenso. En las aldeas más alejadas, muchos campesinos todavía desconocen las órdenes de su nuevo rey.",
                "Si me concedéis fondos para contratar mensajeros y escribas, enviaremos copias de vuestros decretos a todos los rincones del reino.",
                "Así, hasta el más humilde de vuestros súbditos conocerá vuestras leyes y voluntad.",
                "¿Autorizáis su distribución?",
            ],
            responses: {
                yes: [
                    "¡Excelente decisión, Majestad! ¡Así se hará!",
                    "Los escribas comenzarán a trabajar de inmediato y los mensajeros partirán hacia todas las provincias.",
                    "Pronto no habrá una sola aldea en Astaria que desconozca vuestra autoridad.",
                ],
                no: [
                    "Como ordenéis, Majestad. Nos limitaremos a proclamar vuestros decretos en la capital.",
                    "Aunque me temo que muchos súbditos seguirán sin conocer vuestras órdenes y algunos señores locales podrían aprovecharse de ello.",
                ],
            },
        },
        effects: {
            yes: { gold: -10, prestige: 15 },
            no: { prestige: -10 },
        },
    },

];
