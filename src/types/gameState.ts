import type { AudiencePhase } from "./game";
import type { SaveGame } from "./saveGame";

// Estado completo de una partida en ejecución.
export type GameState = {
    // Información necesaria para recuperar la partida.
    progress: SaveGame;

    // Fase visual de la audiencia actual.
    // No se almacena en el guardado.
    phase: AudiencePhase;
};
