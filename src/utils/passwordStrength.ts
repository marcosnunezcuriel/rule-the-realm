// Evalúa la seguridad de las contraseñas sin enviarlas al servidor.

import { ZxcvbnFactory } from "@zxcvbn-ts/core";

import * as common from "@zxcvbn-ts/language-common";
import * as english from "@zxcvbn-ts/language-en";
import * as spanish from "@zxcvbn-ts/language-es-es";

import {
    MIN_PASSWORD_LENGTH,
    MAX_PASSWORD_BYTES,
} from "./passwordPolicy";

export type PasswordStrength =
    | "empty"
    | "weak"
    | "medium"
    | "strong";

const estimator = new ZxcvbnFactory({
    graphs: common.adjacencyGraphs,
    dictionary: {
        ...common.dictionary,
        ...english.dictionary,
        ...spanish.dictionary,
    },
});

export function getPasswordStrength(
    password: string,
    username = "",
    email = ""
): PasswordStrength {
    if (password.length === 0) {
        return "empty";
    }

    if (
        Array.from(password).length < MIN_PASSWORD_LENGTH ||
        new TextEncoder().encode(password).length >
            MAX_PASSWORD_BYTES
    ) {
        return "weak";
    }

    const result = estimator.check(password, [
        username,
        email,
        email.split("@")[0],
        "astaria",
        "rule the realm",
    ].filter(Boolean));

    if (result.score < 3) {
        return "weak";
    }

    return result.score === 4
        ? "strong"
        : "medium";
}
