// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";

import {
    SAVE_KEY,
    clearSavedGame,
    hasSavedGame,
    loadGame,
    saveGame,
} from "../../storage/gameStorage";

import type { SaveGame } from "../../types/saveGame";

import { createStats } from "../helpers/createStats";

// Crear una partida válida para las pruebas.
function createSave(): SaveGame {
    return {
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

// Introducir datos directamente en el almacenamiento temporal.
// Permite comprobar valores incorrectos que TypeScript no aceptaría.
function storeRaw(value: unknown): void {
    window.localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(value)
    );
}

describe("Guardado de partidas", () => {
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

    it("rechaza y elimina un JSON incorrecto", () => {
        window.localStorage.setItem(
            SAVE_KEY,
            "{contenido-invalido"
        );

        expect(loadGame()).toBeNull();
        expect(window.localStorage.getItem(SAVE_KEY)).toBeNull();
    });

    it("rechaza estadísticas incompletas", () => {
        storeRaw({
            ...createSave(),
            stats: {
                gold: 100,
            },
        });

        expect(loadGame()).toBeNull();
        expect(window.localStorage.getItem(SAVE_KEY)).toBeNull();
    });

    it("rechaza una pantalla desconocida", () => {
        storeRaw({
            ...createSave(),
            screen: "pantalla-desconocida",
        });

        expect(loadGame()).toBeNull();
    });

    it("rechaza modificadores activos que no existen", () => {
        storeRaw({
            ...createSave(),
            activeModifierIds: ["unknown-modifier"],
        });

        expect(loadGame()).toBeNull();
    });

    it("rechaza modificadores visuales desconocidos", () => {
        storeRaw({
            ...createSave(),
            sceneModifierIds: ["unknown-modifier"],
        });

        expect(loadGame()).toBeNull();
    });

    it("rechaza informes con modificadores desconocidos", () => {
        storeRaw({
            ...createSave(),
            modifierReport: {
                appliedIds: ["unknown-modifier"],
                totalChanges: {},
            },
        });

        expect(loadGame()).toBeNull();
    });

    it("rechaza audiencias que no existen", () => {
        storeRaw({
            ...createSave(),
            dayEventIds: ["1", "unknown-event"],
        });

        expect(loadGame()).toBeNull();
    });

    it("rechaza audiencias que pertenecen a otro día", () => {
        storeRaw({
            ...createSave(),
            dayEventIds: ["6"],
        });

        // El evento 6 pertenece al día 2, no al día 1.
        expect(loadGame()).toBeNull();
    });

    it("rechaza audiencias duplicadas en la jornada", () => {
        storeRaw({
            ...createSave(),
            dayEventIds: ["1", "1"],
        });

        expect(loadGame()).toBeNull();
    });

    it("permite desbloqueos futuros aún no implementados", () => {
        const save: SaveGame = {
            ...createSave(),
            unlockedEventIds: ["6.1", "6.2"],
        };

        saveGame(save);

        expect(loadGame()).toEqual(save);
    });

    it("rechaza un índice de audiencia fuera de rango", () => {
        storeRaw({
            ...createSave(),
            audienceIndex: 99,
        });

        expect(loadGame()).toBeNull();
    });

    it("conserva el progreso de lectura del epílogo", () => {
        const save: SaveGame = {
            ...createSave(),
            day: 7,
            screen: "chapter-ending",
            dayEventIds: ["6.2"],
            chapterEndingParagraphIndex: 2,
        };

        saveGame(save);

        expect(loadGame()).toEqual(save);
        expect(loadGame()?.chapterEndingParagraphIndex).toBe(2);
    });

    it("rechaza un índice de párrafo inexistente", () => {
        storeRaw({
            ...createSave(),
            day: 7,
            screen: "chapter-ending",
            dayEventIds: ["6.2"],
            chapterEndingParagraphIndex: 99,
        });

        expect(loadGame()).toBeNull();
    });

    it("rechaza guardados sin índice de párrafo", () => {
        storeRaw({
            ...createSave(),
            chapterEndingParagraphIndex: undefined,
        });

        expect(loadGame()).toBeNull();
    });

    it("rechaza anuncios de derrota sin motivo", () => {
        storeRaw({
            ...createSave(),
            specialAudience: "defeat",
            gameOverReason: null,
        });

        expect(loadGame()).toBeNull();
    });

    it("rechaza GameOver cuando no hay motivo de derrota", () => {
        storeRaw({
            ...createSave(),
            screen: "gameover",
            gameOverReason: null,
        });

        expect(loadGame()).toBeNull();
    });

    it("permite recuperar la derrota nocturna del día 8", () => {
        const save: SaveGame = {
            ...createSave(),
            day: 8,
            stats: createStats({ gold: -50 }),
            dayStartStats: createStats({ gold: -50 }),
            dayEventIds: [],
            audienceIndex: 0,
            isClosing: false,
            specialAudience: "defeat",
            gameOverReason: "bankruptcy",
        };

        saveGame(save);

        expect(loadGame()).toEqual(save);
    });
});
