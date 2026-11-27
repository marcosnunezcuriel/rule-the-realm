// Comprueba la configuración del cliente de Supabase
// sin realizar peticiones reales al servidor.

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import { createClient } from "@supabase/supabase-js";

vi.mock("@supabase/supabase-js", () => ({
    createClient: vi.fn(() => ({})),
}));

describe("Configuración de Supabase", () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();

        vi.stubEnv(
            "VITE_SUPABASE_URL",
            ""
        );

        vi.stubEnv(
            "VITE_SUPABASE_PUBLISHABLE_KEY",
            ""
        );
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("permite funcionar sin configurar Supabase", async () => {
        const { supabase } =
            await import("../../lib/supabase");

        expect(supabase).toBeNull();

        expect(createClient)
            .not.toHaveBeenCalled();
    });

    it("no crea el cliente con una configuración incompleta", async () => {
        vi.stubEnv(
            "VITE_SUPABASE_URL",
            "https://example.supabase.co"
        );

        const { supabase } =
            await import("../../lib/supabase");

        expect(supabase).toBeNull();

        expect(createClient)
            .not.toHaveBeenCalled();
    });

    it("crea el cliente con las variables de entorno", async () => {
        vi.stubEnv(
            "VITE_SUPABASE_URL",
            "https://example.supabase.co"
        );

        vi.stubEnv(
            "VITE_SUPABASE_PUBLISHABLE_KEY",
            "sb_publishable_test"
        );

        const { supabase } =
            await import("../../lib/supabase");

        expect(supabase).not.toBeNull();

        expect(createClient)
            .toHaveBeenCalledTimes(1);

        expect(createClient)
            .toHaveBeenCalledWith(
                "https://example.supabase.co",
                "sb_publishable_test"
            );
    });
});
