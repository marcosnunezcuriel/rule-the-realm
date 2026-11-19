export type Decision = "yes" | "no";

export type DialogueEvent = {
    speaker: string;
    introduction: string[];
    responses: Record<Decision, string[]>;
};
