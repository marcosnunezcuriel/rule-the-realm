// Gestiona la reproducción del ambiente y los efectos de sonido, respetando las preferencias del jugador.

import {
    ambientPaths,
    effectPaths,
} from "./soundCatalog";

import {
    DEFAULT_SOUND_SETTINGS,
} from "../storage/soundSettingsStorage";

import type {
    AmbientTrack,
    SoundEffect,
    SoundSettings,
} from "../types/audio";

import { assetUrl } from "../utils/assetUrl";

class SoundEngine {
    private settings: SoundSettings = {
        ...DEFAULT_SOUND_SETTINGS,
    };

    private started = false;
    private ambientActive = true;
    private hymnUnlocked = false;

    private ambient: HTMLAudioElement | null = null;
    private ambientTrack: AmbientTrack | null = null;

    private effects = new Set<HTMLAudioElement>();

    // Activar después de una interacción del jugador.
    unlock(): void {
        this.started = true;
        this.syncAmbient();
    }

    // Actualizar volúmenes y desbloqueos.
    configure(
        settings: SoundSettings,
        hymnUnlocked: boolean
    ): void {
        this.settings = settings;
        this.hymnUnlocked = hymnUnlocked;

        const effectVolume = this.volumeFor("effects");

        for (const audio of this.effects) {
            audio.volume = effectVolume;

            if (effectVolume === 0) {
                audio.pause();
                this.effects.delete(audio);
            }
        }

        this.syncAmbient();
    }

    // Pausar el ambiente durante determinadas pantallas.
    setAmbientActive(active: boolean): void {
        this.ambientActive = active;
        this.syncAmbient();
    }

    // Reproducir un efecto sin cortar los anteriores.
    playEffect(effect: SoundEffect): void {
        const volume = this.volumeFor("effects");

        if (!this.started || volume === 0) {
            return;
        }

        const audio = new Audio(
            assetUrl(effectPaths[effect])
        );

        audio.volume = volume;

        this.effects.add(audio);

        const release = () => {
            this.effects.delete(audio);
        };

        audio.addEventListener(
            "ended",
            release,
            { once: true }
        );

        audio.addEventListener(
            "error",
            release,
            { once: true }
        );

        void audio.play().catch(release);
    }

    private volumeFor(
        channel: "ambience" | "effects"
    ): number {
        if (this.settings.muted) {
            return 0;
        }

        const channelVolume = channel === "ambience"
            ? this.settings.ambienceVolume
            : this.settings.effectsVolume;

        return (
            (this.settings.masterVolume / 100) *
            (channelVolume / 100)
        );
    }

    private syncAmbient(): void {
        if (!this.started) {
            return;
        }

        const requested = this.settings.ambientTrack;

        const track: AmbientTrack =
            requested === "anthem" && this.hymnUnlocked
                ? "anthem"
                : "birds";

        // Cambiar la pista cuando el jugador elija otra.
        if (track !== this.ambientTrack) {
            this.ambient?.pause();

            this.ambient = null;
            this.ambientTrack = track;
        }

        if (this.ambient === null) {
            this.ambient = new Audio(
                assetUrl(ambientPaths[track])
            );

            this.ambient.loop = true;
            this.ambient.preload = "auto";
        }

        const volume = this.volumeFor("ambience");

        this.ambient.volume = volume;

        if (!this.ambientActive || volume === 0) {
            this.ambient.pause();
            return;
        }

        if (this.ambient.paused) {
            void this.ambient.play().catch(() => {
                // Puede requerir otra interacción del jugador.
            });
        }
    }
}

export const soundEngine = new SoundEngine();
