// @vitest-environment jsdom

// Comprueba la persistencia y validación de las preferencias de sonido.

import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    DEFAULT_SOUND_SETTINGS,
    SOUND_SETTINGS_KEY,
    loadSoundSettings,
    saveSoundSettings,
} from "../../storage/soundSettingsStorage";

describe("Preferencias de sonido", () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it("utiliza la configuración inicial", () => {
        expect(loadSoundSettings()).toEqual(
            DEFAULT_SOUND_SETTINGS
        );
    });

    it("guarda y recupera los volúmenes", () => {
        const settings = {
            ...DEFAULT_SOUND_SETTINGS,
            masterVolume: 45,
            effectsVolume: 25,
            ambientTrack: "anthem" as const,
        };

        saveSoundSettings(settings);

        expect(loadSoundSettings()).toEqual(settings);
    });

    it("conserva los volúmenes al silenciar", () => {
        const settings = {
            ...DEFAULT_SOUND_SETTINGS,
            muted: true,
            masterVolume: 70,
            ambienceVolume: 30,
            effectsVolume: 60,
        };

        saveSoundSettings(settings);

        expect(loadSoundSettings()).toEqual(settings);
    });

    it("rechaza volúmenes y pistas inválidos", () => {
        window.localStorage.setItem(
            SOUND_SETTINGS_KEY,
            JSON.stringify({
                muted: "no",
                masterVolume: 999,
                ambienceVolume: -5,
                effectsVolume: 25,
                ambientTrack: "unknown",
            })
        );

        expect(loadSoundSettings()).toEqual({
            ...DEFAULT_SOUND_SETTINGS,
            effectsVolume: 25,
        });
    });
});
