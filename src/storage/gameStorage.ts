import type { SaveGameV1 } from "../types/saveGame";

const SAVE_KEY = "rule-the-realm.save.v1";

const STAT_KEYS = new Set([
    "gold",
    "prestige",
    "faith",
    "population",
    "army",
]);

const GAME_OVER_REASONS = new Set([
    "bankruptcy",
    "abandoned",
    "invasion",
    "religious-crisis",
    "overthrown",
]);

function isRecord(
    value: unknown
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

function isStringArray(value: unknown): value is string[] {
    return (
        Array.isArray(value) &&
        value.every((item) => typeof item === "string")
    );
}

function isStats(value: unknown): boolean {
    if (!isRecord(value)) {
        return false;
    }

    return [...STAT_KEYS].every((key) => {
        const amount = value[key];

        return (
            typeof amount === "number" &&
            Number.isFinite(amount)
        );
    });
}

function isChanges(value: unknown): boolean {
    return (
        isRecord(value) &&
        Object.entries(value).every(([key, amount]) => {
            return (
                STAT_KEYS.has(key) &&
                typeof amount === "number" &&
                Number.isFinite(amount)
            );
        })
    );
}

function isSaveGame(value: unknown): value is SaveGameV1 {
    if (!isRecord(value)) {
        return false;
    }

    const report = value.modifierReport;

    return (
        value.version === 1 &&
        Number.isInteger(value.day) &&
        Number(value.day) >= 1 &&
        (
            value.screen === "scene" ||
            value.screen === "summary" ||
            value.screen === "gameover"
        ) &&
        isStats(value.stats) &&
        isStats(value.dayStartStats) &&
        (
            value.closingStats === null ||
            isStats(value.closingStats)
        ) &&
        Number.isInteger(value.audienceIndex) &&
        Number(value.audienceIndex) >= 0 &&
        isStringArray(value.dayEventIds) &&
        typeof value.isClosing === "boolean" &&
        typeof value.dayClosed === "boolean" &&
        (
            value.selectedDecision === null ||
            value.selectedDecision === "yes" ||
            value.selectedDecision === "no"
        ) &&
        isStringArray(value.unlockedEventIds) &&
        isStringArray(value.activeModifierIds) &&
        isStringArray(value.sceneModifierIds) &&
        isRecord(report) &&
        isStringArray(report.appliedIds) &&
        isChanges(report.totalChanges) &&
        (
            value.specialAudience === null ||
            value.specialAudience === "treasury-warning" ||
            value.specialAudience === "defeat"
        ) &&
        typeof value.pendingTreasuryWarning === "boolean" &&
        (
            value.gameOverReason === null ||
            (
                typeof value.gameOverReason === "string" &&
                GAME_OVER_REASONS.has(value.gameOverReason)
            )
        )
    );
}

// Recuperar una partida del navegador.
export function loadGame(): SaveGameV1 | null {
    try {
        const raw = window.localStorage.getItem(SAVE_KEY);

        if (raw === null) {
            return null;
        }

        const parsed: unknown = JSON.parse(raw);

        return isSaveGame(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

// Guardar el estado actual.
export function saveGame(game: SaveGameV1): void {
    try {
        window.localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(game)
        );
    } catch {
        console.warn(
            "No se pudo guardar la partida en este navegador."
        );
    }
}

// Eliminar la partida guardada.
export function clearSavedGame(): void {
    try {
        window.localStorage.removeItem(SAVE_KEY);
    } catch {
        console.warn(
            "No se pudo eliminar la partida guardada."
        );
    }
}

// Comprobar si existe una partida válida.
export function hasSavedGame(): boolean {
    return loadGame() !== null;
}
