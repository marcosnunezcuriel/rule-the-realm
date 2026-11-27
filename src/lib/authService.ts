// Operaciones de autenticación con Supabase.

import { supabase } from "./supabase";

// Dirección de regreso según el entorno de ejecución.
export function getAuthRedirectUrl(): string {
    return new URL(
        import.meta.env.BASE_URL,
        window.location.origin
    ).href;
}

// Registro mediante correo electrónico y contraseña.
export async function registerWithEmail(
    username: string,
    email: string,
    password: string
): Promise<void> {
    if (supabase === null) {
        throw new Error(
            "El servicio de autenticación no está disponible."
        );
    }

    const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
            emailRedirectTo: getAuthRedirectUrl(),
            data: {
                username: username.trim(),
            },
        },
    }).catch(() => {
        throw new Error(
            "No se pudo conectar con el servicio de autenticación."
        );
    });

    if (!error) {
        return;
    }

    // Evitar revelar si una dirección ya está registrada.
    if (
        error.code === "user_already_exists" ||
        error.code === "email_exists"
    ) {
        return;
    }

    switch (error.code) {
        case "weak_password":
            throw new Error(
                "La contraseña no cumple los requisitos de seguridad."
            );

        case "email_address_invalid":
        case "validation_failed":
            throw new Error(
                "Comprueba los datos introducidos."
            );

        case "over_email_send_rate_limit":
        case "over_request_rate_limit":
            throw new Error(
                "Demasiadas solicitudes. Inténtalo más tarde."
            );

        case "email_address_not_authorized":
            throw new Error(
                "El registro está limitado temporalmente a direcciones de prueba autorizadas."
            );

        case "signup_disabled":
        case "email_provider_disabled":
            throw new Error(
                "El registro no está disponible en este momento."
            );

        default:
            throw new Error(
                "No se pudo completar el registro. Inténtalo de nuevo."
            );
    }
}
