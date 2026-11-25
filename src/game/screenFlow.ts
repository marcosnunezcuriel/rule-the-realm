import type { GameScreen } from "../types/game";
import type { GameAction } from "./state/gameReducer";

// Acciones que producen un cambio de pantalla.
type ScreenAction = Extract<
    GameAction,
    {
        type:
            | "SET_SCREEN"
            | "START_DAY"
            | "FINISH_JOUST";
    }
>;

export type ScreenTransitionPlan = {
    action: ScreenAction;
    fullScreen: boolean;
    enterAudience: boolean;
};

// Preparar una transición sin ejecutarla.
export function getScreenTransition(
    currentScreen: GameScreen,
    action: ScreenAction
): ScreenTransitionPlan {
    const target =
        action.type === "START_DAY"
            ? action.target
            : action.type === "FINISH_JOUST"
                ? "scene"
                : action.screen;

    return {
        action,

        // Mantener el comportamiento de los fundidos.
        fullScreen:
            target === "chapter-ending" ||
            currentScreen === "chapter-ending" ||
            target === "sleep" ||
            currentScreen === "sleep",

        // El visitante entra al finalizar el fundido.
        enterAudience:
            target === "scene" ||
            target === "joust",
    };
}
