import { describe, expect, it } from "vitest";

import {
    getPasswordStrength,
} from "../../utils/passwordStrength";

describe("Seguridad de las contraseñas", () => {
    it("distingue una contraseña vacía", () => {
        expect(
            getPasswordStrength("")
        ).toBe("empty");
    });

    it("rechaza contraseñas demasiado cortas", () => {
        expect(
            getPasswordStrength("1234567")
        ).toBe("weak");
    });

    it("rechaza secuencias largas y predecibles", () => {
        expect(
            getPasswordStrength("12345678901234567890")
        ).toBe("weak");
    });

    it("rechaza contraseñas demasiado largas para bcrypt", () => {
        expect(
            getPasswordStrength("a".repeat(73))
        ).toBe("weak");
    });

    it("reconoce una contraseña de resistencia elevada", () => {
        expect(
            getPasswordStrength("vQ7!zM2#pL9@xR4$kT8")
        ).toBe("strong");
    });
});
