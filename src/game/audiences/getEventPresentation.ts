import { royalAddressVariants } from "../../data/narrative/royalAddressVariants";

import type { DialogueEvent } from "../../types/dialogue";
import type { GameEvent } from "../../types/events";
import type { MonarchRole } from "../../types/monarch";

// Adaptar los tratamientos de un diálogo a la reina.
function adaptText(text: string): string {
    return royalAddressVariants.reduce(
        (current, [original, replacement]) => {
            return current.replaceAll(
                original,
                replacement
            );
        },
        text
    );
}

// Resolver la presentación según el protagonista.
export function getEventPresentation(
    event: GameEvent,
    monarch: MonarchRole
): {
    image: string;
    dialogue: DialogueEvent;
} {
    // Los diálogos originales corresponden al rey; la reina utiliza las adaptaciones registradas.
    if (monarch === "king") {
        return {
            image: event.image,
            dialogue: event.dialogue,
        };
    }

    const visitor = event.queenVisitor;
    const dialogue = event.dialogue;

    return {
        image: visitor?.image ?? event.image,

        dialogue: {
            ...dialogue,

            speaker:
                visitor?.speaker ??
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
