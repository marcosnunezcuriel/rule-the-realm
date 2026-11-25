export type AmbientTrack = "birds" | "anthem";

export type SoundEffect =
    | "ui-click"
    | "decision-yes"
    | "decision-no"
    | "dialogue-next"
    | "visitor-enter"
    | "visitor-exit"
    | "notification-stats"
    | "notification-modifier-added"
    | "notification-modifier-removed"
    | "notification-achievement"
    | "day-end"
    | "day-summary"
    | "game-over"
    | "chapter-complete";

export type SoundSettings = {
    muted: boolean;
    masterVolume: number;
    ambienceVolume: number;
    effectsVolume: number;
    ambientTrack: AmbientTrack;
};
