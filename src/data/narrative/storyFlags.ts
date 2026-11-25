// Identificadores de las condiciones narrativas del reino.
export const storyFlagIds = [
    "brother-is-advisor",
] as const;

// Inferir el tipo directamente del registro.
export type StoryFlagId =
    (typeof storyFlagIds)[number];

// Comprobar que una condición narrativa está registrada.
export function isStoryFlagId(
    value: string
): value is StoryFlagId {
    return storyFlagIds.some(
        (id) => id === value
    );
}
