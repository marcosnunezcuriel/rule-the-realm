import { describe, expect, it } from "vitest";

import { getDayEvents } from "../../game/getDayEvents";
import {
    getEventById,
    getEventsForDay,
} from "../../data/events/eventRegistry";

describe("Selección de eventos por día", () => {
    it("muestra las dos audiencias iniciales del día 1", () => {
        const events = getDayEvents(1, []);

        expect(events.map((event) => event.id)).toEqual([
            "1",
            "2",
        ]);
    });

    it("no muestra eventos condicionados sin desbloqueos", () => {
        const events = getDayEvents(2, []);

        expect(events.map((event) => event.id)).toEqual([
            "6",
        ]);
    });

    it("incluye los eventos desbloqueados en orden", () => {
        const events = getDayEvents(
            2,
            ["2.1", "2.2"]
        );

        expect(events.map((event) => event.id)).toEqual([
            "2.1",
            "2.2",
            "6",
        ]);
    });

    it("permite recuperar la despedida del circo", () => {
        const events = getDayEvents(7, ["6.2"]);

        expect(events.map((event) => event.id)).toEqual([
            "6.2",
        ]);
    });

    it("no presenta la despedida sin desbloquearla", () => {
        expect(getDayEvents(7, [])).toEqual([]);
    });

    it("no inventa eventos para días sin contenido", () => {
        expect(getDayEvents(3, [])).toEqual([]);
    });

    it("recupera un evento por su identificador", () => {
        const event = getEventById("6.2");

        expect(event?.day).toBe(7);
        expect(event?.dialogue.speaker).toBe(
            "Director del circo"
        );
    });

    it("devuelve undefined si un identificador no existe", () => {
        expect(getEventById("evento-inexistente")).toBeUndefined();
    });

    it("el registro conserva todos los eventos del día 2", () => {
        const events = getEventsForDay(2);

        expect(events.map((event) => event.id)).toEqual([
            "2.1",
            "2.2",
            "6",
        ]);
    });
});
