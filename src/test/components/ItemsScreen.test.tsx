// @vitest-environment jsdom

// Comprueba la presentación de los objetos bloqueados y conseguidos.

import { renderToStaticMarkup } from "react-dom/server";
import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import ItemsScreen from "../../components/menu/ItemsScreen";

import { items } from "../../data/registries/itemRegistry";

import { unlockItem } from "../../storage/itemsStorage";

describe("Colección real", () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it("muestra los nombres e imágenes pero oculta las descripciones", () => {
        const html = renderToStaticMarkup(
            <ItemsScreen onBack={() => {}} />
        );

        for (const item of Object.values(items)) {
            expect(html).toContain(item.name);
            expect(html).toContain(item.image);
            expect(html).not.toContain(item.description);
        }

        expect(
            html.match(/\?\?\?/g)
        ).toHaveLength(Object.keys(items).length);

        expect(html).not.toContain(
            "collection-screen__card--unlocked"
        );
    });

    it("revela únicamente las descripciones de los objetos conseguidos", () => {
        unlockItem("rough-emerald");

        const html = renderToStaticMarkup(
            <ItemsScreen onBack={() => {}} />
        );

        expect(html).toContain(
            items["rough-emerald"].description
        );

        expect(html).not.toContain(
            items["book-of-eight-virtues"].description
        );

        expect(html).toContain(
            "collection-screen__card--unlocked"
        );

        expect(
            html.match(/\?\?\?/g)
        ).toHaveLength(Object.keys(items).length - 1);
    });
});
