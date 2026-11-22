import type { GameEvent } from "../../../types/events";

// Capítulo I · día 05. Orden y textos del PDF definitivo.

export const day05Events: GameEvent[] = [
    // Evento 22.2 — El exilio del coloso
    {
        id: "22.2",
        day: 5,
        order: 1,
        requiresUnlock: true,
        image: "/assets/characters/fantasy/stone-golem.png",
        dialogue: {
            speaker: "Golem de piedra",
            introduction: [
                "GRRR... Si el trono desprecia mi protección y me niega la devoción que merezco, no tengo nada que hacer en estos jardines.",
                "Me marcharé a los caminos del norte, donde los hombres valoran la fuerza de la roca por encima de vuestras leyes.",
                "Antes de partir, reclamo las vetas de minerales preciosos que sostienen mi armadura.",
                "¿Me permitís llevarme lo que es mío por derecho?",
            ],
            responses: {
                yes: [
                    "GRRR... Al menos conserváis una pizca de honor al dejarme partir con mis pertenencias.",
                    "No volveréis a saber de mí.",
                ],
                no: [
                    "GRRR... ¿Osáis enviar a vuestros soldados a arrancarme la piedra de la piel?",
                    "¡Me llevaré mis minerales y aplastaré a quienes intenten detenerme!",
                ],
            },
        },
        effects: {
            yes: { faith: 5, prestige: -5, gold: -15 },
            no: { gold: 100, army: -15 },
        },
    },

    // Evento 22.3 — La marcha del coloso
    {
        id: "22.3",
        day: 5,
        order: 2,
        requiresUnlock: true,
        image: "/assets/characters/fantasy/stone-golem.png",
        dialogue: {
            speaker: "Golem de piedra",
            introduction: [
                "GRRR... Has demostrado que tu corona valora la fuerza real por encima de los rezos vacíos.",
                "Mi tiempo en estos jardines ha concluido, los deberes espirituales de la tierra me obligan a marchar a los caminos del norte.",
                "Antes de partir, el calor de mi núcleo arcano y la devoción que me entregaste han cristalizado en las profundidades del palacio para bendecir tu reinado.",
                "Que la piedra te guarde.",
            ],
        },
        baseEffects: { gold: 100, faith: 50 },
    },

    // Evento 29 — El puente derrumbado
    {
        id: "29",
        day: 5,
        order: 3,
        image: "/assets/characters/commoners/builder.png",
        dialogue: {
            speaker: "Constructor",
            introduction: [
                "¡Malas noticias, Majestad!",
                "Las últimas lluvias han debilitado los cimientos del puente de piedra sobre el río principal.",
                "Esta madrugada el arco central se ha venido abajo.",
                "Es la ruta clave por la que entran las mercancías a la capital.",
                "Si me concedéis fondos para contratar cuadrillas y traer piedra de la cantera, lo levantaré de nuevo en tiempo récord.",
                "¿Autorizáis las obras?",
            ],
            responses: {
                yes: [
                    "¡Nos ponemos a ello de inmediato, Majestad!",
                    "En unos días los carros volverán a cruzar sin peligro.",
                ],
                no: [
                    "Como ordenéis, Majestad…",
                    "Pero los mercaderes tendrán que dar un rodeo de días y el comercio de la capital se resentirá.",
                ],
            },
        },
        effects: {
            yes: { gold: -15, prestige: 10, population: 15 },
            no: { prestige: -10, population: -15 },
        },
    },

    // Evento 30 — El invento del molino
    {
        id: "30",
        day: 5,
        order: 4,
        image: "/assets/characters/commoners/inventor.png",
        dialogue: {
            speaker: "Inventor",
            introduction: [
                "¡Majestad, los astros se han alineado en mi mesa de trabajo!",
                "He diseñado un nuevo sistema de aspas angulares y engranajes de hierro que triplica la velocidad de molienda de un molino tradicional.",
                "Si invertís una suma para construir el primer prototipo en las afueras, el rendimiento del grano se disparará.",
                "¿Me concedéis el oro para cambiar la historia del reino?",
            ],
            responses: {
                yes: [
                    "¡No os arrepentiréis, Majestad!",
                    "Veréis maravillas sobre los campos de trigo muy pronto.",
                ],
                no: [
                    "Qué falta de visión…",
                    "Seguiremos moliendo el grano a la antigua usanza, al capricho de la débil brisa.",
                ],
            },
        },
        effects: {
            yes: { gold: -20 },
            no: { prestige: -5 },
        },
        unlocks: {
            yes: ["30.1"],
            no: ["30.2"],
        },
    },

    // Evento 31 — Contrabando en el puerto
    {
        id: "31",
        day: 5,
        order: 5,
        image: "/assets/characters/army/grand-admiral-royal-fleet.png",
        dialogue: {
            speaker: "Gran Almirante de la Flota Real",
            introduction: [
                "Majestad, los informes desde los muelles confirman que los mercantes extranjeros están introduciendo mercancías ilegales sin pagar los aranceles de la corona.",
                "Si ordeno a la guardia portuaria registrar cada bodega a fondo, vaciaremos los alijos de contrabando y llenaremos las arcas reales.",
                "Aunque los mercaderes amenazan con retrasar sus rutas.",
                "¿Autorizo el registro exhaustivo?",
            ],
            responses: {
                yes: [
                    "¡A vuestras órdenes, Majestad!",
                    "No dejaremos un barril sin abrir ni un contrabandista sin multa.",
                    "Aunque los comerciantes extranjeros y estibadores se quejarán de los abusos y retrasos",
                ],
                no: [
                    "Como mandéis, Majestad.",
                    "Dejaremos que los barcos atraquen en paz, aunque la corona seguirá perdiendo los tributos que le corresponden.",
                ],
            },
        },
        effects: {
            yes: { gold: 40, population: -5 },
            no: { prestige: -20 },
        },
    },

    // Evento 32 — La ruta de la seda
    {
        id: "32",
        day: 5,
        order: 6,
        image: "/assets/characters/foreigners/geisha.png",
        dialogue: {
            speaker: "Geisha",
            introduction: [
                "Salud y prosperidad, Majestad.",
                "He cruzado las peligrosas cumbres de las montañas del este en representación del gran Imperio Oriental.",
                "Buscamos abrir una ruta comercial permanente con vuestro reino para intercambiar sedas, especias y conocimientos.",
                "Si aceptáis nuestra alianza comercial, las caravanas traerán riquezas constantes a vuestras puertas.",
                "¿Abriréis los caminos al comercio oriental?",
            ],
            responses: {
                yes: [
                    "¡Que los vientos del este favorezcan nuestros lazos, Majestad!",
                    "Las primeras caravanas ya están en camino.",
                ],
                no: [
                    "Comprendo vuestra cautela, Majestad.",
                    "Buscaremos otros puertos donde comerciar en paz.",
                ],
            },
        },
        effects: {
            yes: {},
            no: {},
        },
        addModifiers: {
            yes: ["silk-road"],
        },
    },

    // Evento 33 — La madera sagrada
    {
        id: "33",
        day: 5,
        order: 7,
        image: "/assets/characters/fantasy/forest-guardian.png",
        dialogue: {
            speaker: "Guardián del bosque",
            introduction: [
                "Saludos, soberano de Astaria. Soy el Guardián del Bosque Encantado y he venido a solicitar vuestra protección.",
                "En lo más profundo de mis dominios se encuentra una arboleda milenaria. Sus árboles han permanecido en pie durante siglos y, bajo sus ramas, generaciones de vuestros súbditos han acudido a rezar a la Estrella de Ocho Puntas.",
                "Pero un grupo de comerciantes ha descubierto el extraordinario valor de su madera y solicita permiso a la corona para talar los árboles y venderlos en los mercados del continente. Os ofrecen una generosa suma de oro a cambio de los derechos de explotación.",
                "Os ruego que no permitáis semejante sacrilegio. Si destináis algunos fondos a proteger la arboleda, podremos preservar este lugar sagrado para las generaciones venideras.",
                "¿Qué decidís, Majestad? ¿Protegeréis los árboles sagrados?",
            ],
            responses: {
                yes: [
                    "Habéis tomado una sabia decisión, Majestad.",
                    "Con vuestra ayuda, mis guardianes vigilarán la arboleda y ningún mercader podrá acercar un hacha a sus árboles.",
                    "Los fieles de Astaria recordarán que su rey protegió uno de los lugares más sagrados del reino.",
                ],
                no: [
                    "Comprendo vuestra decisión, Majestad, pero temo que el oro no podrá reemplazar lo que estamos a punto de perder.",
                    "Los comerciantes comenzarán la tala y entregarán a la corona la suma prometida.",
                    "Que la Estrella de Ocho Puntas nos perdone por las heridas que sufrirá el bosque.",
                ],
            },
        },
        effects: {
            yes: { gold: -10, faith: 5, prestige: 5 },
            no: { gold: 20, faith: -10 },
        },
    },

    // Evento 34 — El profeta de la plaga
    {
        id: "34",
        day: 5,
        order: 8,
        image: "/assets/characters/religious/street-prophet.png",
        dialogue: {
            speaker: "Profeta callejero",
            introduction: [
                "¡Arrepentíos, pecadores!",
                "¡El cielo se oscurecerá y una plaga terrible barrerá este reino de vicios!",
                "¡La peste se acerca y vuestros días están contados!",
                "Exijo que decretéis un ayuno obligatorio y limpiéis las calles de vicios antes de que sea demasiado tarde.",
                "¿Ordenáis cumplir con la penitencia que predigo?",
            ],
            responses: {
                yes: [
                    "¡Has escuchado la voz del cielo, Majestad!",
                ],
                no: [
                    "¡Necio!",
                    "¡Rechazáis la advertencia y pronto veréis pudrirse los campos y las casas!",
                ],
            },
        },
        effects: {
            yes: { faith: -15, population: -15, prestige: -15 },
            no: { faith: 15, prestige: 15 },
        },
    },

];
