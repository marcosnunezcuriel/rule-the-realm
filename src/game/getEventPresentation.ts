import type { GameEvent } from "../types/events";
import type { MonarchRole } from "../types/monarch";
import type { DialogueEvent } from "../types/dialogue";

// Resolver la presentación de cualquier acontecimiento.
export function getEventPresentation(
    event: GameEvent,
    monarch: MonarchRole
): {
    image: string;
    dialogue: DialogueEvent;
} {
    const variant =
        event.monarchVariants?.[monarch];

    if (variant === undefined) {
        return {
            image: event.image,
            dialogue: event.dialogue,
        };
    }

    const replacements =
        variant.replacements ?? [];

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

    const dialogue = event.dialogue;

    return {
        image: variant.image ?? event.image,

        dialogue: {
            ...dialogue,

            speaker:
                variant.speaker ??
                dialogue.speaker,

            introduction:
                dialogue.introduction.map(adaptText),

            responses: dialogue.responses
                ? {
                    yes: dialogue.responses.yes.map(
                        adaptText
                    ),

                    no: dialogue.responses.no.map(
                        adaptText
                    ),
                }
                : undefined,
        },
    };
}
