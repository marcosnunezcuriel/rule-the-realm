import type {
    AmbientTrack,
    SoundEffect,
} from "../types/audio";

export const effectPaths: Record<SoundEffect, string> = {
    "ui-click": "/assets/audio/effects/ui-click.mp3",
    "decision-yes": "/assets/audio/effects/decision-yes.mp3",
    "decision-no": "/assets/audio/effects/decision-no.mp3",
    "dialogue-next": "/assets/audio/effects/dialogue-next.mp3",
    "visitor-enter": "/assets/audio/effects/visitor-enter.mp3",
    "visitor-exit": "/assets/audio/effects/visitor-exit.mp3",
    "notification-stats": "/assets/audio/effects/notification-stats.mp3",
    "notification-modifier-added": "/assets/audio/effects/notification-modifier-added.mp3",
    "notification-modifier-removed": "/assets/audio/effects/notification-modifier-removed.mp3",
    "notification-achievement": "/assets/audio/effects/notification-achievement.mp3",
    "day-end": "/assets/audio/effects/day-end.mp3",
    "day-summary": "/assets/audio/effects/day-summary.mp3",
    "game-over": "/assets/audio/effects/game-over.mp3",
    "chapter-complete": "/assets/audio/effects/chapter-complete.mp3",
};

export const ambientPaths: Record<AmbientTrack, string> = {
    birds: "/assets/audio/ambience/birds.ogg",
    anthem: "/assets/audio/ambience/anthem-of-astaria.ogg",
};
