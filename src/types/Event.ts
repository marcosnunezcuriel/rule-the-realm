import type { Effects } from "./Effects";
import type { FutureEvent } from "./FutureEvent";

export interface Event {
    id: string;
    characterId: string;

    pages: string[];

    yesResultPages?: string[];
    yesEffects?: Effects;
    yesFutureEvent?: FutureEvent;
    yesAddedModifierId?: string;
    yesRemovedModifierId?: string;

    noResultPages?: string[];
    noEffects?: Effects;
    noFutureEvent?: FutureEvent;
    noAddedModifierId?: string;
    noRemovedModifierId?: string;
}
