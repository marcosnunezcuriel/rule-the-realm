import { describe, expect, it } from "vitest";

import {
    effectPaths,
    ambientPaths,
} from "../../audio/soundCatalog";

describe("Catálogo de audio", () => {
    it("contiene los 14 efectos del juego", () => {
        expect(Object.keys(effectPaths)).toHaveLength(14);

        for (const path of Object.values(effectPaths)) {
            expect(path).toMatch(
                /^\/assets\/audio\/effects\/[^/]+\.mp3$/
            );
        }
    });

    it("contiene el ambiente de pájaros y el himno", () => {
        expect(ambientPaths.birds).toContain(
            "birds.ogg"
        );

        expect(ambientPaths.anthem).toContain(
            "anthem-of-astaria.ogg"
        );
    });
});
