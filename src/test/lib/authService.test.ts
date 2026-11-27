// @vitest-environment jsdom

// Comprueba el registro sin contactar con Supabase.

import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    getAuthRedirectUrl,
    registerWithEmail,
} from "../../lib/authService";

const { signUp } = vi.hoisted(() => ({
    signUp: vi.fn(),
}));

vi.mock("../../lib/supabase", () => ({
    supabase: {
        auth: {
            signUp,
        },
    },
}));

describe("Servicio de autenticación", () => {
    beforeEach(() => {
        signUp.mockReset();
    });

    it("envía las credenciales y el nombre del jugador", async () => {
        signUp.mockResolvedValue({
            error: null,
        });

        await registerWithEmail(
            " Soberano ",
            " prueba@example.com ",
            "vQ7!zM2#pL9@xR4$kT8"
        );

        expect(signUp)
            .toHaveBeenCalledExactlyOnceWith({
                email: "prueba@example.com",
                password: "vQ7!zM2#pL9@xR4$kT8",
                options: {
                    emailRedirectTo:
                        getAuthRedirectUrl(),
                    data: {
                        username: "Soberano",
                    },
                },
            });
    });

    it("no revela si una cuenta ya existe", async () => {
        signUp.mockResolvedValue({
            error: {
                code: "user_already_exists",
            },
        });

        await expect(
            registerWithEmail(
                "Soberano",
                "prueba@example.com",
                "vQ7!zM2#pL9@xR4$kT8"
            )
        ).resolves.toBeUndefined();
    });

    it("traduce los errores de frecuencia de solicitudes", async () => {
        signUp.mockResolvedValue({
            error: {
                code: "over_email_send_rate_limit",
            },
        });

        await expect(
            registerWithEmail(
                "Soberano",
                "prueba@example.com",
                "vQ7!zM2#pL9@xR4$kT8"
            )
        ).rejects.toThrow(
            "Demasiadas solicitudes. Inténtalo más tarde."
        );
    });

    it("gestiona los fallos de conexión", async () => {
        signUp.mockRejectedValue(
            new Error("Network error")
        );

        await expect(
            registerWithEmail(
                "Soberano",
                "prueba@example.com",
                "vQ7!zM2#pL9@xR4$kT8"
            )
        ).rejects.toThrow(
            "No se pudo conectar con el servicio de autenticación."
        );
    });
});
