// Campo reutilizable de los formularios de autenticación.

import { useId, useState } from "react";

import type { ReactNode } from "react";

type AuthFieldProps = {
    label: string;
    labelExtra?: ReactNode;
    placeholder: string;
    name: string;
    type: "text" | "email" | "password";
    value: string;
    autoComplete: string;
    minLength?: number;
    maxLength?: number;
    onChange: (value: string) => void;
};

function AuthField({
    label,
    labelExtra,
    placeholder,
    name,
    type,
    value,
    autoComplete,
    minLength,
    maxLength,
    onChange,
}: AuthFieldProps) {
    const id = useId();

    const [passwordVisible, setPasswordVisible] =
        useState(false);

    const isPassword = type === "password";

    return (
        <div className="auth-field">
            <div className="auth-field__heading">
                <label
                    className="auth-field__label"
                    htmlFor={id}
                >
                    {label}
                </label>

                {labelExtra}
            </div>

            <div className="auth-field__control">
                <svg
                    className="auth-field__icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    {type === "email" ? (
                        <>
                            <rect
                                x="3"
                                y="5"
                                width="18"
                                height="14"
                                rx="2"
                            />
                            <path d="m3 6 9 7 9-7" />
                        </>
                    ) : isPassword ? (
                        <>
                            <rect
                                x="5"
                                y="10"
                                width="14"
                                height="11"
                                rx="2"
                            />
                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                            <path d="M12 14v3" />
                        </>
                    ) : (
                        <>
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
                        </>
                    )}
                </svg>

                <input
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    className="auth-field__input"
                    type={
                        isPassword && passwordVisible
                            ? "text"
                            : type
                    }
                    value={value}
                    autoComplete={autoComplete}
                    minLength={minLength}
                    maxLength={maxLength}
                    required
                    onChange={(event) => {
                        onChange(event.target.value);
                    }}
                />

                {isPassword && (
                    <button
                        type="button"
                        className="auth-field__visibility"
                        aria-label={
                            `${passwordVisible
                                ? "Ocultar"
                                : "Mostrar"} ${label.toLowerCase()}`
                        }
                        onClick={() => {
                            setPasswordVisible(
                                (previous) => !previous
                            );
                        }}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
                            <circle cx="12" cy="12" r="3" />

                            {passwordVisible && (
                                <path d="m3 3 18 18" />
                            )}
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}

export default AuthField;
