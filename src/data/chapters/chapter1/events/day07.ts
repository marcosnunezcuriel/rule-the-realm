import type { GameEvent } from "../../../../types/events";

// Capítulo I · día 07. Orden y textos del PDF definitivo.

export const day07Events: GameEvent[] = [
    // Evento 11.2 — El circo se marcha
    {
        id: "11.2",
        day: 7,
        order: 1,
        requiresUnlock: true,
        image: "/assets/characters/commoners/circus-ringmaster.png",
        dialogue: {
            speaker: "Director del circo",
            introduction: [
                "Majestad, vuestra hospitalidad ha sido maravillosa, pero las carpas deben desmontarse.",
                "Nuestros caminos siguen hacia otros reinos, llevándonos los aplausos y los recuerdos de Astaria.",
            ],
        },
        removeModifiersOnComplete: ["traveling-circus"],
    },

    // Evento 12.3 — Mina próspera
    {
        id: "12.3",
        day: 7,
        order: 2,
        requiresUnlock: true,
        image: "/assets/characters/commoners/miner.png",
        dialogue: {
            speaker: "Minero",
            introduction: [
                "Mi señor, pese al accidente, la producción ha sido extraordinaria.",
                "Las esmeraldas están siendo vendidas por todo el continente.",
                "La mina se ha convertido en una importante fuente de riqueza para Astaria.",
            ],
        },
        addModifiersOnComplete: ["emerald-mine"],
    },

    // Evento 13.1 — El mendigo se vuelve rico
    {
        id: "13.1",
        day: 7,
        order: 3,
        requiresUnlock: true,
        image: "/assets/characters/commoners/beggar.png",
        dialogue: {
            speaker: "Mendigo",
            introduction: [
                "¡Miradme, mi señor! ¿Os acordáis de mí? ¡Soy el mendigo al que salvasteis del hambre hace unos días!",
                "La fortuna ha sonreído a este pobre viejo de la forma más extraña...",
                "¡He encontrado una bolsa llena monedas de oro!",
                "Como muestra de eterna gratitud por vuestra bondad, quiero entregaros una parte de mi fortuna.",
            ],
        },
        baseEffects: { gold: 100 },
    },

    // Evento 14.1 — El recaudador baja los impuestos
    {
        id: "14.1",
        day: 7,
        order: 4,
        requiresUnlock: true,
        image: "/assets/characters/courtiers/tax-collector.png",
        dialogue: {
            speaker: "Recaudador de impuestos",
            introduction: [
                "Mi señor, ya hemos recaudado una buena cantidad, pero persistir en estas tasas ya no dará grandes frutos y podría encender los ánimos.",
                "Bajemos los impuestos y volvamos a la normalidad.",
            ],
        },
        removeModifiersOnComplete: ["high-taxes"],
    },

    // Evento 30.1 — Las aspas del progreso
    {
        id: "30.1",
        day: 7,
        order: 5,
        requiresUnlock: true,
        image: "/assets/characters/commoners/inventor.png",
        dialogue: {
            speaker: "Inventor",
            introduction: [
                "¡El molino funciona como un reloj divino, mi rey!",
                "Las nuevas aspas aprovechan hasta la brisa más leve.",
                "Los graneros rebosan de harina fina en tiempo récord.",
            ],
        },
        addModifiersOnComplete: ["modern-windmills"],
    },

    // Evento 30.2 — El diseño robado
    {
        id: "30.2",
        day: 7,
        order: 6,
        requiresUnlock: true,
        image: "/assets/characters/courtiers/royal-advisor.png",
        dialogue: {
            speaker: "Consejera Real",
            introduction: [
                "Mi señor, ¿recordáis al inventor al que negasteis el oro?",
                "Pues ha huido al reino vecino con los planos de su molino bajo el brazo.",
                "Ahora están construyendo decenas de estas máquinas, arrebatándonos el monopolio del grano y dejando en evidencia nuestra falta de iniciativa.",
            ],
        },
        baseEffects: { prestige: -20 },
    },

    // Evento 36.1 — El peso del éxodo
    {
        id: "36.1",
        day: 7,
        order: 7,
        requiresUnlock: true,
        image: "/assets/characters/foreigners/grand-vizier.png",
        dialogue: {
            speaker: "Primer visir",
            introduction: [
                "Rey de Astaria, os estamos profundamente agradecidos por el refugio.",
                "Pero los suburbios están colapsados y la tensión con los lugareños crece por la escasez de agua y alimentos.",
                "El Primer Visir se arrodilla ante vos.",
                "Si me concedéis fondos extraordinarios para construir pozos y repartir grano equitativamente, integraremos a mi pueblo sin revueltas.",
                "¿Financiáis el plan de integración?",
            ],
            responses: {
                yes: [
                    "¡Habéis gobernado con sabiduría y justicia!",
                    "Con este oro, la paz reinará entre vuestros antiguos súbditos y los nuestros.",
                ],
                no: [
                    "¿Nos negáis la ayuda cuando ya nos habéis dejado entrar?",
                ],
            },
        },
        effects: {
            yes: { gold: -15, population: 20, prestige: -5 },
            no: { population: -25, prestige: -10 },
        },
    },

    // Evento 36.2 — La sombra en la frontera
    {
        id: "36.2",
        day: 7,
        order: 8,
        requiresUnlock: true,
        image: "/assets/characters/army/commander-royal-guard.png",
        dialogue: {
            speaker: "Comandante de la Guardia Real",
            introduction: [
                "Mi rey, recordáis a los refugiados del desierto a los que negamos la entrada…",
                "Pues al verse condenados al destierro, se han aliado con facciones de bandidos y merodean por nuestra frontera sur exigiendo venganza.",
                "Quieren saquear las caravanas comerciales como pago por el asilo denegado.",
                "Podemos enviar al ejército a dispersarlos a la fuerza.",
                "¿Ordenáis el ataque preventivo?",
            ],
            responses: {
                yes: [
                    "¡A vuestras órdenes, Majestad!",
                    "Les enseñaremos que no se desafía impunemente vuestra autoridad.",
                ],
                no: [
                    "El comercio al sur seguirá paralizado por el miedo a sus emboscadas.",
                ],
            },
        },
        effects: {
            yes: { army: -30, prestige: 5, gold: 30 },
            no: { gold: -15, prestige: -15 },
        },
    },

    // Evento 37.1 — La gratitud del duque
    {
        id: "37.1",
        day: 7,
        order: 9,
        requiresUnlock: true,
        image: "/assets/characters/nobles/duke-enchantedforest.png",
        dialogue: {
            speaker: "Duque de Bosqueencantado",
            introduction: [
                "Mi señor, me han informado de que rechazasteis un jugoso soborno de unos furtivos que saqueaban mis cotos de caza.",
                "En estos tiempos, la lealtad entre nobles es un bien escaso.",
                "Como muestra de mi más sincero agradecimiento, he ordenado a mis tesoreros que os entreguen el doble de lo que esos criminales os prometieron.",
            ],
        },
        baseEffects: { gold: 30, prestige: 10 },
    },

    // Evento 41 — El oro del banquero
    {
        id: "41",
        day: 7,
        order: 10,
        image: "/assets/characters/commoners/banker.png",
        dialogue: {
            speaker: "Banquero real",
            introduction: [
                "Majestad, las arcas del reino se vacían rápidamente.",
                "Tengo aquí mismo una saca repleta con cien monedas de oro listas para vuestro tesoro.",
                "Por supuesto, el favor tiene un precio: os lo prestaré con un interés severo que tendréis que devolver con creces.",
                "¿Aceptáis este préstamo inmediato?",
            ],
            responses: {
                yes: [
                    "¡Un trato excelente, Majestad!",
                    "El oro ya es vuestro, recordad que la deuda no tardará en llamar a vuestra puerta.",
                ],
                no: [
                    "Como mandéis. Buscaos otra manera de capear los gastos sin recurrir a mis arcas.",
                ],
            },
        },
        effects: {
            yes: { gold: 100 },
            no: {},
        },
        unlocks: {
            yes: ["chapter2-bankers-claim"],
        },
    },

    // Evento 42 — El bardo borracho
    {
        id: "42",
        day: 7,
        order: 11,
        image: "/assets/characters/courtiers/jester.png",
        dialogue: {
            speaker: "Bufón",
            introduction: [
                "¡Escuchad todos, nobleza de pacotilla!",
                "¡Nuestro rey se sienta en un trono de oro mientras tiene la cabeza llena de lodo!",
                "Dame un barril más de vino oscuro, y convertiré esta corte aburrida en un circo de risas.",
                "¿Me concedéis el vino?",
            ],
            responses: {
                yes: [
                    "¡Que corra el vino!",
                    "¡Que empiece el verdadero espectáculo!",
                ],
                no: [
                    "¡Bah, qué aguafiestas!",
                    "Me marcho a cantar a las tabernas.",
                ],
            },
        },
        effects: {
            yes: { prestige: -5, army: -5 },
            no: { prestige: -5, population: -5 },
        },
    },

    // Evento 43 — El secreto de la alquimia
    {
        id: "43",
        day: 7,
        order: 12,
        image: "/assets/characters/fantasy/wizard.png",
        dialogue: {
            speaker: "Mago",
            introduction: [
                "Mi señor, he logrado estabilizar un catalizador alquímico capaz de transmutar el plomo en oro puro de forma indefinida.",
                "El proceso es volátil y existe un leve riesgo de que una sobrecarga mágica reduzca a cenizas a mis aprendices.",
                "Pero las riquezas que obtendríamos solucionarían cualquier crisis.",
                "¿Me dais vuestra autorización para iniciar la prueba?",
            ],
            responses: {
                yes: [
                    "¡Que la magia guíe nuestros pasos!",
                    "Prepararé los crisoles de inmediato.",
                    "¡Ved cómo brilla el oro!",
                ],
                no: [
                    "Prudencia ante todo, supongo.",
                    "Dejaré los metales en su sitio y guardaré los frascos en el rincón más seguro.",
                ],
            },
        },
        effects: {
            yes: { gold: 50, population: -10 },
            no: { prestige: 5 },
        },
    },

    // Evento 44 — La guardia de la luna
    {
        id: "44",
        day: 7,
        order: 13,
        image: "/assets/characters/fantasy/werewolf.png",
        dialogue: {
            speaker: "Hombre lobo",
            introduction: [
                "GRRR... Tranquilidad, soberano de Astaria. No he venido a atacaros. Soy el líder de una manada de hombres lobo que habita en los bosques del norte de Astaria.",
                "Durante años hemos vivido ocultos, perseguidos por cazadores que nos consideran bestias sin inteligencia.",
                "Pero no somos monstruos. Pensamos, hablamos y sentimos igual que los humanos, aunque bajo la luz de la luna nuestra naturaleza sea diferente.",
                "He venido a ofreceros un trato.",
                "Mis hermanos y yo conocemos los bosques mejor que cualquiera de vuestros soldados. Podemos rastrear enemigos a kilómetros de distancia y movernos por la oscuridad sin que nadie nos escuche.",
                "Si nos permitís vivir en paz y proporcionáis algunos suministros a nuestra manada, nos encargaremos de vigilar los caminos del norte y proteger las fronteras durante la noche.",
                "Eso sí, debéis saber que muchos de vuestros súbditos nos temen. No todos aceptarán que su rey confíe la seguridad del reino a criaturas como nosotros.",
                "¿Qué decís? ¿Aceptáis nuestra ayuda?",
            ],
            responses: {
                yes: [
                    "GRRR... Habéis demostrado tener más valor que muchos de los hombres que se hacen llamar héroes.",
                    "Mi manada patrullará los bosques y los caminos de Astaria cuando caiga la noche.",
                    "Ningún bandido se atreverá a cruzar nuestras tierras sin sentir nuestros colmillos.",
                ],
                no: [
                    "GRRR... Ya veo. Para vos también somos simples bestias.",
                    "No os preocupéis. Mi manada regresará a los bosques y no volveréis a saber de nosotros.",
                ],
            },
        },
        effects: {
            yes: { gold: -10, army: 20, prestige: -10 },
            no: { prestige: 5 },
        },
    },

    // Evento 45 — Fiebre negra
    {
        id: "45",
        day: 7,
        order: 14,
        image: "/assets/characters/courtiers/royal-advisor.png",
        dialogue: {
            speaker: "Consejera Real",
            introduction: [
                "Mi señor, la enfermedad se extiende sin tregua por los barrios bajos.",
                "Las muertes se cuentan ya por decenas cada amanecer.",
                "Las gentes en las calles ya la llaman abiertamente la Fiebre negra.",
                "Si vaciamos el tesoro para contratar a curanderos y médicos itinerantes de allende los mares salvaremos innumerables vidas.",
                "Si no lo hacemos, el pánico y este mal devorarán nuestro pueblo.",
                "¿Contratamos más médicos?",
            ],
            responses: {
                yes: [
                    "¡De inmediato, Majestad!",
                    "Enviaremos a los sanadores a cada rincón afectado para contener la Fiebre negra.",
                ],
                no: [
                    "Que los dioses protejan a los enfermos.",
                    "El pueblo jamás olvidará este abandono ante la fiebre negra.",
                ],
            },
        },
        effects: {
            yes: { gold: -200, population: -10, prestige: 25, faith: 50 },
            no: { prestige: -50, population: -50, faith: -15 },
        },
        unlocksOnComplete: ["chapter2-hospitals"],
        addModifiersOnComplete: ["black-fever"],
    },

    // Evento 46 — El Sumo Pontífice quiere una reunión mañana
    {
        id: "46",
        day: 7,
        order: 15,
        image: "/assets/characters/courtiers/royal-herald.png",
        dialogue: {
            speaker: "Heraldo",
            introduction: [
                "Majestad, os traigo un asunto de gran importancia que requiere vuestra atención.",
                "El Sumo Pontífice ha enviado un emisario urgente. Desea mantener una reunión privada con vos mañana mismo en el salón del trono.",
            ],
        },
        unlocksOnComplete: ["chapter2-pontiff-meeting"],
    },

];
