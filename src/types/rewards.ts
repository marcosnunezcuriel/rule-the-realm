import type { ItemRewardId } from "../data/registries/itemRegistry";

import type { AmbientTrack } from "./audio";

// Las pistas disponibles desde el comienzo
// no necesitan desbloquearse.
export type UnlockableAmbientTrack =
    Exclude<AmbientTrack, "birds">;

// Recompensas permanentes independientes de la partida.
export type GameReward =
    | {
        kind: "music";
        track: UnlockableAmbientTrack;
    }
    | {
        kind: "item";
        itemId: ItemRewardId;

        // Objeto alternativo cuando gobierna la reina.
        queenItemId?: ItemRewardId;
    };
