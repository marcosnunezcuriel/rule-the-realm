import { isSaveGame } from "./validateSave";

import type { SaveGame } from "../types/saveGame";

// Clave única y estable para el guardado de partidas.
export const SAVE_KEY = "rule-the-realm.save";

// Eliminar un guardado que no pueda recuperarse.
function discardInvalidSave(): void {
    try {
        window.localStorage.removeItem(SAVE_KEY);
    } catch {
        console.warn(
            "No se pudo eliminar un guardado incompatible."
        );
    }
}

// Recuperar una partida válida del navegador.
export function loadGame(): SaveGame | null {
    try {
        const raw = window.localStorage.getItem(SAVE_KEY);

        if (raw === null) {
            return null;
        }

        const parsed: unknown = JSON.parse(raw);

        // Migración de partidas anteriores a la elección
        // de personaje. En ellas gobernaba siempre el rey.
        const migrated = (
            typeof parsed === "object" &&
            parsed !== null &&
            !Array.isArray(parsed) &&
            !Object.hasOwn(parsed, "monarch")
        )
            ? {
                ...parsed,
                monarch: "king",
            }
            : parsed;

        if (!isSaveGame(migrated)) {
            discardInvalidSave();
            return null;
        }

        // Guardar el formato actualizado una sola vez.
        if (migrated !== parsed) {
            saveGame(migrated);
        }

        return migrated;
    } catch {
        // Si el contenido es incorrecto o no se puede leer,
        // descartamos el guardado para evitar errores futuros.
        discardInvalidSave();
        return null;
    }
}

// Guardar el estado actual.
export function saveGame(game: SaveGame): void {
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
