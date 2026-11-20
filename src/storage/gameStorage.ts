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

        if (!isSaveGame(parsed)) {
            discardInvalidSave();
            return null;
        }

        return parsed;
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
