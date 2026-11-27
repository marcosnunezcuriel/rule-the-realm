// Pantalla de acceso, registro y recuperación de contraseña.

import { useState } from "react";
import type { FormEvent } from "react";

import AuthField from "./AuthField";

import { assetUrl } from "../../utils/assetUrl";
import {
    MIN_PASSWORD_LENGTH,
} from "../../utils/passwordPolicy";

import "../../styles/auth/AuthScreen.css";

type AuthMode =
    | "login"
    | "register"
    | "recovery";

type PasswordEvaluator =
    | "idle"
    | "loading"
    | "error"
    | typeof import("../../utils/passwordStrength");

type AuthScreenProps = {
    onGuest: () => void;

    onLogin?: (
        email: string,
        password: string
    ) => void;

    onRegister?: (
        username: string,
        email: string,
        password: string
    ) => void;

    onRecovery?: (email: string) => void;
    onGoogle?: () => void;
};

const MAX_USERNAME_LENGTH = 40;

const passwordStrengthLabels = {
    empty: "Sin contraseña",
    weak: "Contraseña insegura",
    medium: "Contraseña poco segura",
    strong: "Contraseña segura",
};

function AuthScreen({
    onGuest,
    onLogin,
    onRegister,
    onRecovery,
    onGoogle,
}: AuthScreenProps) {
    const [mode, setMode] =
        useState<AuthMode>("login");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] =
        useState("");
    const [passwordEvaluator, setPasswordEvaluator] =
        useState<PasswordEvaluator>("idle");

    const isRegister = mode === "register";
    const isRecovery = mode === "recovery";

    const passwordsMatch =
        password === repeatPassword;

    const passwordStrength =
        isRegister && typeof passwordEvaluator === "object"
            ? passwordEvaluator.getPasswordStrength(
                password,
                username,
                email
            )
            : "empty";

    const validPassword =
        passwordStrength === "medium" ||
        passwordStrength === "strong";

    const validRegistration =
        username.trim().length > 0 &&
        username.trim().length <= MAX_USERNAME_LENGTH &&
        validPassword &&
        passwordsMatch;

    const canSubmit =
        email.trim().length > 0 &&
        (
            isRecovery
                ? onRecovery !== undefined
                : isRegister
                    ? onRegister !== undefined &&
                      validRegistration
                    : onLogin !== undefined &&
                      password.length > 0
        );

    const title = isRegister
        ? "Crear cuenta"
        : isRecovery
            ? "Recuperar contraseña"
            : "Iniciar sesión";

    // Cargar el evaluador únicamente cuando sea necesario.
    function loadPasswordEvaluator() {
        if (
            passwordEvaluator !== "idle" &&
            passwordEvaluator !== "error"
        ) {
            return;
        }

        setPasswordEvaluator("loading");

        void import("../../utils/passwordStrength")
            .then((module) => {
                setPasswordEvaluator(module);
            })
            .catch(() => {
                setPasswordEvaluator("error");
            });
    }

    // Conservar el correo, pero nunca las contraseñas al cambiar de formulario.
    function changeMode(nextMode: AuthMode) {
        setMode(nextMode);
        setPassword("");
        setRepeatPassword("");

        if (nextMode === "register") {
            loadPasswordEvaluator();
        }
    }

    function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!canSubmit) {
            return;
        }

        if (isRecovery) {
            onRecovery?.(email.trim());
            return;
        }

        if (isRegister) {
            onRegister?.(
                username.trim(),
                email.trim(),
                password
            );

            return;
        }

        onLogin?.(
            email.trim(),
            password
        );
    }

    return (
        <main className="auth-screen">
            <div className="auth-screen__content">
                {/* Identidad del juego */}
                <header className="auth-screen__brand">
                    <img
                        className="auth-screen__emblem"
                        src={assetUrl(
                            "/assets/ui/astaria-emblem.png"
                        )}
                        alt=""
                        draggable={false}
                    />

                    <h1>Rule the Realm</h1>

                    <p>Las crónicas de Astaria</p>
                </header>

                <div
                    className={[
                        "auth-screen__panel",
                        "realm-panel",
                        isRegister
                            ? "auth-screen__panel--register"
                            : "",
                    ].filter(Boolean).join(" ")}
                >
                    {/* Mitad dedicada al formulario */}
                    <div className="auth-screen__form-side">
                        <form
                            key={mode}
                            className="auth-screen__form"
                            aria-labelledby="auth-form-title"
                            onSubmit={handleSubmit}
                        >
                            <h2 id="auth-form-title">
                                {title}
                            </h2>

                            {isRecovery && (
                                <p className="auth-screen__explanation">
                                    Introduce tu correo electrónico
                                    para recibir un enlace de
                                    recuperación.
                                </p>
                            )}

                            {isRegister && (
                                <AuthField
                                    label="Nombre de jugador"
                                    placeholder="Introduzca su nombre de usuario"
                                    name="username"
                                    type="text"
                                    value={username}
                                    autoComplete="nickname"
                                    maxLength={MAX_USERNAME_LENGTH}
                                    onChange={setUsername}
                                />
                            )}

                            <AuthField
                                label="Correo electrónico"
                                placeholder="correo@ejemplo.com"
                                name="email"
                                type="email"
                                value={email}
                                autoComplete="email"
                                onChange={setEmail}
                            />

                            {!isRecovery && (
                                <AuthField
                                    label="Contraseña"
                                    placeholder="Introduzca su contraseña"
                                    name="password"
                                    type="password"
                                    value={password}
                                    autoComplete={
                                        isRegister
                                            ? "new-password"
                                            : "current-password"
                                    }
                                    minLength={
                                        isRegister
                                            ? MIN_PASSWORD_LENGTH
                                            : undefined
                                    }
                                    onChange={setPassword}
                                />
                            )}

                            {isRegister && (
                                <>
                                    <div className="auth-screen__strength">
                                        <details className="auth-screen__password-info">
                                            <summary
                                                aria-label="Información sobre la seguridad de las contraseñas"
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                    strokeLinecap="round"
                                                    aria-hidden="true"
                                                >
                                                    <circle cx="12" cy="12" r="9" />
                                                    <path d="M12 11v5" />
                                                    <circle
                                                        cx="12"
                                                        cy="8"
                                                        r="0.75"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </summary>

                                            <div className="auth-screen__password-info-bubble">
                                                <strong>Requisitos de seguridad para una contraseña más segura</strong>

                                                <ul>
                                                    <li>
                                                        Al menos {MIN_PASSWORD_LENGTH}
                                                        {" "}caracteres.
                                                    </li>
                                                    <li>
                                                        Combina letras mayúsculas y minúsculas.
                                                    </li>
                                                    <li>
                                                        Añade números y caracteres especiales.
                                                    </li>
                                                    <li>
                                                        Utiliza varias palabras aleatorias.
                                                    </li>
                                                    <li>
                                                        Evita nombres, fechas y secuencias
                                                        predecibles.
                                                    </li>
                                                    <li>
                                                        No reutilices contraseñas de
                                                        otras cuentas.
                                                    </li>
                                                </ul>
                                            </div>
                                        </details>

                                        <p
                                            className={
                                                `auth-screen__strength-message ` +
                                                `auth-screen__strength-message--${passwordStrength}`
                                            }
                                            aria-live="polite"
                                        >
                                            {passwordEvaluator === "loading"
                                                ? "Cargando comprobador de contraseñas..."
                                                : passwordEvaluator === "error"
                                                    ? "No se pudo cargar. Recarga la página."
                                                    : passwordStrengthLabels[passwordStrength]}
                                        </p>
                                    </div>

                                    <AuthField
                                        label="Repetir contraseña"
                                        placeholder="Repita su contraseña"
                                        name="repeat-password"
                                        type="password"
                                        value={repeatPassword}
                                        autoComplete="new-password"
                                        minLength={MIN_PASSWORD_LENGTH}
                                        onChange={setRepeatPassword}
                                    />

                                    <p
                                        className={[
                                            "auth-screen__password-status",
                                            repeatPassword
                                                ? passwordsMatch
                                                    ? "auth-screen__password-status--valid"
                                                    : "auth-screen__password-status--invalid"
                                                : "",
                                        ].filter(Boolean).join(" ")}
                                        aria-live="polite"
                                    >
                                        {repeatPassword
                                            ? passwordsMatch
                                                ? "Las contraseñas coinciden."
                                                : "Las contraseñas no coinciden."
                                            : "Sin contraseña."}
                                    </p>
                                </>
                            )}

                            {!isRegister && !isRecovery && (
                                <button
                                    type="button"
                                    className="auth-screen__text-button"
                                    onClick={() => {
                                        changeMode("recovery");
                                    }}
                                >
                                    ¿Has olvidado tu contraseña?
                                </button>
                            )}

                            <button
                                type="submit"
                                className="auth-screen__submit realm-button realm-button--display realm-button--hover"
                                disabled={!canSubmit}
                            >
                                {isRecovery
                                    ? "Enviar enlace"
                                    : title}
                            </button>

                            {!isRecovery ? (
                                <>
                                    <div className="auth-screen__separator">
                                        <span>o</span>
                                    </div>

                                    <button
                                        type="button"
                                        className="auth-screen__google realm-button realm-button--hover"
                                        disabled={!onGoogle}
                                        onClick={onGoogle}
                                    >
                                        <svg
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fill="#4285F4"
                                                d="M43.6 24.5c0-1.4-.1-2.7-.4-4H24v7.8h11a9.4 9.4 0 0 1-4.1 6.1v5h6.6c3.9-3.6 6.1-8.6 6.1-14.9Z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5c-1.8 1.2-4.2 1.9-6.9 1.9-5.3 0-9.9-3.6-11.5-8.4H5.7v5.2A20 20 0 0 0 24 44Z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M12.5 27.6a12 12 0 0 1 0-7.2v-5.2H5.7a20 20 0 0 0 0 17.6Z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8A19.2 19.2 0 0 0 24 4 20 20 0 0 0 5.7 15.2l6.8 5.2C14.1 15.6 18.7 12 24 12Z"
                                            />
                                        </svg>

                                        Continuar con Google
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    className="auth-screen__text-button"
                                    onClick={() => {
                                        changeMode("login");
                                    }}
                                >
                                    Volver a iniciar sesión
                                </button>
                            )}

                            {/* Cambio de formulario en móviles */}
                            {!isRecovery && (
                                <div className="auth-screen__mobile-switch">
                                    <span>
                                        {isRegister
                                            ? "¿Ya tienes una cuenta?"
                                            : "¿Todavía no tienes cuenta?"}
                                    </span>

                                    <button
                                        type="button"
                                        className="auth-screen__text-button"
                                        onClick={() => {
                                            changeMode(
                                                isRegister
                                                    ? "login"
                                                    : "register"
                                            );
                                        }}
                                    >
                                        {isRegister
                                            ? "Iniciar sesión"
                                            : "Crear cuenta"}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Pergamino deslizante de escritorio */}
                    <aside className="auth-screen__parchment">
                        <div className="auth-screen__parchment-content">
                            <img
                                src={assetUrl(
                                    "/assets/ui/astaria-emblem.png"
                                )}
                                alt=""
                                draggable={false}
                            />

                            <h2>
                                {isRegister
                                    ? "Bienvenido de nuevo"
                                    : "Vuestra historia os espera"}
                            </h2>

                            <span
                                className="auth-screen__divider"
                                aria-hidden="true"
                            />

                            <p>
                                {isRegister
                                    ? "Regresad a vuestro reino y continuad vuestro reinado."
                                    : "Forjad vuestro destino en Astaria y conservad vuestras hazañas y tesoros."}
                            </p>

                            <button
                                type="button"
                                className="auth-screen__switch-button"
                                onClick={() => {
                                    changeMode(
                                        isRegister
                                            ? "login"
                                            : "register"
                                    );
                                }}
                            >
                                {isRegister
                                    ? "Iniciar sesión"
                                    : "Crear cuenta"}
                            </button>
                        </div>
                    </aside>
                </div>

                {/* Acceso sin necesidad de registro */}
                <footer className="auth-screen__guest">
                    {!onLogin && !onRegister && (
                        <p className="auth-screen__availability">
                            El acceso con cuenta estará
                            disponible próximamente.
                        </p>
                    )}

                    <button
                        type="button"
                        className="realm-button realm-button--display realm-button--hover"
                        onClick={onGuest}
                    >
                        Jugar como invitado
                    </button>
                </footer>
            </div>
        </main>
    );
}

export default AuthScreen;
