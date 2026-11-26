import { initialKingdomValues } from "../../game/state/initialState";

import type { KingdomValues } from "../../types/stats";

// Crear un reino para las pruebas, permitiendo modificar
// únicamente las estadísticas necesarias en cada caso.
export function createStats(
    changes: Partial<KingdomValues> = {}
): KingdomValues {
    return {
        ...initialKingdomValues,
        ...changes,
    };
}
