import {
    useEffect,
    useState,
} from "react";

import type { MouseEvent } from "react";

import { soundEngine } from "../../audio/soundEngine";

import {
    loadSoundSettings,
    saveSoundSettings,
} from "../../storage/soundSettingsStorage";

import {
    loadAnthemUnlocked,
    unlockAnthem,
} from "../../storage/anthemStorage";

import type {
    SoundEffect,
    SoundSettings,
} from "../../types/audio";

import type {
    GameReward,
    UnlockableAmbientTrack,
} from "../../types/rewards";

// Seleccionar el sonido correspondiente a cada botón.
function getButtonSound(
    button: HTMLButtonElement
): SoundEffect {
    if (
        button.classList.contains(
            "speech-bubble__choice--yes"
        )
    ) {
        return "decision-yes";
    }

    if (
        button.classList.contains(
            "speech-bubble__choice--no"
        )
    ) {
        return "decision-no";
    }

    if (
        button.classList.contains(
            "speech-bubble__next"
        ) ||
        button.classList.contains(
            "narrative-parchment__button"
        )
    ) {
        return "dialogue-next";
    }

    return "ui-click";
}

// Preferencias, recompensas musicales y sonidos de interfaz.
export function useSoundSettings(
    onAnthemUnlocked: () => void
) {
    const [soundSettings, setSoundSettings] =
        useState(loadSoundSettings);

    const [soundPanelOpen, setSoundPanelOpen] =
        useState(false);

    const [hymnUnlocked, setHymnUnlocked] =
        useState(loadAnthemUnlocked);

    useEffect(() => {
        saveSoundSettings(soundSettings);

        soundEngine.configure(
            soundSettings,
            hymnUnlocked
        );
    }, [
        soundSettings,
        hymnUnlocked,
    ]);

    function updateSoundSettings(
        changes: Partial<SoundSettings>
    ) {
        setSoundSettings((previous) => ({
            ...previous,
            ...changes,
        }));
    }

    function openSoundPanel() {
        setSoundPanelOpen(true);
    }

    function closeSoundPanel() {
        setSoundPanelOpen(false);
    }

    function unlockAudio() {
        soundEngine.unlock();
    }

    function handleAppClick(
        event: MouseEvent<HTMLDivElement>
    ) {
        const target = event.target;

        if (!(target instanceof Element)) {
            return;
        }

        const button = target.closest("button");

        if (button === null || button.disabled) {
            return;
        }

        soundEngine.unlock();
        soundEngine.playEffect(
            getButtonSound(button)
        );
    }

    function handleAnthemUnlocked() {
        if (hymnUnlocked || !unlockAnthem()) {
            return;
        }

        setHymnUnlocked(true);
        onAnthemUnlocked();
    }

    function handleRewardUnlocked(
        reward: GameReward
    ) {
        switch (reward.kind) {
            case "music": {
                const handlers: Record<
                    UnlockableAmbientTrack,
                    () => void
                > = {
                    anthem: handleAnthemUnlocked,
                };

                handlers[reward.track]();
                break;
            }
        }
    }

    return {
        soundSettings,
        soundPanelOpen,
        hymnUnlocked,

        updateSoundSettings,
        openSoundPanel,
        closeSoundPanel,
        unlockAudio,
        handleAppClick,
        handleRewardUnlocked,
    };
}
