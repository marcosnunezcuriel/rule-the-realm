// @vitest-environment jsdom

// Comprueba las interacciones de la pantalla de acceso sin contactar con Supabase.

import { act } from "react";
import type { ComponentProps } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import AuthScreen from "../../components/auth/AuthScreen";

let container: HTMLDivElement;
let root: Root;

function getElement<T extends HTMLElement>(selector: string): T {
    const element = container.querySelector<T>(selector);

    if (element === null) {
        throw new Error(`No existe el elemento: ${selector}`);
    }

    return element;
}

function click(selector: string) {
    act(() => {
        getElement<HTMLButtonElement>(selector).click();
    });
}

async function openRegistration() {
    click(".auth-screen__switch-button");

    await act(async () => {
        await vi.dynamicImportSettled();
    });
}

function setField(name: string, value: string) {
    const input = getElement<HTMLInputElement>(
        `input[name="${name}"]`
    );

    // El setter nativo permite simular una modificación real del campo.
    const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
    )?.set;

    act(() => {
        setter?.call(input, value);
        input.dispatchEvent(new Event("input", { bubbles: true }));
    });
}

function submit() {
    act(() => {
        getElement<HTMLFormElement>("form").dispatchEvent(
            new Event("submit", { bubbles: true, cancelable: true })
        );
    });
}

function isSubmitDisabled() {
    return getElement<HTMLButtonElement>(".auth-screen__submit").disabled;
}

function mountScreen(overrides: Partial<ComponentProps<typeof AuthScreen>> = {}) {
    act(() => {
        root.render(<AuthScreen onGuest={() => {}} {...overrides} />);
    });
}

describe("Pantalla de acceso", () => {
    beforeEach(() => {
        vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
        container = document.createElement("div");
        document.body.append(container);
        root = createRoot(container);
    });

    afterEach(() => {
        act(() => root.unmount());
        container.remove();
        vi.unstubAllGlobals();
    });

    it("muestra el acceso y deshabilita los servicios todavía no conectados", () => {
        mountScreen();

        expect(getElement("#auth-form-title").textContent).toBe("Iniciar sesión");
        expect(isSubmitDisabled()).toBe(true);
        expect(getElement<HTMLButtonElement>(".auth-screen__google").disabled).toBe(true);
    });

    it("intercambia los formularios y conserva el correo pero no la contraseña", async () => {
        mountScreen();
        setField("email", "prueba@example.com");
        setField("password", "password123");
        await openRegistration();

        expect(getElement("#auth-form-title").textContent).toBe("Crear cuenta");
        expect(container.querySelector(".auth-screen__panel--register")).not.toBeNull();
        expect(getElement<HTMLInputElement>('input[name="email"]').value).toBe("prueba@example.com");
        expect(getElement<HTMLInputElement>('input[name="password"]').value).toBe("");
        expect(container.querySelector('input[name="repeat-password"]')).not.toBeNull();

        click(".auth-screen__mobile-switch button");
        expect(getElement("#auth-form-title").textContent).toBe("Iniciar sesión");
    });

    it("permite mostrar y ocultar la contraseña", () => {
        mountScreen();
        const input = getElement<HTMLInputElement>('input[name="password"]');
        expect(input.type).toBe("password");
        click(".auth-field__visibility");
        expect(input.type).toBe("text");
        click(".auth-field__visibility");
        expect(input.type).toBe("password");
    });

    it("solo registra cuando las contraseñas coinciden y tienen al menos ocho caracteres", async () => {
        const onRegister = vi.fn();
        mountScreen({ onRegister });
        await openRegistration();
        setField("username", "Soberano");
        setField("email", "prueba@example.com");
        setField("password", "corta");
        setField("repeat-password", "corta");
        expect(isSubmitDisabled()).toBe(true);
        setField("password", "vQ7!zM2#pL9@xR4$kT8");
        expect(isSubmitDisabled()).toBe(true);
        expect(getElement(".auth-screen__password-status").textContent).toBe("Las contraseñas no coinciden.");
        submit();
        expect(onRegister).not.toHaveBeenCalled();
        setField("repeat-password", "vQ7!zM2#pL9@xR4$kT8");
        expect(isSubmitDisabled()).toBe(false);
        submit();
        expect(onRegister).toHaveBeenCalledExactlyOnceWith("Soberano", "prueba@example.com", "vQ7!zM2#pL9@xR4$kT8");
    });

    it("envía los datos de inicio de sesión a su callback", () => {
        const onLogin = vi.fn();
        mountScreen({ onLogin });
        setField("email", "prueba@example.com");
        setField("password", "password123");
        expect(isSubmitDisabled()).toBe(false);
        submit();
        expect(onLogin).toHaveBeenCalledExactlyOnceWith("prueba@example.com", "password123");
    });

    it("abre la recuperación, envía el correo y permite regresar", () => {
        const onRecovery = vi.fn();
        mountScreen({ onRecovery });
        setField("email", "prueba@example.com");
        click(".auth-screen__text-button");
        expect(getElement("#auth-form-title").textContent).toBe("Recuperar contraseña");
        expect(container.querySelector('input[name="password"]')).toBeNull();
        expect(isSubmitDisabled()).toBe(false);
        submit();
        expect(onRecovery).toHaveBeenCalledExactlyOnceWith("prueba@example.com");
        click(".auth-screen__text-button");
        expect(getElement("#auth-form-title").textContent).toBe("Iniciar sesión");
    });

    it("comunica la selección de Google y del modo invitado", () => {
        const onGuest = vi.fn();
        const onGoogle = vi.fn();
        mountScreen({ onGuest, onGoogle });
        click(".auth-screen__google");
        click(".auth-screen__guest button");
        expect(onGoogle).toHaveBeenCalledTimes(1);
        expect(onGuest).toHaveBeenCalledTimes(1);
    });

    it("actualiza el indicador de seguridad y permite consultar sus requisitos", async () => {
        mountScreen();
        await openRegistration();

        setField("password", "12345678");

        expect(
            getElement(".auth-screen__strength-message")
                .textContent
        ).toBe("Contraseña insegura");

        setField("password", "vQ7!zM2#pL9@xR4$kT8");

        expect(
            getElement(".auth-screen__strength-message")
                .textContent
        ).toBe("Contraseña segura");

        const info = getElement<HTMLDetailsElement>(
            ".auth-screen__password-info"
        );

        const heading = info.closest(".auth-field__heading");

        expect(
            heading?.querySelector("label")?.textContent
        ).toBe("Contraseña");

        expect(
            container.querySelector(
                ".auth-screen__strength .auth-screen__password-info"
            )
        ).toBeNull();

        expect(info.open).toBe(false);

        click(".auth-screen__password-info summary");

        expect(info.open).toBe(true);

        click(".auth-screen__password-info summary");

        expect(info.open).toBe(false);
    });

    it("impide registrar una cuenta mientras se carga el evaluador", async () => {
        const onRegister = vi.fn();

        mountScreen({ onRegister });

        click(".auth-screen__switch-button");

        expect(
            getElement(".auth-screen__strength-message")
                .textContent
        ).toBe("Cargando comprobador de contraseñas...");

        setField("username", "Soberano");
        setField("email", "prueba@example.com");
        setField("password", "vQ7!zM2#pL9@xR4$kT8");
        setField("repeat-password", "vQ7!zM2#pL9@xR4$kT8");

        expect(isSubmitDisabled()).toBe(true);

        submit();

        expect(onRegister).not.toHaveBeenCalled();

        await act(async () => {
            await vi.dynamicImportSettled();
        });

        expect(isSubmitDisabled()).toBe(false);
    });
});
