import { describe, expect, it } from "vitest";

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
});
