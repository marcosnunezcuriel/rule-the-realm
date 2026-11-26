// @vitest-environment jsdom

// Comprueba la persistencia y validación de los logros desbloqueados.

import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    ACHIEVEMENTS_KEY,
    loadUnlockedAchievements,
    unlockAchievement,
} from "../../storage/achievementsStorage";
import { clearSavedGame } from "../../storage/gameStorage";

describe("Guardado permanente de logros", () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it("comienza con la colección vacía", () => {
        expect(loadUnlockedAchievements()).toEqual([]);
    });

    it("guarda y recupera un logro", () => {
        expect(unlockAchievement("hand-of-king")).toBe(true);

        expect(loadUnlockedAchievements()).toEqual([
            "hand-of-king",
        ]);
    });

    it("guarda el logro actual de final de capítulo", () => {
        expect(unlockAchievement("first-steps")).toBe(true);

        expect(loadUnlockedAchievements()).toContain(
            "first-steps"
        );
    });

    it("impide desbloquear el mismo logro dos veces", () => {
        expect(unlockAchievement("great-circus")).toBe(true);
        expect(unlockAchievement("great-circus")).toBe(false);

        expect(loadUnlockedAchievements()).toEqual([
            "great-circus",
        ]);
    });

    it("conserva los logros entre partidas", () => {
        unlockAchievement("hand-of-king");

        clearSavedGame();

        expect(loadUnlockedAchievements()).toEqual([
            "hand-of-king",
        ]);
    });

    it("descarta identificadores desconocidos", () => {
        window.localStorage.setItem(
            ACHIEVEMENTS_KEY,
            JSON.stringify([
                "hand-of-king",
                "unknown-achievement",
            ])
        );

        expect(loadUnlockedAchievements()).toEqual([
            "hand-of-king",
        ]);
    });

    it("no duplica identificadores guardados", () => {
        window.localStorage.setItem(
            ACHIEVEMENTS_KEY,
            JSON.stringify([
                "first-steps",
                "first-steps",
            ])
        );

        expect(loadUnlockedAchievements()).toEqual([
            "first-steps",
        ]);
    });

    it("tolera datos de almacenamiento incorrectos", () => {
        window.localStorage.setItem(
            ACHIEVEMENTS_KEY,
            "{contenido-invalido"
        );

        expect(loadUnlockedAchievements()).toEqual([]);
    });
});
