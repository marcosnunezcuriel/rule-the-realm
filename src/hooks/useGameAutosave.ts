import { useEffect } from "react";

import { saveGame } from "../storage/gameStorage";

import type { SaveGame } from "../types/saveGame";

// Guardar únicamente cuando cambia el progreso persistente.
export function useGameAutosave(
    progress: SaveGame
): void {
    useEffect(() => {
        saveGame(progress);
    }, [progress]);
}
