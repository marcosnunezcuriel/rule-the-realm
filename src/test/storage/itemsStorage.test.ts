// @vitest-environment jsdom

// Comprueba el almacenamiento permanente de los objetos de colección.

import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import { unlockAnthem } from "../../storage/anthemStorage";
import { clearSavedGame } from "../../storage/gameStorage";
import {
    ITEMS_KEY,
    loadUnlockedItems,
    unlockItem,
} from "../../storage/itemsStorage";

describe("Colección permanente de objetos", () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it("comienza con la colección vacía", () => {
        expect(loadUnlockedItems()).toEqual([]);
    });

    it("conserva ambos retratos entre partidas y evita duplicados", () => {
        expect(
            unlockItem("royal-portrait-king")
        ).toBe(true);

        expect(
            unlockItem("royal-portrait-queen")
        ).toBe(true);

        expect(
            unlockItem("royal-portrait-king")
        ).toBe(false);

        clearSavedGame();

        expect(loadUnlockedItems()).toEqual([
            "royal-portrait-king",
            "royal-portrait-queen",
        ]);
    });

    it("descarta objetos desconocidos y repetidos", () => {
        window.localStorage.setItem(
            ITEMS_KEY,
            JSON.stringify([
                "rough-emerald",
                "unknown-item",
                "rough-emerald",
            ])
        );

        expect(loadUnlockedItems()).toEqual([
            "rough-emerald",
        ]);
    });

    it("tolera datos de almacenamiento incorrectos", () => {
        window.localStorage.setItem(
            ITEMS_KEY,
            "{contenido-invalido"
        );

        expect(loadUnlockedItems()).toEqual([]);
    });

    it("incorpora el himno sin duplicar su almacenamiento", () => {
        expect(unlockAnthem()).toBe(true);

        expect(loadUnlockedItems()).toEqual([
            "anthem-of-astaria",
        ]);

        unlockItem("rough-emerald");

        expect(
            JSON.parse(
                window.localStorage.getItem(ITEMS_KEY) ?? "[]"
            )
        ).toEqual([
            "rough-emerald",
        ]);

        expect(loadUnlockedItems()).toEqual([
            "rough-emerald",
            "anthem-of-astaria",
        ]);
    });
});
