export interface Effects {
    gold?: number;
    population?: number;
    army?: number;
    faith?: number;
    prestige?: number;
}

export interface FutureEvent {
    eventId: string;
    daysLater: number;
}

export interface Event {
    id: string;
    characterId: string;

    pages: string[];

    yesResultPages: string[];
    yesEffects: Effects;
    yesFutureEvents: FutureEvent[];

    noResultPages: string[];
    noEffects: Effects;
    noFutureEvents: FutureEvent[];
}
