// @vitest-environment jsdom

import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    ANTHEM_UNLOCK_KEY,
    loadAnthemUnlocked,
    unlockAnthem,
} from "../../storage/anthemStorage";

import { clearSavedGame } from "../../storage/gameStorage";

describe("Desbloqueo permanente del Himno de Astaria", () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it("comienza bloqueado", () => {
        expect(loadAnthemUnlocked()).toBe(false);
    });

    it("se desbloquea una única vez", () => {
        expect(unlockAnthem()).toBe(true);
        expect(loadAnthemUnlocked()).toBe(true);

        expect(unlockAnthem()).toBe(false);
    });

    it("se conserva al comenzar otra partida", () => {
        unlockAnthem();

        clearSavedGame();

        expect(loadAnthemUnlocked()).toBe(true);
    });

    it("reconoce el antiguo logro del himno", () => {
        window.localStorage.setItem(
            "rule-the-realm.achievements",
            JSON.stringify([
                "hand-of-king",
                "astaria-anthem",
            ])
        );

        expect(loadAnthemUnlocked()).toBe(true);
        expect(unlockAnthem()).toBe(false);
    });

    it("guarda el desbloqueo independientemente de los logros", () => {
        unlockAnthem();

        expect(
            window.localStorage.getItem(
                ANTHEM_UNLOCK_KEY
            )
        ).toBe("true");
    });
});
