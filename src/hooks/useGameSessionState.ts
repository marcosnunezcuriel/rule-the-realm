import {
    useCallback,
    useMemo,
    useReducer,
} from "react";

import { getEventById } from "../data/events/eventRegistry";
import { createGameState } from "../game/state/createGameState";
import { gameReducer } from "../game/state/gameReducer";
import { loadGame } from "../storage/gameStorage";

import type { GameEvent } from "../types/events";
import type { MonarchRole } from "../types/monarch";
import type { AudiencePhase } from "../types/game";

// Conectar React con el estado centralizado de partida.
export function useGameSessionState(
    monarch: MonarchRole
) {
    const [state, dispatch] = useReducer(
        gameReducer,
        monarch,
        (role) => createGameState(
            role,
            loadGame()
        )
    );

    const dayEventIds = state.progress.dayEventIds;

    // Recuperar los acontecimientos del registro central
    // únicamente cuando cambia la lista de la jornada.
    const dayEvents = useMemo(() => {
        return dayEventIds
            .map((id) => getEventById(id))
            .filter((event): event is GameEvent => {
                return event !== undefined;
            });
    }, [dayEventIds]);

    const setPhase = useCallback(
        (phase: AudiencePhase) => {
            dispatch({
                type: "SET_PHASE",
                phase,
            });
        },
        [dispatch]
    );

    return {
        state,
        dispatch,
        dayEvents,
        setPhase,
    };
}
