// @vitest-environment jsdom

// Comprueba la persistencia del desbloqueo del himno.

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

    it("permanece desbloqueado entre partidas", () => {
        unlockAnthem();

        clearSavedGame();

        expect(loadAnthemUnlocked()).toBe(true);
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
