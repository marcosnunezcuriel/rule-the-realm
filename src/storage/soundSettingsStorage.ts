// Recupera, valida y almacena las preferencias de sonido del jugador.

import type { SoundSettings } from "../types/audio";

export const SOUND_SETTINGS_KEY =
    "rule-the-realm.audio-settings";

export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
    muted: false,
    masterVolume: 70,
    ambienceVolume: 30,
    effectsVolume: 60,
    ambientTrack: "birds",
};

function validVolume(
    value: unknown,
    fallback: number
): number {
    return (
        typeof value === "number" &&
        Number.isInteger(value) &&
        value >= 0 &&
        value <= 100
    )
        ? value
        : fallback;
}

export function loadSoundSettings(): SoundSettings {
    try {
        const raw = window.localStorage.getItem(
            SOUND_SETTINGS_KEY
        );

        if (raw === null) {
            return { ...DEFAULT_SOUND_SETTINGS };
        }

        const value: unknown = JSON.parse(raw);

        if (
            value === null ||
            typeof value !== "object" ||
            Array.isArray(value)
        ) {
            return { ...DEFAULT_SOUND_SETTINGS };
        }

        const stored = value as Record<string, unknown>;

        return {
            muted: typeof stored.muted === "boolean"
                ? stored.muted
                : DEFAULT_SOUND_SETTINGS.muted,

            masterVolume: validVolume(
                stored.masterVolume,
                DEFAULT_SOUND_SETTINGS.masterVolume
            ),

            ambienceVolume: validVolume(
                stored.ambienceVolume,
                DEFAULT_SOUND_SETTINGS.ambienceVolume
            ),

            effectsVolume: validVolume(
                stored.effectsVolume,
                DEFAULT_SOUND_SETTINGS.effectsVolume
            ),

            ambientTrack: stored.ambientTrack === "anthem"
                ? "anthem"
                : "birds",
        };
    } catch {
        return { ...DEFAULT_SOUND_SETTINGS };
    }
}

export function saveSoundSettings(
    settings: SoundSettings
): void {
    try {
        window.localStorage.setItem(
            SOUND_SETTINGS_KEY,
            JSON.stringify(settings)
        );
    } catch {
        // El juego sigue funcionando si localStorage falla.
    }
}
