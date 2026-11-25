import { describe, expect, it } from "vitest";

import {
    effectPaths,
    ambientPaths,
} from "../../audio/soundCatalog";

describe("Catálogo de audio", () => {
    it("incluye exactamente 14 efectos", () => {
        expect(Object.keys(effectPaths)).toHaveLength(14);

        for (const path of Object.values(effectPaths)) {
            expect(path).toMatch(
                /^\/assets\/audio\/effects\/[^/]+\.mp3$/
            );
        }
    });

    it("incluye los dos ambientes", () => {
        expect(ambientPaths.birds).toContain(
            "birds.ogg"
        );

        expect(ambientPaths.anthem).toContain(
            "anthem-of-astaria.ogg"
        );
    });
});
