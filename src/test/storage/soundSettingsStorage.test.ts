// @vitest-environment jsdom

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

    it("utiliza los valores iniciales", () => {
        expect(loadSoundSettings()).toEqual(
            DEFAULT_SOUND_SETTINGS
        );
    });

    it("guarda los volúmenes y la música seleccionada", () => {
        const settings = {
            ...DEFAULT_SOUND_SETTINGS,
            masterVolume: 45,
            effectsVolume: 25,
            ambientTrack: "anthem" as const,
        };

        saveSoundSettings(settings);

        expect(loadSoundSettings()).toEqual(settings);
    });

    it("rechaza volúmenes inválidos", () => {
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
