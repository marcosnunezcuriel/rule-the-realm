// Registra los escenarios especiales disponibles y sus configuraciones visuales.

import { joustScene } from "./special/joust";

import type { SpecialSceneDefinition } from "../../types/scene";

// Registro global de escenarios especiales.
export const specialSceneRegistry = {
    joust: joustScene,
} satisfies Record<string, SpecialSceneDefinition>;

// Identificadores inferidos directamente del registro.
export type SpecialSceneId =
    keyof typeof specialSceneRegistry;
