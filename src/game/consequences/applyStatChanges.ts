import type { KingdomValues, StatChanges } from "../../types/stats";

export function applyStatChanges(
    current: KingdomValues,
    changes: StatChanges
): KingdomValues {
    return {
        gold: current.gold + (changes.gold ?? 0),
        prestige: current.prestige + (changes.prestige ?? 0),
        faith: current.faith + (changes.faith ?? 0),
        population: current.population + (changes.population ?? 0),
        army: current.army + (changes.army ?? 0),
    };
}
