import type { GameEvent } from "../../../../types/events";

// Capítulo I · día 03. Acontecimientos, decisiones y consecuencias.

export const day03Events: GameEvent[] = [
    // Evento 11.1 — El juglar quiere actuar en la plaza mayor
    {
        id: "11.1",
        day: 3,
        order: 1,
        requiresUnlock: true,
        image: "/assets/characters/commoners/minstrel.png",
        dialogue: {
            speaker: "Juglar",
            introduction: [
                "¡Salve, oh magnífico rey de Astaria! El circo ha llenado las calles de música y alegría.",
                "Mi laúd arde con ganas de cantar vuestras glorias.",
                "Me gustaría montar un escenario en el centro de la plaza mayor para entretener al pueblo con rimas y malabares. ¿Me concedéis vuestro real permiso para actuar?",
            ],
            responses: {
                yes: [
                    "¡Mil gracias, Majestad! Mis canciones harán que hasta el campesino más cansado sonría y hable maravillas de vuestra generosidad.",
                    "¡Que empiece la función!",
                ],
                no: [
                    "Oh... qué silencio más triste para un humilde artista. Guardaré mi laúd en su funda.",
                    "El pueblo se quedará sin escuchar mis baladas hoy.",
                    "Me marcho con la música a otra parte.",
                ],
            },
        },
        effects: {
            yes: { gold: -5, prestige: 10 },
            no: { prestige: -5 },
        },
    },

    // Evento 15.1 — La queja del grano
    {
        id: "15.1",
        day: 3,
        order: 2,
        requiresUnlock: true,
        image: "/assets/characters/nobles/count-wheatfield.png",
        dialogue: {
            speaker: "Conde de Campotrigo",
            introduction: [
                "¡Esto es una ruina y una afrenta para los productores de trigo!",
                "Al obligar a bajar los precios del trigo habéis destrozado los beneficios de mis tierras.",
                "Exijo una compensación económica inmediata que cubra las pérdidas de mis arrendatarios.",
            ],
            responses: {
                yes: [
                    "Agradezco vuestra sensatez al compensar nuestras pérdidas, mi señor.",
                    "Así se mantiene la paz en los campos.",
                ],
                no: [
                    "¿Nos dais la espalda de esta manera, …",
                    "prefiriendo el populacho a vuestros señores?",
                    "Los terratenientes no olvidaremos esta injusticia con facilidad.",
                ],
            },
        },
        effects: {
            yes: { gold: -20 },
            no: { prestige: -10, army: -5 },
        },
    },

    // Evento 15.2 — El agradecimiento del grano
    {
        id: "15.2",
        day: 3,
        order: 3,
        requiresUnlock: true,
        image: "/assets/characters/nobles/count-wheatfield.png",
        dialogue: {
            speaker: "Conde de Campotrigo",
            introduction: [
                "Mi señor, os muestro mi más profundo agradecimiento por el apoyo en la crisis del grano.",
                "Habéis demostrado mano dura y respeto por los grandes señores.",
                "Mis tierras os envían un cargamento extra de suministros.",
            ],
        },
        baseEffects: { gold: 15, army: 5 },
    },

    // Evento 17 — Pozos contaminados
    {
        id: "17",
        day: 3,
        order: 4,
        image: "/assets/characters/commoners/apothecary.png",
        dialogue: {
            speaker: "Boticaria",
            introduction: [
                "Mi señor, os traigo noticias alarmantes.",
                "Los pozos de agua de la capital muestran graves indicios de contaminación y las primeras personas ya están enfermando.",
                "Necesito urgentemente fondos del tesoro real para purificar el agua y evitar que la infección se extienda por toda la ciudad.",
                "¿Me concederéis el oro necesario?",
            ],
            responses: {
                yes: [
                    "¡Que los cielos os bendigan, Majestad!",
                    "Pondré a mis aprendices a purificar cada gota de agua de inmediato.",
                ],
                no: [
                    "Es una decisión arriesgada…",
                    "Si el agua sigue así, la enfermedad no tardará en convertirse en una plaga en las calles.",
                ],
            },
        },
        effects: {
            yes: { gold: -10, prestige: 5 },
            no: { population: -20, prestige: -5 },
        },
    },

    // Evento 18 — Herramientas para los campesinos
    {
        id: "18",
        day: 3,
        order: 5,
        image: "/assets/characters/commoners/blacksmith.png",
        dialogue: {
            speaker: "Herrero",
            introduction: [
                "¡Saludos, mi señor! Disculpad que me presente ante vos con las manos ennegrecidas, pero apenas he tenido tiempo de apartarme del yunque.",
                "Durante estos últimos días, los campesinos de las aldeas cercanas no han dejado de acudir a mi fragua. Sus arados están rotos, las azadas desgastadas y muchas hoces ya no cortan ni una brizna de trigo.",
                "Me gustaría fabricar nuevas herramientas para repartirlas entre los agricultores, pero el hierro escasea y la mayoría de esas pobres gentes apenas tiene monedas para pagarme.",
                "Si la Corona me cede algunos fondos, podré contratar ayudantes y poner mis forjas a trabajar para los campesinos del reino.",
                "¿Me concederéis el oro necesario, Majestad?",
            ],
            responses: {
                yes: [
                    "¡Así se habla!",
                    "Encenderemos las forjas día y noche hasta que no quede un solo campesino sin sus herramientas.",
                    "Con los campos nuevamente en marcha, algunas familias que habían abandonado sus aldeas regresarán para trabajar la tierra."
                ],
                no: [
                    "Es una lástima…",
                    "Haré cuanto pueda con el poco hierro que me queda, pero no podré ayudar a todos.",
                    "Algunos campesinos tendrán que abandonar sus tierras y buscar trabajo en otras regiones.",
                ],
            },
        },
        effects: {
            yes: { gold: -10, population: 10, prestige: 5 },
            no: { population: -5, prestige: -5 },
        },
    },

    // Evento 19 — Reclutamiento inicial
    {
        id: "19",
        day: 3,
        order: 6,
        image: "/assets/characters/army/master-arms.png",
        dialogue: {
            speaker: "Maestro de armas",
            introduction: [
                "¡A vuestras órdenes, mi rey!",
                "Las murallas están seguras, pero las filas del ejército necesitan sangre nueva para proteger el reino en estos tiempos de cambio.",
                "Pido vuestra autorización y oro para abrir una academia de entrenamiento donde convertir a los campesinos novatos en soldados leales y disciplinados. ¿Deseáis financiarla?",
            ],
            responses: {
                yes: [
                    "¡Excelente decisión! Pronto veréis cómo estos labriegos empuñan la lanza con orgullo y honor bajo vuestra bandera.",
                ],
                no: [
                    "Como mandéis, Majestad. Dejaremos que los campesinos sigan con azadas en lugar de espadas, aunque nos quedaremos sin refuerzos si las cosas se tuercen.",
                ],
            },
        },
        effects: {
            yes: { gold: -20, army: 40 },
            no: { prestige: -5, army: -5 },
        },
    },

    // Evento 20 — La balanza del mercado
    {
        id: "20",
        day: 3,
        order: 7,
        image: "/assets/characters/commoners/great-merchant.png",
        dialogue: {
            speaker: "Gran mercader",
            introduction: [
                "Mi señor, cada puesto del mercado usa sus propias pesas y medidas.",
                "Esto provoca continuas peleas entre vendedores y compradores.",
                "Si emitís un decreto real para estandarizar todas las balanzas de la capital, el comercio fluirá con orden y justicia. ¿Lo aprobáis?",
            ],
            responses: {
                yes: [
                    "¡Una decisión sensata, Majestad!",
                    "Los mercaderes honestos celebrarán vuestro buen criterio.",
                    "Los comerciantes tramposos se marcharán con sus familias.",
                ],
                no: [
                    "Como deseéis, Majestad. Seguiremos regateando entre gritos y trampas en la plaza.",
                ],
            },
        },
        effects: {
            yes: { gold: 20, prestige: 5, population: -10 },
            no: { prestige: -5 },
        },
    },

    // Evento 21 — La bodega del difunto rey
    {
        id: "21",
        day: 3,
        order: 8,
        image: "/assets/characters/courtiers/court-sommelier.png",
        dialogue: {
            speaker: "Sumiller de la corte",
            introduction: [
                "Mi señor, disculpad que os moleste con un asunto tan delicado.",
                "Durante sus cuarenta años de reinado, vuestro padre reunió una extraordinaria colección de vinos procedentes de todos los rincones del continente.",
                "En las bodegas del palacio descansan barriles y botellas de cosechas tan antiguas que algunos mercaderes estarían dispuestos a pagar auténticas fortunas por ellas.",
                "Si me autorizáis a vender una parte de la colección, podríamos ingresar una considerable suma de oro en las arcas reales.",
                "Sin embargo, algunos nobles consideran aquellos vinos parte del legado del difunto monarca y podrían interpretar su venta como una falta de respeto hacia su memoria.",
                "¿Deseáis que pongamos la colección a la venta?",
            ],
            responses: {
                yes: [
                    "Como ordenéis, Majestad. Me pondré en contacto con los mercaderes más adinerados del reino, estoy seguro de que pagarán un excelente precio.",
                    "Aunque debo advertiros que algunos nobles murmurarán que os estáis desprendiendo demasiado pronto de las pertenencias de vuestro padre.",
                ],
                no: [
                    "Una decisión muy respetable.",
                    "Conservaré cada botella tal y como vuestro padre la dejó.",
                    "Los nobles más cercanos al antiguo rey agradecerán que preservéis una parte de su legado.",
                ],
            },
        },
        effects: {
            yes: { gold: 100, prestige: -40 },
            no: { prestige: 20 },
        },
    },

    // Evento 22 — El despertar del golem
    {
        id: "22",
        day: 3,
        order: 9,
        image: "/assets/characters/fantasy/stone-golem.png",
        dialogue: {
            speaker: "Golem de piedra",
            introduction: [
                "GRRR... La corona ha vuelto a brillar... y mi corazón de piedra vuelve a latir bajo los jardines.",
                "Soy el antiguo guardián de estas murallas, he despertado para serviros, rey de Astaria.",
                "Para mantener mi núcleo encendido y aplastar a vuestros enemigos, debéis canalizar hacia mí las plegarias y la devoción de vuestros templos.",
                "¿Aceptáis vincular mi alma de roca a la energía sagrada de vuestro reino?",
            ],
            responses: {
                yes: [
                    "GRRR... Siento el calor de vuestros altares fluyendo por mis vetas. Mientras la fe alimente mi piedra, ningún ejército cruzará vuestras puertas.",
                ],
                no: [
                    "GRRR... Rechazáis el pacto antiguo, igual que hicieron los débiles antes que vos. Volveré a mi letargo... pero recordaréis mi nombre cuando tiemblen los muros.",
                ],
            },
        },
        effects: {
            yes: { faith: -20, army: 20 },
            no: { faith: 10, army: -5 },
        },
        unlocks: {
            yes: ["22.1"],
            no: ["22.2"],
        },
    },

];
