// @vitest-environment node

import { describe, expect, it } from "vitest";

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const srcDirectory = fileURLToPath(
    new URL("../../", import.meta.url)
);

const responsivePath = join(
    srcDirectory,
    "styles",
    "base",
    "responsive.css"
);

// Buscar todos los archivos CSS de forma recursiva.
function getCssFiles(directory: string): string[] {
    return readdirSync(directory, {
        withFileTypes: true,
    }).flatMap((entry) => {
        const path = join(directory, entry.name);

        if (entry.isDirectory()) {
            return getCssFiles(path);
        }

        return entry.isFile() && entry.name.endsWith(".css")
            ? [path]
            : [];
    });
}

// Leer el CSS original ignorando los comentarios.
function readCss(path: string): string {
    return readFileSync(path, "utf-8").replace(
        /\/\*[\s\S]*?\*\//g,
        ""
    );
}

describe("Organización de los estilos responsive", () => {
    it("contiene las reglas responsive centralizadas", () => {
        expect(
            readCss(responsivePath)
        ).toMatch(/@media\b/);
    });

    it("no permite reglas @media fuera de responsive.css", () => {
        const cssFiles = getCssFiles(srcDirectory);

        expect(cssFiles).toContain(responsivePath);

        const invalidFiles = cssFiles.filter((path) => {
            return (
                path !== responsivePath &&
                /@media\b/.test(readCss(path))
            );
        });

        expect(invalidFiles).toEqual([]);
    });
});
