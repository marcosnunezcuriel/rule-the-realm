import type { Decision, DialogueEvent } from "./dialogue";
import type { StatChanges } from "./stats";

export type GameEvent = {
    id: string;
    day: number;
    order: number;

    image: string;
    dialogue: DialogueEvent;

    effects: Record<Decision, StatChanges>;

    requiresUnlock?: boolean;

    unlocks?: Partial<Record<Decision, string[]>>;
};
