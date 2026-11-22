// @vitest-environment jsdom

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

    it("comienza sin logros desbloqueados", () => {
        expect(loadUnlockedAchievements()).toEqual([]);
    });

    it("guarda un logro conseguido", () => {
        expect(unlockAchievement("hand-of-king")).toBe(true);

        expect(loadUnlockedAchievements()).toEqual([
            "hand-of-king",
        ]);
    });

    it("no desbloquea dos veces el mismo logro", () => {
        expect(unlockAchievement("great-circus")).toBe(true);
        expect(unlockAchievement("great-circus")).toBe(false);

        expect(loadUnlockedAchievements()).toEqual([
            "great-circus",
        ]);
    });

    it("conserva los logros al borrar una partida", () => {
        unlockAchievement("hand-of-king");

        clearSavedGame();

        expect(loadUnlockedAchievements()).toEqual([
            "hand-of-king",
        ]);
    });

    it("descarta identificadores de logros desconocidos", () => {
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

    it("tolera datos de almacenamiento incorrectos", () => {
        window.localStorage.setItem(
            ACHIEVEMENTS_KEY,
            "{contenido-invalido"
        );

        expect(loadUnlockedAchievements()).toEqual([]);
    });
});
