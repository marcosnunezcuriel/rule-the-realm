// @vitest-environment node

// Comprueba la existencia de los recursos de audio registrados.

import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
    effectPaths,
    ambientPaths,
} from "../../audio/soundCatalog";

function expectAudioFile(path: string) {
    expect(
        existsSync(
            new URL(
                `../../../public${path}`,
                import.meta.url
            )
        ),
        `No existe el archivo de audio ${path}`
    ).toBe(true);
}

describe("Catálogo de audio", () => {
    it("todos los efectos de sonido existen", () => {
        for (const path of Object.values(effectPaths)) {
            expect(path).toMatch(
                /^\/assets\/audio\/effects\/[^/]+\.mp3$/
            );

            expectAudioFile(path);
        }
    });

    it("todas las pistas ambientales existen", () => {
        for (const path of Object.values(ambientPaths)) {
            expect(path).toMatch(
                /^\/assets\/audio\/ambience\/[^/]+\.ogg$/
            );

            expectAudioFile(path);
        }
    });
});
