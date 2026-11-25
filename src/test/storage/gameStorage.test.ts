// @vitest-environment jsdom

import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    SAVE_KEY,
    clearSavedGame,
    hasSavedGame,
    loadGame,
    saveGame,
} from "../../storage/gameStorage";

import type { SaveGame } from "../../types/saveGame";

import { createStats } from "../helpers/createStats";

function createSave(): SaveGame {
    return {
        monarch: "king",
        day: 1,
        screen: "scene",
        stats: createStats(),
        dayStartStats: createStats(),
        closingStats: null,
        audienceIndex: 0,
        dayEventIds: [
            "1", "2", "3", "4", "5",
            "6", "7", "8", "9", "10",
        ],
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

    it("comienza sin partida guardada", () => {
        expect(loadGame()).toBeNull();
        expect(hasSavedGame()).toBe(false);
    });

    it("guarda y recupera una partida del rey", () => {
        const save = createSave();

        saveGame(save);

        expect(hasSavedGame()).toBe(true);
        expect(loadGame()).toEqual(save);
        expect(loadGame()?.monarch).toBe("king");
    });

    it("guarda y recupera una partida de la reina", () => {
        const save: SaveGame = {
            ...createSave(),
            monarch: "queen",
        };

        saveGame(save);

        expect(loadGame()).toEqual(save);
        expect(loadGame()?.monarch).toBe("queen");
    });

    it("elimina una partida", () => {
        saveGame(createSave());

        clearSavedGame();

        expect(hasSavedGame()).toBe(false);
        expect(loadGame()).toBeNull();
    });

    it("rechaza JSON incorrecto", () => {
        window.localStorage.setItem(
            SAVE_KEY,
            "{contenido-invalido"
        );

        expect(loadGame()).toBeNull();
        expect(window.localStorage.getItem(SAVE_KEY)).toBeNull();
    });

    it("rechaza un protagonista desconocido", () => {
        storeRaw({
            ...createSave(),
            monarch: "dragon",
        });

        expect(loadGame()).toBeNull();
    });

    it("rechaza estadísticas incompletas", () => {
        storeRaw({
            ...createSave(),
            stats: {
                gold: 100,
            },
        });

        expect(loadGame()).toBeNull();
    });

    it("rechaza pantallas desconocidas", () => {
        storeRaw({
            ...createSave(),
            screen: "pantalla-desconocida",
        });

        expect(loadGame()).toBeNull();
    });

    it("rechaza modificadores desconocidos", () => {
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

    it("rechaza informes de modificadores incorrectos", () => {
        storeRaw({
            ...createSave(),
            modifierReport: {
                appliedIds: ["unknown-modifier"],
                totalChanges: {},
            },
        });

        expect(loadGame()).toBeNull();
    });

    it("rechaza audiencias inexistentes", () => {
        storeRaw({
            ...createSave(),
            dayEventIds: ["1", "unknown-event"],
        });

        expect(loadGame()).toBeNull();
    });

    it("rechaza audiencias de otro día", () => {
        storeRaw({
            ...createSave(),
            dayEventIds: ["11"],
        });

        expect(loadGame()).toBeNull();
    });

    it("rechaza audiencias duplicadas", () => {
        storeRaw({
            ...createSave(),
            dayEventIds: ["1", "1"],
        });

        expect(loadGame()).toBeNull();
    });

    it("conserva desbloqueos de capítulos futuros", () => {
        const save: SaveGame = {
            ...createSave(),
            unlockedEventIds: [
                "chapter2-bankers-claim",
                "chapter2-hospitals",
            ],
        };

        saveGame(save);

        expect(loadGame()).toEqual(save);
    });

    it("rechaza índices de audiencia fuera de rango", () => {
        storeRaw({
            ...createSave(),
            audienceIndex: 99,
        });

        expect(loadGame()).toBeNull();
    });

    it("conserva el progreso del epílogo", () => {
        const save: SaveGame = {
            ...createSave(),
            day: 7,
            screen: "chapter-ending",
            dayEventIds: [
                "41", "42", "43", "44", "45", "46",
            ],
            chapterEndingParagraphIndex: 2,
        };

        saveGame(save);

        expect(loadGame()).toEqual(save);

        expect(
            loadGame()?.chapterEndingParagraphIndex
        ).toBe(2);
    });

    it("rechaza índices de epílogo inexistentes", () => {
        storeRaw({
            ...createSave(),
            day: 7,
            screen: "chapter-ending",
            chapterEndingParagraphIndex: 99,
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

    it("rechaza GameOver sin motivo de derrota", () => {
        storeRaw({
            ...createSave(),
            screen: "gameover",
            gameOverReason: null,
        });

        expect(loadGame()).toBeNull();
    });

    it("recupera una derrota nocturna del día 8", () => {
        const save: SaveGame = {
            ...createSave(),
            day: 8,
            stats: createStats({ gold: -50 }),
            dayStartStats: createStats({ gold: -50 }),
            dayEventIds: [],
            audienceIndex: 0,
            specialAudience: "defeat",
            gameOverReason: "bankruptcy",
        };

        saveGame(save);

        expect(loadGame()).toEqual(save);
    });

    it("recupera una audiencia de deuda saldada", () => {
        const save: SaveGame = {
            ...createSave(),
            stats: createStats({ gold: 10 }),
            activeModifierIds: ["indebted"],
            specialAudience: "treasury-recovery",
        };

        saveGame(save);

        expect(loadGame()).toEqual(save);
    });

    it("conserva el descanso nocturno al recargar", () => {
        const save: SaveGame = {
            ...createSave(),
            screen: "sleep",
            dayClosed: true,
            isClosing: true,
            closingStats: createStats(),
        };

        saveGame(save);

        const recovered = loadGame();

        expect(recovered?.screen).toBe("sleep");
        expect(recovered?.dayClosed).toBe(true);
    });
});
