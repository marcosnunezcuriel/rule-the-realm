import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import NightRest, {
    NIGHT_REST_DURATION_MS,
} from "../../components/screens/NightRest";

describe("Descanso nocturno", () => {
    it("muestra el descanso de los reyes", () => {
        const html = renderToStaticMarkup(
            <NightRest onFinish={() => {}} />
        );

        expect(html).toContain("royalty-sleeping.gif");
        expect(html).toContain(
            "El rey y la reina durmiendo en sus aposentos"
        );
    });

    it("mantiene la duración de un ciclo del GIF", () => {
        expect(NIGHT_REST_DURATION_MS).toBe(2600);
    });
});
