// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";

import {
    clearSavedGame,
    hasSavedGame,
    loadGame,
    saveGame,
} from "../../storage/gameStorage";

import type { SaveGameV1 } from "../../types/saveGame";

import { createStats } from "../helpers/createStats";

const SAVE_KEY = "rule-the-realm.save.v1";

// Crear una partida válida para las pruebas.
function createSave(): SaveGameV1 {
    return {
        version: 1,
        day: 1,
        screen: "scene",
        stats: createStats(),
        dayStartStats: createStats(),
        closingStats: null,
        audienceIndex: 0,
        dayEventIds: ["1", "2"],
        isClosing: false,
        dayClosed: false,
        selectedDecision: null,
        unlockedEventIds: [],
        activeModifierIds: [],
        sceneModifierIds: [],
        modifierReport: {
            appliedIds: [],
            totalChanges: {},
        },
        specialAudience: null,
        pendingTreasuryWarning: false,
        gameOverReason: null,
        chapterEndingParagraphIndex: 0,
    };
}

describe("Guardado de partidas", () => {
    // Cada prueba comienza con el almacenamiento vacío.
    beforeEach(() => {
        window.localStorage.clear();
    });

    it("detecta que no existe una partida guardada", () => {
        expect(loadGame()).toBeNull();
        expect(hasSavedGame()).toBe(false);
    });

    it("guarda y recupera una partida válida", () => {
        const save = createSave();

        saveGame(save);

        expect(hasSavedGame()).toBe(true);
        expect(loadGame()).toEqual(save);
    });

    it("elimina una partida guardada", () => {
        saveGame(createSave());

        clearSavedGame();

        expect(hasSavedGame()).toBe(false);
        expect(loadGame()).toBeNull();
    });

    it("rechaza un guardado con JSON incorrecto", () => {
        window.localStorage.setItem(
            SAVE_KEY,
            "{contenido-invalido"
        );

        expect(loadGame()).toBeNull();
        expect(hasSavedGame()).toBe(false);
    });

    it("rechaza estadísticas incompletas", () => {
        const invalidSave = {
            ...createSave(),
            stats: {
                gold: 100,
            },
        };

        window.localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(invalidSave)
        );

        expect(loadGame()).toBeNull();
    });

    it("rechaza una pantalla que no existe", () => {
        const invalidSave = {
            ...createSave(),
            screen: "pantalla-desconocida",
        };

        window.localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(invalidSave)
        );

        expect(loadGame()).toBeNull();
    });

    it("conserva el progreso de lectura del epílogo", () => {
        const save: SaveGameV1 = {
            ...createSave(),
            day: 7,
            screen: "chapter-ending",
            chapterEndingParagraphIndex: 2,
        };

        saveGame(save);

        expect(loadGame()).toEqual(save);
        expect(loadGame()?.chapterEndingParagraphIndex).toBe(2);
    });
});
