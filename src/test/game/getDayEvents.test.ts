import { describe, expect, it } from "vitest";

import { getDayEvents } from "../../game/getDayEvents";

import {
    getEventById,
    getEventsForDay,
    getSpecialEventForDay,
} from "../../data/events/eventRegistry";

describe("Selección de eventos por jornada", () => {
    it("el día 1 contiene diez audiencias", () => {
        expect(
            getDayEvents(1, []).map((event) => event.id)
        ).toEqual([
            "1", "2", "3", "4", "5",
            "6", "7", "8", "9", "10",
        ]);
    });

    it("el día 2 contiene seis eventos habituales", () => {
        expect(
            getDayEvents(2, []).map((event) => event.id)
        ).toEqual([
            "11", "12", "13",
            "14", "15", "16",
        ]);
    });

    it("añade los eventos previamente desbloqueados", () => {
        expect(
            getDayEvents(
                2,
                ["2.1", "3.1"]
            ).map((event) => event.id)
        ).toEqual([
            "3.1", "11", "12",
            "13", "14", "15", "16",
        ]);
    });

    it("muestra la despedida del circo solo si corresponde", () => {
        expect(
            getDayEvents(7, []).some(
                (event) => event.id === "11.2"
            )
        ).toBe(false);

        expect(
            getDayEvents(7, ["11.2"])[0].id
        ).toBe("11.2");
    });

    it("reconoce los eventos habituales del día 3", () => {
        expect(
            getDayEvents(3, []).map((event) => event.id)
        ).toEqual([
            "17", "18", "19",
            "20", "21", "22",
        ]);
    });

    it("permite consultar un acontecimiento por su ID", () => {
        expect(getEventById("11.2")?.day).toBe(7);

        expect(
            getEventById("evento-inexistente")
        ).toBeUndefined();
    });

    it("mantiene el registro central de eventos del día 2", () => {
        expect(
            getEventsForDay(2).map((event) => event.id)
        ).toEqual([
            "3.1", "11", "12",
            "13", "14", "15", "16",
        ]);
    });

    it("separa los acontecimientos especiales de las audiencias normales", () => {
        expect(
            getEventById("2.1")?.day
        ).toBe(2);

        expect(
            getSpecialEventForDay(2, [])
        ).toBeUndefined();

        expect(
            getSpecialEventForDay(2, ["2.1"])?.id
        ).toBe("2.1");

        expect(
            getSpecialEventForDay(3, ["2.1"])
        ).toBeUndefined();

        expect(
            getDayEvents(2, ["2.1"]).some(
                (event) => event.id === "2.1"
            )
        ).toBe(false);
    });
});
