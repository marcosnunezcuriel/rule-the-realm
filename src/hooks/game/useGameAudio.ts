import {
    useEffect,
    useRef,
} from "react";

import { soundEngine } from "../../audio/soundEngine";

import type {
    AudiencePhase,
    GameScreen,
} from "../../types/game";

import type { SoundEffect } from "../../types/audio";

type GameAudioInput = {
    day: number;
    screen: GameScreen;
    phase: AudiencePhase;
    dialogueKey: string;
    isAudienceScreen: boolean;
};

// Sonidos asociados a las pantallas de la partida.
const screenSounds: Partial<
    Record<GameScreen, SoundEffect>
> = {
    sleep: "day-end",
    summary: "day-summary",
    gameover: "game-over",
    "chapter-ending": "chapter-complete",
};

// Gestionar el sonido durante una partida activa.
export function useGameAudio({
    day,
    screen,
    phase,
    dialogueKey,
    isAudienceScreen,
}: GameAudioInput) {
    const lastVisitorSound =
        useRef<string | null>(null);

    const lastScreenSound =
        useRef<GameScreen | null>(null);

    // Pasos de entrada y salida de los visitantes.
    useEffect(() => {
        if (
            !isAudienceScreen ||
            (
                phase !== "entering" &&
                phase !== "exiting"
            )
        ) {
            return;
        }

        const key =
            `${day}-${dialogueKey}-${phase}`;

        if (lastVisitorSound.current === key) {
            return;
        }

        lastVisitorSound.current = key;

        soundEngine.playEffect(
            phase === "entering"
                ? "visitor-enter"
                : "visitor-exit"
        );
    }, [
        day,
        dialogueKey,
        phase,
        isAudienceScreen,
    ]);

    // Ambiente y sonidos de cada pantalla.
    useEffect(() => {
        soundEngine.setAmbientActive(
            isAudienceScreen
        );

        if (lastScreenSound.current === screen) {
            return;
        }

        lastScreenSound.current = screen;

        const effect = screenSounds[screen];

        if (effect !== undefined) {
            soundEngine.playEffect(effect);
        }
    }, [
        screen,
        isAudienceScreen,
    ]);

    // Recuperar el ambiente al regresar al menú.
    useEffect(() => {
        return () => {
            soundEngine.setAmbientActive(true);
        };
    }, []);
}
