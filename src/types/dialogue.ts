// Define las decisiones posibles y la estructura de los diálogos.

export type Decision = "yes" | "no";

export type DialogueEvent = {
    speaker: string;
    introduction: string[];
    responses?: Record<Decision, string[]>;
};
