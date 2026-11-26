import type { AmbientTrack } from "./audio";

// Las pistas disponibles desde el comienzo
// no necesitan desbloquearse.
export type UnlockableAmbientTrack =
    Exclude<AmbientTrack, "birds">;

// Recompensas permanentes independientes de la partida.
export type GameReward = {
    kind: "music";
    track: UnlockableAmbientTrack;
};
