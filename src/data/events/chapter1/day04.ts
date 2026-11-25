import type { GameEvent } from "../../../types/events";

// Capítulo I · día 04. Orden y textos del PDF definitivo.

export const day04Events: GameEvent[] = [
    // Evento 12.1 — Cuevas de esmeraldas descubierta
    {
        id: "12.1",
        day: 4,
        order: 1,
        requiresUnlock: true,
        image: "/assets/characters/commoners/cartographer.png",
        dialogue: {
            speaker: "Cartógrafo",
            introduction: [
                "Majestad, las leyendas eran ciertas.",
                "Hemos descubierto una enorme cueva repleta de esmeraldas.",
                "Podríamos extraer grandes riquezas si establecemos una mina.",
            ],
            responses: {
                yes: [
                    "Comenzaremos las obras inmediatamente.",
                    "Pronto llegarán las primeras piedras preciosas.",
                ],
                no: [
                    "Muchos consideran una locura abandonar una oportunidad así.",
                ],
            },
        },
        baseEffects: { gold: 25 },
        effects: {
            yes: { gold: -50, prestige: 5 },
            no: { prestige: -10 },
        },
        unlocks: {
            yes: ["12.2"],
        },
    },

    // Evento 22.1 — La protesta del altar
    {
        id: "22.1",
        day: 4,
        order: 2,
        requiresUnlock: true,
        image: "/assets/characters/religious/grand-inquisitor.png",
        dialogue: {
            speaker: "Gran Inquisidor",
            introduction: [
                "¡El golem es una abominación, Majestad!",
                "Mis acólitos me informan de que las plegarias de los templos están siendo drenadas por esa monstruosidad de piedra que tenéis en los jardines.",
                "El pueblo empieza a murmurar que adoráis a ídolos paganos en lugar de a la luz verdadera.",
                "¡Ordenad de inmediato que detengan ese ritual arcano!",
            ],
            responses: {
                yes: [
                    "Sabia rectificación, Majestad.",
                    "La luz vuelve a reinar en nuestros templos y el orden sagrado queda restaurado.",
                ],
                no: [
                    "¡Que los cielos se apiaden de vuestra alma, Majestad hereje!",
                    "Habéis elegido la piedra fría por encima de la palabra divina.",
                ],
            },
        },
        effects: {
            yes: { faith: 10, army: -40 },
            no: { faith: -20 },
        },
        unlocks: {
            yes: ["22.2"],
            no: ["22.3"],
        },
    },

    // Evento 23 — El retrato real
    {
        id: "23",
        day: 4,
        order: 3,
        image: "/assets/characters/courtiers/court-painter.png",
        dialogue: {
            speaker: "Pintor de la corte",
            introduction: [
                "¡Majestad! Deberíais inmortalizar vuestro rostro en un lienzo digno de la historia.",
                "Si me concedéis fondos para adquirir pigmentos exóticos y pan de oro, dedicaré mis días a pintar vuestro retrato oficial.",
                "¿Me autorizáis a comenzar la obra?",
            ],
            responses: {
                yes: [
                    "¡No os arrepentiréis, Majestad!",
                    "Trabajaré con devoción hasta capturar cada rasgo de vuestra majestad real.",
                ],
                no: [
                    "Como deseéis, Majestad…",
                    "Aunque es una lástima dejar las paredes de palacio tan desnudas en un reinado tan prometedor.",
                ],
            },
        },
        effects: {
            yes: { gold: -15 },
            no: { prestige: -5 },
        },
        unlocks: {
            yes: ["23.1"],
        },
    },

    // Evento 24 — El himno de Astaria
    {
        id: "24",
        day: 4,
        order: 4,
        image: "/assets/characters/courtiers/court-musician.png",
        dialogue: {
            speaker: "Músico de la corte",
            introduction: [
                "¡Majestad! Acabo de tener una idea que podría pasar a la historia de nuestro reino.",
                "Astaria cuenta con canciones populares, marchas militares y cánticos religiosos, pero...",
                "¿Sabíais que nunca hemos tenido un himno oficial que represente a toda nuestra nación?",
                "Me gustaría componer un himno en honor a Astaria y la Corona de las Estrellas.",
                "Solo necesitaré unas monedas para contratar a los mejores músicos y dedicarme por completo a la composición. ¿Me concedéis vuestro permiso para crear el himno de Astaria?",
            ],
            responses: {
                yes: [
                    "¡Maravilloso, Majestad! ¡Os prometo que será una obra digna de la historia!",
                    "Reuniré a los mejores instrumentistas de la corte y comenzaremos a trabajar de inmediato.",
                ],
                no: [
                    "Qué lástima, Majestad... ¡Ya podía escuchar la melodía resonando por los salones del palacio!",
                    "Guardaré mis partituras para otra ocasión.",
                ],
            },
        },
        effects: {
            yes: { gold: -15 },
            no: { prestige: -5 },
        },
        unlocks: {
            yes: ["24.1"],
        },
    },

    // Evento 25 — El ladrón arrepentido
    {
        id: "25",
        day: 4,
        order: 5,
        image: "/assets/characters/criminals/thief.png",
        dialogue: {
            speaker: "Ladrón",
            introduction: [
                "¡Piedad, Majestad!",
                "Los guardias me atraparon robando en los puestos y el juez ha dictado sentencia.",
                "Mañana al alba me cortarán la mano en la plaza.",
                "Admito mis crímenes y os juro por mi vida que estoy arrepentido.",
                "Si ordenáis que detengan el castigo, os entregaré todo el botín que tengo escondido para compensar mis delitos.",
                "¿Me perdonáis?",
            ],
            responses: {
                yes: [
                    "¡Gracias, Majestad, gracias! Jamás volveré a tocar lo que no es mío.",
                    "Aquí tenéis hasta la última moneda que escondía.",
                ],
                no: [
                    "¡No, por favor, mi mano no...!",
                    "¡Maldita sea vuestra justicia implacable!",
                ],
            },
        },
        effects: {
            yes: { gold: 50, prestige: -5},
            no: { prestige: 3 },
        },
    },

    // Evento 26 — Los establos de la corona
    {
        id: "26",
        day: 4,
        order: 6,
        image: "/assets/characters/army/master-horse.png",
        dialogue: {
            speaker: "Caballerizo mayor",
            introduction: [
                "Majestad, los caballos de los establos reales están agotados y las monturas de nuestros mensajeros ya apenas pueden galopar con presteza hacia las fronteras.",
                "Necesitamos invertir oro para adquirir nuevas y vigorosas bestias con las que asegurar que vuestros decretos lleguen a tiempo a todos los rincones del reino. ¿Nos daréis los fondos?",
            ],
            responses: {
                yes: [
                    "¡Os lo agradezco en nombre de la caballeriza, Majestad! Con estos corceles, ningún mensaje llegará tarde a su destino.",
                ],
                no: [
                    "Como ordenéis, Majestad, pero si un mensajero no llega a tiempo con una mala noticia, la culpa recaerá sobre nuestros pobres caballos.",
                ],
            },
        },
        effects: {
            yes: { gold: -10, prestige: 5, army: 10 },
            no: { army: -5, prestige: -5 },
        }, 
        unlocks: {
            yes: ["26.1"],
        },
    },

    // Evento 27 — Patrullas fronterizas
    {
        id: "27",
        day: 4,
        order: 7,
        image: "/assets/characters/army/commander-royal-guard.png",
        dialogue: {
            speaker: "Comandante de la Guardia Real",
            introduction: [
                "Majestad, los bandidos empiezan a merodear por los caminos secundarios del reino y los viajeros temen ser asaltados.",
                "Si me dais orden de desplegar patrullas permanentes en las fronteras, mantendremos las rutas despejadas, aunque eso fatigará a nuestras tropas. ¿Ordeno el despliegue?",
            ],
            responses: {
                yes: [
                    "¡A vuestras órdenes, Majestad!",
                    "Mis hombres vigilarán cada sendero del reino.",
                ],
                no: [
                    "Como mandéis, Majestad. Mantendremos las tropas descansadas en los cuarteles.",
                    "Aunque los caminos seguirán siendo peligrosos.",
                ],
            },
        },
        effects: {
            yes: { army: -5, population: 20 },
            no: { prestige: -10, population: -20 },
        },
        unlocks: {
            no: ["27.1"],
        },
    },

    // Evento 28 — El cometa carmesí
    {
        id: "28",
        day: 4,
        order: 8,
        image: "/assets/characters/religious/copyist-monk.png",
        dialogue: {
            speaker: "Monje copista",
            introduction: [
                "¡Majestad, disculpad la intromisión!",
                "Mientras transcribía textos antiguos, vi una estrella carmesí surcar el firmamento.",
                "En los textos antiguos esto se interpreta como un presagio de infortunio.",
                "El pueblo ya murmura asustado en las calles.",
                "Si financiáis una ceremonia solemne con incienso y ofrendas en los templos, calmaremos los ánimos y reforzaremos la devoción.",
                "¿Autorizáis el gasto para el ritual?",
            ],
            responses: {
                yes: [
                    "Que la luz de las velas disipe las sombras del cielo, Majestad.",
                    "El pueblo reza agradecido por vuestra piedad.",
                ],
                no: [
                    "Como deseéis, Majestad. Guardaremos el oro en las arcas.",
                    "Aunque muchos temerán que habéis ignorado una señal divina.",
                ],
            },
        },
        effects: {
            yes: { gold: -10, faith: 10 },
            no: { faith: -10 },
        },
    },

];
