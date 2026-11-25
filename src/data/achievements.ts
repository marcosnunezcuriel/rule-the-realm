import type { Decision } from "../types/dialogue";

type AchievementTrigger =
    | {
        type: "decision";
        eventId: string;
        answer: Decision;
    }
    | {
        type: "event-complete";
        eventId: string;
    }
    | {
        type: "chapter-complete";
        chapter: number;
    };

type AchievementDefinition = {
    id: string;
    name: string;
    description: string;
    trigger: AchievementTrigger;
};

export const achievements = [
    {
        id: "hand-of-king",
        name: "Mano del rey",
        description: "Acepta la ayuda de tu hermano.",
        trigger: {
            type: "decision",
            eventId: "8",
            answer: "yes",
        },
    },
    {
        id: "great-circus",
        name: "Gran circo",
        description: "Permite que el gran circo actúe en la capital.",
        trigger: {
            type: "decision",
            eventId: "11",
            answer: "yes",
        },
    },
    {
        id: "emerald-fever",
        name: "Fiebre de esmeraldas",
        description: "Consigue que la mina de esmeraldas se convierta en una explotación próspera.",
        trigger: {
            type: "event-complete",
            eventId: "12.3",
        },
    },
    {
        id: "second-chance",
        name: "Una segunda oportunidad",
        description: "Ayuda al mendigo y recibe su donación días después.",
        trigger: {
            type: "event-complete",
            eventId: "13.1",
        },
    },
    {
        id: "everything-has-a-price",
        name: "Todo tiene un precio",
        description: "Vende la colección de vinos de tu difunto padre.",
        trigger: {
            type: "decision",
            eventId: "21",
            answer: "yes",
        },
    },
    {
        id: "royal-portrait",
        name: "Para la posteridad",
        description: "Consigue que el pintor termine tu retrato oficial.",
        trigger: {
            type: "event-complete",
            eventId: "23.1",
        },
    },
    {
        id: "industrial-revolution",
        name: "Revolución industrial",
        description: "Consigue que el nuevo molino entre en funcionamiento.",
        trigger: {
            type: "event-complete",
            eventId: "30.1",
        },
    },
    {
        id: "forest-protector",
        name: "Protector del bosque",
        description: "Impide que los comerciantes talen la arboleda sagrada.",
        trigger: {
            type: "decision",
            eventId: "33",
            answer: "yes",
        },
    },
    {
        id: "no-one-left-behind",
        name: "Nadie se queda atrás",
        description: "Financia el rescate de los barcos atrapados por la tormenta.",
        trigger: {
            type: "decision",
            eventId: "35",
            answer: "yes",
        },
    },
    {
        id: "land-of-opportunity",
        name: "Tierra de oportunidades",
        description: "Acoge a los refugiados del desierto y financia posteriormente su integración.",
        trigger: {
            type: "decision",
            eventId: "36.1",
            answer: "yes",
        },
    },
    {
        id: "protected-borders",
        name: "Fronteras protegidas",
        description: "Ordena al ejército proteger la frontera sur frente a los saqueadores.",
        trigger: {
            type: "decision",
            eventId: "36.2",
            answer: "yes",
        },
    },
    {
        id: "grateful-duke",
        name: "Un duque agradecido",
        description: "Rechaza el soborno de los furtivos y recibe la gratitud del duque.",
        trigger: {
            type: "event-complete",
            eventId: "37.1",
        },
    },
    {
        id: "moon-guard",
        name: "Guardia de la Luna",
        description: "Acepta la ayuda de la manada de hombres lobo.",
        trigger: {
            type: "decision",
            eventId: "44",
            answer: "yes",
        },
    },
    {
        id: "against-wind-and-plague",
        name: "Contra viento y peste",
        description: "Financia la contratación de médicos para combatir la Fiebre Negra.",
        trigger: {
            type: "decision",
            eventId: "45",
            answer: "yes",
        },
    },
    {
        id: "first-steps",
        name: "Primeros pasos en el trono",
        description: "Completa el Capítulo I.",
        trigger: {
            type: "chapter-complete",
            chapter: 1,
        },
    },
] as const satisfies readonly AchievementDefinition[];

export type AchievementId = (typeof achievements)[number]["id"];

export function getDecisionAchievements(
    eventId: string,
    answer: Decision
): AchievementId[] {
    return achievements
        .filter((achievement) => {
            const trigger = achievement.trigger;

            return (
                trigger.type === "decision" &&
                trigger.eventId === eventId &&
                trigger.answer === answer
            );
        })
        .map((achievement) => achievement.id);
}

export function getEventCompletionAchievements(
    eventId: string
): AchievementId[] {
    return achievements
        .filter((achievement) => {
            const trigger = achievement.trigger;

            return (
                trigger.type === "event-complete" &&
                trigger.eventId === eventId
            );
        })
        .map((achievement) => achievement.id);
}

export function getChapterCompletionAchievements(
    chapter: number
): AchievementId[] {
    return achievements
        .filter((achievement) => {
            const trigger = achievement.trigger;

            return (
                trigger.type === "chapter-complete" &&
                trigger.chapter === chapter
            );
        })
        .map((achievement) => achievement.id);
}
