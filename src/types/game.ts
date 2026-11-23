// Fases de entrada, diálogo y salida de una audiencia.
export type AudiencePhase =
    | "entering"
    | "speaking"
    | "exiting"
    | "transitioning"
    | "waiting";

// Pantallas internas de una partida.
export type GameScreen =
    | "scene"
    | "sleep"
    | "summary"
    | "gameover"
    | "chapter-ending";

// Audiencias extraordinarias de la Consejera Real.
export type SpecialAudience =
    | "treasury-warning"
    | "treasury-recovery"
    | "defeat"
    | null;

// Etapas comunes de los fundidos entre pantallas.
export type FadeStage =
    | "idle"
    | "darkening"
    | "lightening";
