import { describe, expect, it } from "vitest";

import { getDayEvents } from "../../game/getDayEvents";
import {
    getEventById,
    getEventsForDay,
} from "../../data/events/eventRegistry";

describe("Selección de eventos por día", () => {
    it("el día 1 comienza con diez audiencias", () => {
        expect(getDayEvents(1, []).map((event) => event.id)).toEqual(
            ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
        );
    });

    it("el día 2 incluye sus seis eventos habituales", () => {
        expect(getDayEvents(2, []).map((event) => event.id)).toEqual(
            ["11", "12", "13", "14", "15", "16"]
        );
    });

    it("el día 2 incorpora el caballero y la tabernera si corresponden", () => {
        expect(getDayEvents(2, ["2.1", "3.1"]).map((event) => event.id)).toEqual(
            ["2.1", "3.1", "11", "12", "13", "14", "15", "16"]
        );
    });

    it("presenta la despedida del circo solo si se ha desbloqueado", () => {
        expect(getDayEvents(7, []).some((event) => event.id === "11.2")).toBe(false);
        expect(getDayEvents(7, ["11.2"])[0].id).toBe("11.2");
    });

    it("el día 3 tiene seis audiencias habituales", () => {
        expect(getDayEvents(3, []).map((event) => event.id)).toEqual(
            ["17", "18", "19", "20", "21", "22"]
        );
    });

    it("el registro recupera la despedida del circo", () => {
        expect(getEventById("11.2")?.day).toBe(7);
        expect(getEventById("11.2")?.dialogue.speaker).toBe("Director del circo");
    });

    it("devuelve undefined para identificadores inexistentes", () => {
        expect(getEventById("evento-inexistente")).toBeUndefined();
    });

    it("el registro central conserva los ocho eventos posibles del día 2", () => {
        expect(getEventsForDay(2).map((event) => event.id)).toEqual(
            ["2.1", "3.1", "11", "12", "13", "14", "15", "16"]
        );
    });
});
