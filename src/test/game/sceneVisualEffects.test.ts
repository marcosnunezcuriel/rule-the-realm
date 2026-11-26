import { describe, expect, it } from "vitest";

import { getSceneBackgrounds } from "../../game/getSceneBackgrounds";
import { getSceneVisualClassName } from "../../game/getSceneVisualClassName";

describe("Efectos ambientales del reino", () => {
    it("no aplica efectos visuales sin modificadores activos", () => {
        expect(
            getSceneVisualClassName([])
        ).toBeUndefined();
    });

    it("ignora los modificadores sin efectos ambientales inmediatos", () => {
        expect(
            getSceneVisualClassName([
                "high-taxes",
                "silk-road",
                "traveling-circus",
            ])
        ).toBeUndefined();
    });

    it("resuelve la Fiebre negra aunque existan otros modificadores", () => {
        expect(
            getSceneVisualClassName([
                "high-taxes",
                "black-fever",
                "traveling-circus",
            ])
        ).toBe(
            "throne-stage__visuals--black-fever"
        );
    });

    it("mantiene separados los fondos de jornada y los efectos inmediatos", () => {
        // El circo estaba presente al comenzar el día.
        const backgrounds =
            getSceneBackgrounds([
                "traveling-circus",
            ]);

        // La epidemia se activa durante la jornada.
        const visualClassName =
            getSceneVisualClassName([
                "traveling-circus",
                "black-fever",
            ]);

        expect(
            backgrounds.morning
        ).toContain(
            "background-morning-circus.png"
        );

        expect(
            visualClassName
        ).toBe(
            "throne-stage__visuals--black-fever"
        );

        // Al desaparecer el modificador ambiental,
        // su efecto se retira inmediatamente.
        expect(
            getSceneVisualClassName([
                "traveling-circus",
            ])
        ).toBeUndefined();
    });
});
