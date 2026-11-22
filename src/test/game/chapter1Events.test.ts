import { describe, expect, it } from "vitest";

import { chapter1Events } from "../../data/events/chapter1";
import { getDayEvents } from "../../game/getDayEvents";

const byId = new Map(chapter1Events.map((event) => [event.id, event]));

describe("Capítulo I definitivo", () => {
    it("contiene los 68 acontecimientos, sin identificadores duplicados", () => {
        expect(chapter1Events).toHaveLength(68);
        expect(byId.size).toBe(68);
    });

    it("contiene los diez acontecimientos iniciales del día 1", () => {
        expect(getDayEvents(1, []).map((event) => event.id)).toEqual(
            Array.from({ length: 10 }, (_, index) => String(index + 1))
        );
    });

    it("distingue correctamente al campeón de la tabernera", () => {
        expect(byId.get("2.1")?.dialogue.speaker).toBe("Caballero campeón");
        expect(byId.get("3.1")?.dialogue.speaker).toBe("Tabernera");
        expect(byId.get("2")?.unlocks?.yes).toEqual(["2.1"]);
        expect(byId.get("3")?.unlocks?.no).toEqual(["3.1"]);
    });

    it("las audiencias derivadas se desbloquean únicamente por decisiones", () => {
        for (const event of chapter1Events.filter((event) => event.requiresUnlock)) {
            expect(getDayEvents(event.day, []).some((item) => item.id === event.id)).toBe(false);
            expect(getDayEvents(event.day, [event.id]).some((item) => item.id === event.id)).toBe(true);
        }
    });

    it("los dos desenlaces de la crisis del trigo no pueden originarse de la misma respuesta", () => {
        expect(byId.get("15")?.unlocks?.yes).toEqual(["15.1"]);
        expect(byId.get("15")?.unlocks?.no).toEqual(["15.2"]);
    });

    it("la fiebre negra se activa con ambas decisiones", () => {
        expect(byId.get("45")?.addModifiersOnComplete).toEqual(["black-fever"]);
    });

    it("el circo se retira el día 7 si se autorizó su entrada", () => {
        expect(byId.get("11")?.addModifiers?.yes).toEqual(["traveling-circus"]);
        expect(byId.get("11.2")?.removeModifiersOnComplete).toEqual(["traveling-circus"]);
    });

    it("cada evento condicionado tiene al menos una ruta de desbloqueo", () => {
        const unlocks = chapter1Events.flatMap((event) => [
            ...Object.values(event.unlocks ?? {}).flat(),
            ...(event.unlocksOnComplete ?? []),
        ]);
        for (const event of chapter1Events.filter((item) => item.requiresUnlock)) {
            expect(unlocks).toContain(event.id);
        }
    });
});
