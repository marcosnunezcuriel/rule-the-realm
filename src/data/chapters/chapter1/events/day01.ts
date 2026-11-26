import type { GameEvent } from "../../../../types/events";

// Capítulo I · día 01. Orden y textos del PDF definitivo.

export const day01Events: GameEvent[] = [
    // Evento 1 — Presentación del Mayordomo
    {
        id: "1",
        day: 1,
        order: 1,
        image: "/assets/characters/courtiers/butler.png",
        dialogue: {
            speaker: "Mayordomo",
            introduction: [
                "Buenos días, mi señor. Seré vuestro humilde mayordomo y me encargaré de que la corte funcione como un reloj.",
                "El antiguo rey dejó los aposentos reales bastante descuidados y el personal es escaso.",
                "¿Debo contratar más servidumbre para recibir dignamente a vuestros invitados?",
            ],
            responses: {
                yes: [
                    "¡Excelente decisión! El castillo brillará como el oro.",
                    "Los nobles quedarán impresionados por el esplendor de vuestra corte.",
                ],
                no: [
                    "Como ordenéis. Nos apañaremos con lo que tenemos.",
                    "Al menos ahorraremos unas cuantas monedas de oro para asuntos más urgentes.",
                ],
            },
        },
        effects: {
            yes: { gold: -10, prestige: 5 },
            no: { prestige: -5 },
        },
    },

    // Evento 2 — Presentación de la Consejera Real
    {
        id: "2",
        day: 1,
        order: 2,
        image: "/assets/characters/courtiers/royal-advisor.png",
        dialogue: {
            speaker: "Consejera Real",
            introduction: [
                "Mi señor, seré vuestra consejera real y estaré a vuestro servicio mientras ocupéis el trono.",
                "Vuestra coronación ha despertado entusiasmo en todo Astaria.",
                "Los habitantes de la capital esperan celebraciones, banquetes y un torneo.",
                "¿Deseáis celebrarlos?",
            ],
            responses: {
                yes: [
                    "Los festejos comenzarán al amanecer y durarán varios días.",
                    "El pueblo verá con buenos ojos vuestro gesto.",
                ],
                no: [
                    "Muchos esperaban algún tipo de celebración.",
                    "Aunque las arcas permanecerán intactas, algunos consideran vuestra decisión demasiado fría para el comienzo de un reinado.",
                ],
            },
        },
        effects: {
            yes: { gold: -20, prestige: 5 },
            no: { prestige: -10 },
        },
        unlocks: {
            yes: ["2.1"],
        },
    },

    // Evento 3 — La seguridad de la coronación
    {
        id: "3",
        day: 1,
        order: 3,
        image: "/assets/characters/army/commander-royal-guard.png",
        dialogue: {
            speaker: "Comandante de la Guardia Real",
            introduction: [
                "¡A vuestras órdenes, mi rey!",
                "La coronación ha atraído a miles de visitantes de todos los rincones de Astaria. Las calles están abarrotadas y mis hombres apenas pueden mantener el orden.",
                "Temo que los ladrones y alborotadores aprovechen las celebraciones para causar problemas.",
                "Solicito vuestro permiso para contratar refuerzos y aumentar la vigilancia durante estos primeros días de reinado.",
                "¿Autorizáis el despliegue?",
            ],
            responses: {
                yes: [
                    "¡Así se hará!",
                    "Reforzaré las patrullas y colocaré guardias adicionales en las puertas de la ciudad y los alrededores del palacio.",
                    "Vuestros súbditos podrán celebrar la coronación con tranquilidad.",
                ],
                no: [
                    "Entendido. Haremos cuanto podamos con los hombres disponibles.",
                    "Pero si se producen altercados durante las celebraciones, vuestra reputación podría verse perjudicada.",
                ],
            },
        },
        effects: {
            yes: { gold: -10, army: 10, prestige: 5 },
            no: { prestige: -5, army: -5 },
        },
        unlocks: {
            no: ["3.1"],
        },
    },

    // Evento 4 — Los últimos visitantes del abuelo
    {
        id: "4",
        day: 1,
        order: 4,
        image: "/assets/characters/royalty/princess.png",
        dialogue: {
            speaker: "Princesa",
            introduction: [
                "¡Padre! ¿Puedo pedirte un favor?",
                "Todavía quedan muchas familias que vinieron a la capital para despedirse del abuelo. Algunas han viajado durante días y ya no tienen dinero para comer ni un lugar donde dormir.",
                "Me gustaría abrir las cocinas del palacio para ofrecerles comida caliente y un techo hasta que puedan regresar a sus hogares.",
                "El abuelo siempre decía que quien reina debe cuidar del pueblo.",
                "¿Me das permiso?",
            ],
            responses: {
                yes: [
                    "¡Gracias, padre! ¡Sabía que aceptarías!",
                    "Iré ahora mismo a avisar a los cocineros.",
                ],
                no: [
                    "Pero, padre... ¡Hay niños entre esas familias!",
                    "Está bien... Supongo que ahora tienes muchas cosas de las que preocuparte.",
                ],
            },
        },
        effects: {
            yes: { gold: -10, prestige: 5, faith: 5 },
            no: { prestige: -5, faith: -5 },
        },
    },

    // Evento 5 — Presentación del Conde de Campotrigo
    {
        id: "5",
        day: 1,
        order: 5,
        image: "/assets/characters/nobles/count-wheatfield.png",
        dialogue: {
            speaker: "Conde de Campotrigo",
            introduction: [
                "Mis respetos, mi señor. Soy el Conde de Campotrigo, señor de las tierras fértiles del sur.",
                "Nuestros campos pueden dar mucho más alimento, pero faltan manos para arar. ¿Me autorizáis a financiar la llegada de familias extranjeras para trabajar mis tierras?",
            ],
            responses: {
                yes: [
                    "¡Sabia elección! Pronto llegarán caravanas de nuevos colonos a Astaria.",
                    "Nuestras aldeas crecerán, aunque el viaje correrá a cargo de vuestro tesoro.",
                ],
                no: [
                    "Una verdadera lástima, Majestad. Los campos seguirán medio vacíos.",
                    "Los terratenientes empezarán a pensar que no os preocupa el futuro del reino.",
                ],
            },
        },
        effects: {
            yes: { gold: -15, population: 15 },
            no: {},
        },
    },

    // Evento 6 — Las primeras armas del príncipe
    {
        id: "6",
        day: 1,
        order: 6,
        image: "/assets/characters/royalty/prince.png",
        dialogue: {
            speaker: "Príncipe",
            introduction: [
                "¡Padre! Ahora que ocupas el trono, ¡eso significa que yo soy el príncipe heredero!",
                "Dentro de un mes cumpliré catorce años y creo que ya va siendo hora de que empiece a prepararme como un verdadero guerrero.",
                "Estoy harto de entrenar con espadas de madera y golpear muñecos de paja.",
                "¡Quiero entrenar con los soldados de verdad, empuñar espadas de acero y aprender a luchar como ellos!",
                "¿Me permitirás unirme a los entrenamientos de la Guardia Real?",
            ],
            responses: {
                yes: [
                    "¡Lo sabía! ¡Gracias, padre!",
                    "¡Te prometo que entrenaré hasta convertirme en el mejor espadachín de Astaria!",
                    "Los soldados estarán encantados de contar con el príncipe heredero entre sus filas.",
                ],
                no: [
                    "¡Pero, padre! ¡Ya casi soy un hombre!",
                    "¿Cuánto tiempo más pretendes que siga jugando con espadas de madera?",
                ],
            },
        },
        effects: {
            yes: { army: 10, prestige: -5 },
            no: { prestige: 5, army: -5 },
        },
    },

    // Evento 7 — Presentación del Marqués de Rocafuego
    {
        id: "7",
        day: 1,
        order: 7,
        image: "/assets/characters/nobles/maquis-firerock.png",        
        dialogue: {
            speaker: "Marqués de Rocafuego",
            introduction: [
                "Saludos, Majestad. Soy el Marqués de Rocafuego. Mis forjas y minas sostienen el acero de Astaria.",
                "Nuestros soldados llevan espadas melladas y escudos viejos. Si invertís oro en mis explotaciones de hierro, equiparé a vuestras tropas como merecen. ¿Trato hecho?",
            ],
            responses: {
                yes: [
                    "¡Así se habla! Mis herreros trabajarán día y noche.",
                    "El ejército de Astaria pronto será la envidia de nuestros vecinos.",
                ],
                no: [
                    "Espero que no tengáis que lamentar esa tacañería cuando lleguen tiempos de guerra.",
                    "Sin hierro nuevo, la moral de nuestras tropas se resiente.",
                ],
            },
        },
        effects: {
            yes: { gold: -15, army: 15 },
            no: { army: -5, prestige: -5 },
        },
    },

    // Evento 8 — El consejo de un hermano
    {
        id: "8",
        day: 1,
        order: 8,
        image: "/assets/characters/royalty/kings-brother.png",
        queenVisitor: {
            speaker: "Hermano de la reina",
        },
        dialogue: {
            speaker: "Hermano del rey",
            introduction: [
                "Hermano, ¡menudo día llevamos! Apenas has recibido la corona y ya tienes a medio reino llamando a tus puertas.",
                "¿Recuerdas cuando éramos pequeños? Padre siempre te llevaba consigo a las reuniones del consejo, a recibir embajadores y a escuchar las interminables disputas entre los nobles.",
                "Mientras tanto, a mí me enviaba a jugar con los hijos de aquellos señores.",
                "¡Quién nos iba a decir que esos niños acabarían convirtiéndose en los hombres más influyentes de Astaria!",
                "Conozco a muchos de ellos desde la infancia. Sé quiénes son amigos, quiénes se detestan y, sobre todo, qué es lo que desean.",
                "Ahora que has heredado el trono, me gustaría ofrecerte mi ayuda para organizar y dirigir las reuniones del consejo durante tus primeras semanas de reinado.",
                "¿Qué me dices, hermano? ¿Aceptas mi ayuda?",
            ],
            responses: {
                yes: [
                    "¡Sabía que podía contar contigo, hermano!",
                    "Prepararé una reunión con los principales señores del reino. Un buen banquete y unas cuantas conversaciones privadas nos ayudarán a ganarnos su confianza.",
                    "Ya verás, juntos conseguiremos que los nobles estén de nuestra parte.",
                ],
                no: [
                    "Vaya... Entiendo que quieras encargarte personalmente de los asuntos del reino.",
                    "Solo pretendía echarte una mano, hermano. Recuerda que puedes contar conmigo si cambias de opinión.",
                    "Algunos nobles se muestran contrariados al saber que habéis rechazado la mediación de vuestro hermano.",
                ],
            },
        },
        effects: {
            yes: { gold: -5, prestige: 10 },
            no: { prestige: -5 },
        },
        addStoryFlags: {
            yes: ["brother-is-advisor"],
        },
    },

    // Evento 9 — Presentación del Duque de Bosqueencantado
    {
        id: "9",
        day: 1,
        order: 9,
        image: "/assets/characters/nobles/duke-enchantedforest.png",
        dialogue: {
            speaker: "Duque de Bosqueencantado",
            introduction: [
                "¡Qué inmensa alegría contemplar a Vuestra Majestad! Soy el Duque de Bosqueencantado, humilde servidor de la Corona y de la fe.",
                "No vengo a pediros nada, Majestad. Solo a ofreceros mi lealtad incondicional y a donar un santuario en vuestro honor. ¿Aceptáis mi humilde bendición?",
            ],
            responses: {
                yes: [
                    "¡Que la estrella de ocho puntas ilumine siempre vuestro trono, mi señor!",
                    "Todo el clero y la corte alaban vuestra piedad y cercanía.",
                ],
                no: [
                    "Ah, qué modestia la vuestra al rechazar halagos. ¡Eso os honra aún más!",
                    "De todas formas, ya he ordenado rezar por vos en todos los templos. Contad conmigo para siempre.",
                ],
            },
        },
        effects: {
            yes: { faith: 10, prestige: 5 },
            no: { faith: 5, prestige: 10 },
        },
    },

    // Evento 10 — Una última vigilia
    {
        id: "10",
        day: 1,
        order: 10,
        image: "/assets/characters/royalty/queen-standing.png",
        queenVisitor: {
            image: "/assets/characters/royalty/king-standing.png",
            speaker: "Rey",
        },
        dialogue: {
            speaker: "Reina",
            introduction: [
                "Por fin estamos solos.",
                "Hoy todos te han llamado Majestad, pero nadie te ha preguntado cómo estás.",
                "Sé cuánto significaba tu padre para ti. No debe de ser fácil ocupar su lugar tan poco tiempo después de haberlo perdido.",
                "Esta noche me gustaría que nos reuniéramos en la capilla con los niños para honrar su memoria una última vez.",
                "Solo nosotros cuatro, en familia, lejos de los nobles y de las obligaciones del trono.",
                "¿Te parece bien?",
            ],
            responses: {
                yes: [
                    "Gracias, querido. Sé que tu padre habría agradecido este último homenaje.",
                    "Hablaré con los sacerdotes para que preparen la capilla.",
                    "Esta noche no tendremos que preocuparnos por el reino. Podremos despedirnos de él como la familia que somos.",
                ],
                no: [
                    "Lo entiendo, cariño. Ha sido un día muy largo y quizá aún no te sientas preparado.",
                    "Pero los sacerdotes esperaban que la familia real acudiera esta noche a rendirle su último homenaje.",
                    "Espero que los fieles comprendan tu decisión.",
                ],
            },
        },
        effects: {
            yes: { gold: -3, faith: 10 },
            no: { faith: -10 },
        },
    },

];
