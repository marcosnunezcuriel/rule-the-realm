// Define las estadísticas del reino y sus posibles variaciones.

export type KingdomValues = {
    gold: number;
    prestige: number;
    faith: number;
    population: number;
    army: number;
};

export type StatChanges = Partial<KingdomValues>;
