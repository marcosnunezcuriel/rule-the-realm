import type { GameEvent } from "../../../types/events";

// Capítulo I · día 06. Orden y textos del PDF definitivo.

export const day06Events: GameEvent[] = [
    // Evento 35 — Los barcos en la tormenta
    {
        id: "35",
        day: 6,
        order: 1,
        image: "/assets/characters/commoners/fisherman.png",
        dialogue: {
            speaker: "Pescador",
            introduction: [
                "¡Majestad, necesitamos vuestra ayuda!",
                "Anoche, una terrible tormenta azotó la Ciudad Portuaria. Las olas destrozaron nuestros aparejos y varias embarcaciones pesqueras quedaron a la deriva, lejos del puerto.",
                "Algunos barcos han conseguido regresar, pero todavía quedan muchos compañeros desaparecidos.",
                "Sus familias llevan toda la mañana esperando noticias en los muelles.",
                "Los marineros más experimentados estamos dispuestos a salir en su busca, pero necesitamos fondos para preparar embarcaciones de rescate, conseguir provisiones y contratar tripulaciones. Los vientos están empeorando y, si no partimos antes del anochecer, temo que sea demasiado tarde.",
                "¿Nos concederéis los recursos necesarios para organizar el rescate?",
            ],
            responses: {
                yes: [
                    "¡Gracias, Majestad! ¡No perderemos ni un instante!",
                    "Reuniremos a los mejores marineros y zarparemos de inmediato.",
                    "Gracias a vuestra ayuda, numerosas embarcaciones conseguirán regresar a puerto y las familias recibirán con alegría a sus seres queridos.",
                ],
                no: [
                    "Comprendo, Majestad... Pero esos hombres tienen familias que los esperan.",
                    "Intentaremos rescatarlos con los pocos medios de los que disponemos.",
                    "Las horas pasan y muchos pescadores no consiguen regresar. La costa entera llora a sus desaparecidos.",
                ],
            },
        },
        effects: {
            yes: { gold: -15, population: 10, prestige: 5 },
            no: { population: -15, prestige: -15 },
        },
    },

    // Evento 12.2 — Explosión en la mina
    {
        id: "12.2",
        day: 6,
        order: 2,
        requiresUnlock: true,
        image: "/assets/characters/commoners/miner.png",
        dialogue: {
            speaker: "Minero",
            introduction: [
                "Majestad, ha ocurrido una tragedia.",
                "Una explosión ha provocado el derrumbe de parte de la mina.",
                "Varios trabajadores han perdido la vida.",
                "Los supervisores recomiendan cerrarla.",
            ],
            responses: {
                yes: [
                    "La mina será cerrada inmediatamente.",
                    "No se producirán más accidentes.",
                ],
                no: [
                    "Los trabajos continuarán.",
                    "Esperemos que no vuelva a suceder.",
                ],
            },
        },
        baseEffects: { population: -10 },
        effects: {
            yes: { prestige: 5 },
            no: { prestige: -15 },
        },
        unlocks: {
            no: ["12.3"],
        },
    },

    // Evento 23.1 — El retrato terminado
    {
        id: "23.1",
        day: 6,
        order: 3,
        requiresUnlock: true,
        image: "/assets/characters/courtiers/court-painter.png",
        dialogue: {
            speaker: "Pintor de la corte",
            introduction: [
                "¡Por fin está terminado, Majestad! Contemplad vuestro retrato oficial.",
                "Los nobles murmurarán maravillados y los embajadores extranjeros inclinarán la cabeza con respeto ante el lienzo.",
                "La obra ya preside el salón principal del castillo para gloria eterna de vuestra corona.",
            ],
        },
        baseEffects: { prestige: 20 },
    },

    // Evento 24.1 — El himno de Astaria está listo
    {
        id: "24.1",
        day: 6,
        order: 4,
        requiresUnlock: true,
        image: "/assets/characters/courtiers/court-musician.png",
        dialogue: {
            speaker: "Músico de la corte",
            introduction: [
                "¡Majestad! ¡Por fin está terminado!",
                "Durante estos días, los músicos de la corte y yo hemos trabajado sin descanso para componer una melodía digna de nuestro reino.",
                "Hemos reunido instrumentos de todas las provincias de Astaria y creado una obra que, estoy seguro, emocionará tanto a los nobles como al más humilde de los campesinos.",
                "Los músicos ya han ensayado la composición y están preparados para interpretarla cuando le plazca.",
            ],
        },
        baseEffects: { prestige: 20 },
    },

    // Evento 27.1 — La purga de bandidos
    {
        id: "27.1",
        day: 6,
        order: 5,
        requiresUnlock: true,
        image: "/assets/characters/criminals/bounty-hunter.png",
        dialogue: {
            speaker: "Cazarrecompensas",
            introduction: [
                "Majestad, vuestros caminos son un nido de alimañas desde que decidisteis no enviar a la guardia.",
                "Los viajeros están desamparados, pero yo no trabajo por honor, sino por monedas.",
                "Si me pagáis una buena prima y me dais vía libre, limpiaré cada sendero de bandidos. ¿Aceptáis mi trato?",
            ],
            responses: {
                yes: [
                    "Trato hecho, Majestad. No tardaréis en oír hablar de mis trofeos en los caminos.",
                ],
                no: [
                    "Una pena…",
                    "Espero que vuestros súbditos tengan mejor suerte cruzando el reino por su propia cuenta.",
                ],
            },
        },
        effects: {
            yes: { prestige: -10, population: 20 },
            no: { population: -10 },
        },
    },

    // Evento 36 — La caravana de la arena
    {
        id: "36",
        day: 6,
        order: 6,
        image: "/assets/characters/foreigners/grand-vizier.png",
        dialogue: {
            speaker: "Primer visir",
            introduction: [
                "Soy el primer visir de un pueblo que ha visto su hogar devorado por la guerra y la arena abrasadora.",
                "Hemos cruzado los yermos para buscar vuestro amparo.",
                "Suplicamos que abráis las puertas de vuestro reino y permitáis a nuestra gente asentarse en vuestras tierras a cambio de nuestra lealtad y trabajo.",
                "¿Nos concedéis asilo?",
            ],
            responses: {
                yes: [
                    "Que las estrellas bendigan vuestra infinita compasión, Majestad.",
                    "Jamás olvidaremos esta mano tendida.",
                ],
                no: [
                    "¡Qué crueldad... Nos condenáis a perecer bajo el sol del desierto!",
                    "Que la historia juzgue vuestra dureza.",
                ],
            },
        },
        effects: {
            yes: { population: 50, gold: -5, prestige: -5 },
            no: { prestige: 5 },
        },
        unlocks: {
            yes: ["36.1"],
            no: ["36.2"],
        },
    },

    // Evento 37 — Furtivos en el bosque
    {
        id: "37",
        day: 6,
        order: 7,
        image: "/assets/characters/criminals/poacher.png",
        dialogue: {
            speaker: "Cazador furtivo",
            introduction: [
                "Shhh... Bajad la voz, Majestad.",
                "Mis hombres y yo llevamos semanas cazando en las reservas privadas del duque.",
                "Tenemos pieles de lobo blanco y ciervos que valen una fortuna en el mercado negro.",
                "Si hacéis la vista gorda y ordenáis a vuestros guardias que no patrullen esa zona, una gran parte de este cargamento será para la corona.",
                "¿Aceptáis mirar a otro lado a cambio de las pieles?",
            ],
            responses: {
                yes: [
                    "Sabía que Vuestra Majestad entendería cuándo conviene cerrar los ojos.",
                    "Aquí tenéis vuestra parte del botín.",
                ],
                no: [
                    "¡Maldita sea vuestra honradez!",
                ],
            },
        },
        effects: {
            yes: { gold: 15 },
            no: {},
        },
        unlocks: {
            no: ["37.1"],
        },
    },

    // Evento 38 — La maldición del espejo
    {
        id: "38",
        day: 6,
        order: 8,
        image: "/assets/characters/fantasy/witch.png",
        dialogue: {
            speaker: "Bruja",
            introduction: [
                "Majestad, una sombra fría se cierne sobre vuestros aposentos.",
                "Un espejo de plata en la torre norte ha sido maldecido con magia negra.",
                "Envenenará el juicio de quien se refleje en él.",
                "Puedo romper el hechizo ahora mismo con mis ungüentos y conjuros.",
                "¿Me permitís entrar en el castillo y romper la maldición?",
            ],
            responses: {
                yes: [
                    "¡El cristal se ha hecho trizas y la sombra se desvanece, Majestad!",
                    "Vuestra mente y vuestro hogar vuelven a estar a salvo.",
                ],
                no: [
                    "¡Necio! El reflejo os susurrará mentiras desde la oscuridad.",
                ],
            },
        },
        effects: {
            yes: { faith: -10, prestige: 10 },
            no: { faith: 10, prestige: -10 },
        },
    },

    // Evento 39 — Las langostas
    {
        id: "39",
        day: 6,
        order: 9,
        image: "/assets/characters/commoners/falconer.png",
        dialogue: {
            speaker: "Cetrero",
            introduction: [
                "¡Majestad, las ratas y las plagas de langostas están devorando las reservas de grano de los silos reales!",
                "Dame un presupuesto para criar y adiestrar a una nueva estirpe de halcones y águilas imperiales.",
                "Mantendré los cielos limpios y las despensas a salvo de alimañas.",
                "¿Me financiáis el halconero real?",
            ],
            responses: {
                yes: [
                    "¡Volarán alto y rápido, Majestad!",
                    "No quedará una sola plaga cerca de los graneros.",
                ],
                no: [
                    "Como mandéis, Majestad…",
                    "Las ratas seguirán festejando a sus anchas en las despensas.",
                ],
            },
        },
        effects: {
            yes: { gold: -10, population: 10, prestige: 5 },
            no: { population: -5, prestige: -5 },
        },
    },

    // Evento 40 — Cuarentena en el puerto
    {
        id: "40",
        day: 6,
        order: 10,
        image: "/assets/characters/army/grand-admiral-royal-fleet.png",
        dialogue: {
            speaker: "Gran Almirante de la Flota Real",
            introduction: [
                "Majestad, acaba de atracar una galera mercante con la mitad de su tripulación delirando por una fiebre oscura que jamás había visto en alta mar.",
                "Si sello el puerto y pongo todos los muelles en cuarentena estricta, frenaremos el contagio a tiempo.",
                "Aunque perderemos una fortuna en aranceles y mercancías pudriéndose en las bodegas.",
                "¿Ordenáis cerrar el puerto?",
            ],
            responses: {
                yes: [
                    "¡De inmediato, Majestad!",
                    "Nadie entrará ni saldrá de los muelles hasta que pase el peligro.",
                ],
                no: [
                    "Como ordenéis, Majestad. El oro seguirá fluyendo hoy hacia el tesoro.",
                    "Aunque ruego a los dioses que no hayamos abierto las puertas a la muerte.",
                ],
            },
        },
        effects: {
            yes: { gold: -25, prestige: 5 },
            no: { population: -25, prestige: -5, gold: 5 },
        },
    },

];
