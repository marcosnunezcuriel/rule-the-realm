import type { GameScreen } from "../types/game";
import type { GameAction } from "./state/gameReducer";

// Acciones que producen un cambio de pantalla.
type ScreenAction = Extract<
    GameAction,
    {
        type:
            | "SET_SCREEN"
            | "START_DAY"
            | "FINISH_SPECIAL_SCENE";
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
        action.type === "SET_SCREEN"
            ? action.screen
            : null;

    return {
        action,

        fullScreen:
            target === "chapter-ending" ||
            currentScreen === "chapter-ending" ||
            target === "sleep" ||
            currentScreen === "sleep",

        // Comenzar otra jornada o terminar un escenario
        // especial siempre conduce a una nueva audiencia.
        enterAudience:
            action.type !== "SET_SCREEN" ||
            target === "scene" ||
            target === "special-scene",
    };
}
