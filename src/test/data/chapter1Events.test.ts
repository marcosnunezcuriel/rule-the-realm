import { describe, expect, it } from "vitest";

import { chapter1Events } from "../../data/chapters/chapter1/events";
import { getSpecialEventForDay } from "../../data/registries/eventRegistry";

import { getDayEvents } from "../../game/progression/getDayEvents";

const byId = new Map(
    chapter1Events.map((event) => [
        event.id,
        event,
    ])
);

describe("Acontecimientos del Capítulo I", () => {
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
            if (!event.requiresUnlock) {
                continue;
            }

            if (event.scene !== undefined) {
                expect(
                    getSpecialEventForDay(
                        event.day,
                        []
                    )
                ).toBeUndefined();

                expect(
                    getSpecialEventForDay(
                        event.day,
                        [event.id]
                    )?.id
                ).toBe(event.id);

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

    it("los desbloqueos conocidos corresponden a jornadas posteriores", () => {
        for (const event of chapter1Events) {
            const unlocks = [
                ...Object.values(
                    event.unlocks ?? {}
                ).flat(),

                ...(event.unlocksOnComplete ?? []),
            ];

            for (const id of unlocks) {
                const unlockedEvent = byId.get(id);

                if (unlockedEvent !== undefined) {
                    expect(
                        unlockedEvent.day
                    ).toBeGreaterThan(event.day);
                }
            }
        }
    });
});
