// Comprueba la presentación de la introducción y sus ilustraciones.

import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ChapterEnding from "../../components/screens/ChapterEnding";
import WelcomeIntroduction from "../../components/screens/WelcomeIntroduction";

import { chapters } from "../../data/chapters";

describe("Pantalla de introducción", () => {
    it("da la bienvenida al rey y muestra su coronación enmarcada", () => {
        const html = renderToStaticMarkup(
            <WelcomeIntroduction
                monarch="king"
                onFinish={() => {}}
            />
        );

        expect(html).toContain(
            "Bienvenido a Astaria"
        );

        expect(html).toContain(
            "/assets/ui/coronation-king.png"
        );

        expect(html).toContain(
            'alt="Coronación del rey de Astaria"'
        );

        expect(html).not.toContain(
            "coronation-queen.png"
        );

        expect(html).toContain(
            'class="golden-frame"'
        );

        expect(html).toContain(
            "narrative-parchment--illustrated"
        );

        expect(
            existsSync(
                new URL(
                    "../../../public/assets/ui/coronation-king.png",
                    import.meta.url
                )
            )
        ).toBe(true);
    });

    it("da la bienvenida a la reina y muestra su coronación enmarcada", () => {
        const html = renderToStaticMarkup(
            <WelcomeIntroduction
                monarch="queen"
                onFinish={() => {}}
            />
        );

        expect(html).toContain(
            "Bienvenida a Astaria"
        );

        expect(html).toContain(
            "/assets/ui/coronation-queen.png"
        );

        expect(html).toContain(
            'alt="Coronación de la reina de Astaria"'
        );

        expect(html).not.toContain(
            "coronation-king.png"
        );

        expect(html).toContain(
            'class="golden-frame"'
        );

        expect(html).toContain(
            "narrative-parchment--illustrated"
        );

        expect(
            existsSync(
                new URL(
                    "../../../public/assets/ui/coronation-queen.png",
                    import.meta.url
                )
            )
        ).toBe(true);
    });

    it("conserva el pergamino original en el epílogo sin ilustración", () => {
        const html = renderToStaticMarkup(
            <ChapterEnding
                chapter={chapters[0]}
                initialParagraphIndex={0}
                onParagraphChange={() => {}}
                onNextChapter={() => {}}
                onMenu={() => {}}
            />
        );

        expect(html).toContain(
            "Fin del Capítulo I"
        );

        expect(html).toContain(
            'class="narrative-parchment"'
        );

        expect(html).not.toContain(
            "narrative-parchment--illustrated"
        );

        expect(html).not.toContain(
            "golden-frame"
        );
    });
});
