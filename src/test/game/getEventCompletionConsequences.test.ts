import { describe, expect, it } from "vitest";

import { getEventCompletionConsequences } from "../../game/getEventCompletionConsequences";
import { getEventById } from "../../data/events/eventRegistry";
import { createStats } from "../helpers/createStats";

describe("Consecuencias al finalizar una audiencia", () => {
    it("otorga la recompensa de una audiencia informativa sin decisión", () => {
        const audience = getEventById("15.2");
        if (!audience) throw new Error("Falta el evento 15.2");

        const stats = createStats();
        const result = getEventCompletionConsequences(audience, stats);
        expect(result.nextStats?.gold).toBe(stats.gold + 15);
        expect(result.nextStats?.army).toBe(stats.army + 5);
    });

    it("no duplica efectos base ya aplicados al tomar una decisión", () => {
        const audience = getEventById("12.1");
        if (!audience) throw new Error("Falta el evento 12.1");
        expect(getEventCompletionConsequences(audience, createStats()).nextStats).toBeNull();
    });

    it("activa el modificador de fiebre negra después de la audiencia", () => {
        const audience = getEventById("45");
        if (!audience) throw new Error("Falta el evento 45");
        expect(getEventCompletionConsequences(audience, createStats()).addModifiers).toEqual(["black-fever"]);
    });

    it("retira el modificador del circo antes del cierre de día", () => {
        const audience = getEventById("11.2");
        if (!audience) throw new Error("Falta el evento 11.2");
        expect(getEventCompletionConsequences(audience, createStats()).removeModifiers).toEqual(["traveling-circus"]);
    });
});
