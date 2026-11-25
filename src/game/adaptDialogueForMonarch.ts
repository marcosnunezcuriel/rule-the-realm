import type { DialogueEvent } from "../types/dialogue";
import type { MonarchRole } from "../types/monarch";

// Solo estas audiencias tienen tratamientos familiares
// que cambian según quién ocupa el trono.
const queenReplacements: Record<
    string,
    Array<readonly [string, string]>
> = {
    // Evento 4: la princesa habla con su madre.
    "4": [
        ["¡Padre!", "¡Madre!"],
        ["¡Gracias, padre!", "¡Gracias, madre!"],
        ["Pero, padre", "Pero, madre"],
    ],

    // Evento 6: el príncipe habla con su madre.
    "6": [
        ["¡Padre!", "¡Madre!"],
        ["¡Gracias, padre!", "¡Gracias, madre!"],
        ["¡Pero, padre!", "¡Pero, madre!"],
    ],

    // Evento 8: el hermano habla con su hermana.
    "8": [
        ["Hermano,", "Hermana,"],
        [", hermano!", ", hermana!"],
        [", hermano?", ", hermana?"],
        [", hermano.", ", hermana."],
    ],

    // Evento 10: el rey consorte habla con la reina.
    "10": [
        ["Gracias, querido.", "Gracias, querida."],
        ["no te sientas preparado.", "no te sientas preparada."],
    ],
};

export function adaptDialogueForMonarch(
    dialogue: DialogueEvent,
    eventId: string | undefined,
    monarch: MonarchRole
): DialogueEvent {
    if (monarch === "king") {
        return dialogue;
    }

    const replacements =
        queenReplacements[eventId ?? ""] ?? [];

    // No cambiamos palabras como "padre" indiscriminadamente:
    // también se utilizan para hablar del monarca fallecido.
    function adaptText(text: string): string {
        return replacements.reduce(
            (current, [original, replacement]) => {
                return current.replaceAll(
                    original,
                    replacement
                );
            },
            text
        );
    }

    const speaker =
        eventId === "8"
            ? "Hermano de la reina"
            : eventId === "10"
                ? "Rey"
                : dialogue.speaker;

    return {
        ...dialogue,
        speaker,
        introduction: dialogue.introduction.map(adaptText),
        responses: dialogue.responses
            ? {
                yes: dialogue.responses.yes.map(adaptText),
                no: dialogue.responses.no.map(adaptText),
            }
            : undefined,
    };
}
