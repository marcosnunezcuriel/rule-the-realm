import { describe, expect, it } from "vitest";

import { chapter1Events } from "../../data/events/chapter1";
import { getDayEvents } from "../../game/getDayEvents";

const byId = new Map(
    chapter1Events.map((event) => [
        event.id,
        event,
    ])
);

describe("Acontecimientos del Capítulo I", () => {
    it("contiene 69 acontecimientos sin duplicados", () => {
        expect(chapter1Events).toHaveLength(69);
        expect(byId.size).toBe(69);
    });

    it("comienza con las diez audiencias del primer día", () => {
        expect(
            getDayEvents(1, []).map((event) => event.id)
        ).toEqual(
            Array.from(
                { length: 10 },
                (_, index) => String(index + 1)
            )
        );
    });

    it("conserva las rutas de los eventos iniciales", () => {
        expect(byId.get("2")?.unlocks?.yes).toEqual([
            "2.1",
        ]);

        expect(byId.get("3")?.unlocks?.no).toEqual([
            "3.1",
        ]);
    });

    it("requiere desbloquear los eventos condicionados", () => {
        for (const event of chapter1Events) {
            if (
                !event.requiresUnlock ||
                event.id === "2.1"
            ) {
                continue;
            }

            expect(
                getDayEvents(event.day, []).some(
                    (item) => item.id === event.id
                )
            ).toBe(false);

            expect(
                getDayEvents(event.day, [event.id]).some(
                    (item) => item.id === event.id
                )
            ).toBe(true);
        }
    });

    it("separa los desenlaces de la crisis del trigo", () => {
        expect(byId.get("15")?.unlocks?.yes).toEqual([
            "15.1",
        ]);

        expect(byId.get("15")?.unlocks?.no).toEqual([
            "15.2",
        ]);
    });

    it("activa la Fiebre negra al completar su evento", () => {
        expect(
            byId.get("45")?.addModifiersOnComplete
        ).toEqual(["black-fever"]);
    });

    it("activa y retira el circo en los momentos previstos", () => {
        expect(
            byId.get("11")?.addModifiers?.yes
        ).toEqual(["traveling-circus"]);

        expect(
            byId.get("11.2")?.removeModifiersOnComplete
        ).toEqual(["traveling-circus"]);
    });

    it("todos los eventos condicionados tienen una ruta de desbloqueo", () => {
        const unlocks = chapter1Events.flatMap((event) => [
            ...Object.values(event.unlocks ?? {}).flat(),
            ...(event.unlocksOnComplete ?? []),
        ]);

        for (const event of chapter1Events) {
            if (event.requiresUnlock) {
                expect(unlocks).toContain(event.id);
            }
        }
    });

    it("registra la ayuda del hermano como condición narrativa", () => {
        const event = byId.get("8");

        expect(
            event?.addStoryFlags?.yes
        ).toEqual(["brother-is-advisor"]);

        expect(
            event?.addStoryFlags?.no ?? []
        ).toEqual([]);

        expect(
            event?.unlocks?.yes ?? []
        ).toEqual([]);
    });
});
