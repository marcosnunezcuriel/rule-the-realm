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

describe("Organización general de los estilos", () => {
    it("mantiene los tokens de diseño dentro de styles/tokens", () => {
        const cssFiles = getCssFiles(
            srcDirectory
        );

        const tokenDirectory = join(
            srcDirectory,
            "styles",
            "tokens"
        );

        const expectedFiles = [
            "colours.css",
            "effects.css",
            "fonts.css",
            "sizes.css",
            "spacing.css",
        ];

        for (const filename of expectedFiles) {
            expect(cssFiles).toContain(
                join(tokenDirectory, filename)
            );
        }

        expect(
            getCssFiles(
                join(srcDirectory, "utils")
            )
        ).toEqual([]);
    });

    it("carga los estilos compartidos antes de las adaptaciones responsive", () => {
        const main = readFileSync(
            join(srcDirectory, "main.tsx"),
            "utf-8"
        );

        const responsiveImport =
            "./styles/base/responsive.css";

        const sharedImports = [
            "./styles/shared/Buttons.css",
            "./styles/shared/Panels.css",
            "./styles/shared/Toast.css",
        ];

        expect(main).toContain(
            responsiveImport
        );

        for (const path of sharedImports) {
            expect(main).toContain(path);

            expect(
                main.indexOf(path)
            ).toBeLessThan(
                main.indexOf(responsiveImport)
            );
        }

        expect(
            main.indexOf("./App.tsx")
        ).toBeLessThan(
            main.indexOf(responsiveImport)
        );
    });

    it("utiliza una única animación compartida para las notificaciones", () => {
        const cssFiles = getCssFiles(
            srcDirectory
        );

        const toastPath = join(
            srcDirectory,
            "styles",
            "shared",
            "Toast.css"
        );

        const animationFiles = cssFiles.filter(
            (path) => {
                return /@keyframes\s+toast-motion\b/.test(
                    readCss(path)
                );
            }
        );

        expect(animationFiles).toEqual([
            toastPath,
        ]);

        const toastCss = readCss(toastPath);

        expect(toastCss).toMatch(
            /\.notification-toast\s*,\s*\.stat-change-toast\s*\{/
        );

        expect(toastCss).toContain(
            "var(--duration-notification)"
        );

        for (const path of cssFiles) {
            const css = readCss(path);

            expect(css).not.toMatch(
                /@keyframes\s+(stat-change-toast-motion|notification-toast-motion)\b/
            );
        }
    });
});
