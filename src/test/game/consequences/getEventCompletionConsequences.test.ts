import { describe, expect, it } from "vitest";

import {
    getEventCompletionConsequences,
} from "../../../game/consequences/getEventCompletionConsequences";

import { getEventById } from "../../../data/registries/eventRegistry";
import { createStats } from "../../helpers/createStats";

describe("Consecuencias al completar audiencias", () => {
    it("entrega la recompensa de eventos sin decisión", () => {
        const event = getEventById("15.2");

        if (!event) {
            throw new Error("Falta el evento 15.2");
        }

        const stats = createStats();

        const result = getEventCompletionConsequences(
            event,
            stats
        );

        expect(result.nextStats?.gold).toBe(
            stats.gold + 15
        );

        expect(result.nextStats?.army).toBe(
            stats.army + 5
        );
    });

    it("no vuelve a aplicar efectos de decisiones", () => {
        const event = getEventById("12.1");

        if (!event) {
            throw new Error("Falta el evento 12.1");
        }

        const result = getEventCompletionConsequences(
            event,
            createStats()
        );

        expect(result.nextStats).toBeNull();
    });

    it("activa la Fiebre negra al completar su audiencia", () => {
        const event = getEventById("45");

        if (!event) {
            throw new Error("Falta el evento 45");
        }

        expect(
            getEventCompletionConsequences(
                event,
                createStats()
            ).addModifiers
        ).toEqual(["black-fever"]);
    });

    it("retira el circo al completar su despedida", () => {
        const event = getEventById("11.2");

        if (!event) {
            throw new Error("Falta el evento 11.2");
        }

        expect(
            getEventCompletionConsequences(
                event,
                createStats()
            ).removeModifiers
        ).toEqual(["traveling-circus"]);
    });
});
