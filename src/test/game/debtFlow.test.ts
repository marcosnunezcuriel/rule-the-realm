
import { describe, expect, it } from "vitest";

import {
    applyDailyModifiersWithDebt,
    getDebtAudience,
} from "../../game/debtFlow";

import { checkGameOver } from "../../game/checkGameOver";

import { createStats } from "../helpers/createStats";

describe("Sistema de deuda de la Corona", () => {
    it("solicita una audiencia al entrar en negativo", () => {
        expect(
            getDebtAudience(
                createStats({ gold: -10 }),
                []
            )
        ).toBe("treasury-warning");
    });

    it("no anuncia de nuevo una deuda existente", () => {
        expect(
            getDebtAudience(
                createStats({ gold: -10 }),
                ["indebted"]
            )
        ).toBeNull();
    });

    it("no considera estar a cero como entrar en deuda", () => {
        expect(
            getDebtAudience(
                createStats({ gold: 0 }),
                []
            )
        ).toBeNull();
    });

    it("anuncia la recuperación al volver a positivo", () => {
        expect(
            getDebtAudience(
                createStats({ gold: 10 }),
                ["indebted"]
            )
        ).toBe("treasury-recovery");
    });

    it("no cancela la deuda si el oro es cero", () => {
        expect(
            getDebtAudience(
                createStats({ gold: 0 }),
                ["indebted"]
            )
        ).toBeNull();
    });

    it("respeta la prioridad de la bancarrota", () => {
        expect(
            getDebtAudience(
                createStats({ gold: -50 }),
                []
            )
        ).toBeNull();
    });

    it("cobra cinco oros al finalizar el día", () => {
        const result = applyDailyModifiersWithDebt(
            createStats({ gold: -10 }),
            ["indebted"]
        );

        expect(result.nextStats.gold).toBe(-15);

        expect(result.report.totalChanges.gold).toBe(-5);
        expect(result.report.appliedIds).toContain("indebted");
    });

    it("cobra intereses si los ingresos no saldan la deuda", () => {
        const result = applyDailyModifiersWithDebt(
            createStats({ gold: -10 }),
            ["indebted", "traveling-circus"]
        );

        // Circo: +5. Intereses: -5.
        expect(result.nextStats.gold).toBe(-10);
        expect(result.report.appliedIds).toContain("indebted");
    });

    it("no cobra intereses si los ingresos saldan la deuda", () => {
        const result = applyDailyModifiersWithDebt(
            createStats({ gold: -2 }),
            ["indebted", "traveling-circus"]
        );

        // El circo aporta 5: -2 + 5 = 3.
        expect(result.nextStats.gold).toBe(3);

        expect(result.report.appliedIds).not.toContain(
            "indebted"
        );

        expect(
            getDebtAudience(
                result.nextStats,
                ["indebted", "traveling-circus"]
            )
        ).toBe("treasury-recovery");
    });

    it("continúa cobrando si el oro llega exactamente a cero", () => {
        const result = applyDailyModifiersWithDebt(
            createStats({ gold: -5 }),
            ["indebted", "traveling-circus"]
        );

        // El circo deja el oro en cero, pero
        // la deuda todavía no está saldada.
        expect(result.nextStats.gold).toBe(-5);
    });

    it("los intereses pueden provocar bancarrota", () => {
        const result = applyDailyModifiersWithDebt(
            createStats({ gold: -46 }),
            ["indebted"]
        );

        expect(result.nextStats.gold).toBe(-51);

        expect(checkGameOver(result.nextStats)).toBe(
            "bankruptcy"
        );
    });
});
