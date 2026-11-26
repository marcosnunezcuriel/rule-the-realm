import type { StoryFlagId } from "../data/narrative/storyFlags";

import type { Decision } from "./dialogue";
import type {
    GameScreen,
    SpecialAudience,
} from "./game";
import type { GameOverReason } from "./gameOver";
import type {
    DailyModifierReport,
    ModifierId,
} from "./modifiers";
import type { MonarchRole } from "./monarch";
import type { KingdomValues } from "./stats";

// Estado persistente necesario para recuperar una partida.
// No incluye las fases temporales de las animaciones.
export type SaveGame = {
    monarch: MonarchRole;
    day: number;
    screen: GameScreen;

    // Progreso del jugador en el epílogo del capítulo.
    chapterEndingParagraphIndex: number;

    stats: KingdomValues;
    // Estadísticas al comenzar la jornada, utilizadas para calcular el balance diario.
    dayStartStats: KingdomValues;
    // Estadísticas inmediatamente anteriores a la aplicación de los efectos nocturnos.
    closingStats: KingdomValues | null;

    audienceIndex: number;
    // Audiencias disponibles para la jornada actual.
    dayEventIds: string[];

    // Acontecimiento especial de la jornada en curso.
    specialEvent: {
        id: string;
        completed: boolean;
    } | null;

    isClosing: boolean;
    // Impide volver a aplicar las consecuencias nocturnas al recuperar la partida.
    dayClosed: boolean;

    selectedDecision: Decision | null;

    unlockedEventIds: string[];
    // Condiciones narrativas que pueden alterar acontecimientos y escenarios futuros.
    storyFlags: StoryFlagId[];
    
    activeModifierIds: ModifierId[];
    // Modificadores fijados al comenzar el día para conservar sus fondos durante toda la jornada.
    sceneModifierIds: ModifierId[];

    modifierReport: DailyModifierReport;

    specialAudience: SpecialAudience;
    pendingTreasuryWarning: boolean;
    gameOverReason: GameOverReason | null;
};
