import { describe, expect, it } from "vitest";

import { checkGameOver } from "../../../game/consequences/checkGameOver";
import {
    applyDailyModifiersWithDebt,
    getDebtAudience,
    shouldShowTreasuryWarning,
} from "../../../game/consequences/debtFlow";

import { createStats } from "../../helpers/createStats";

describe("Deudas de la Corona", () => {
    it("anuncia una deuda al entrar en negativo", () => {
        expect(
            getDebtAudience(
                createStats({ gold: -10 }),
                []
            )
        ).toBe("treasury-warning");
    });

    it("no repite el aviso de una deuda existente", () => {
        expect(
            getDebtAudience(
                createStats({ gold: -10 }),
                ["indebted"]
            )
        ).toBeNull();
    });

    it("no considera el oro a cero como una deuda nueva", () => {
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

    it("no cancela la deuda al llegar a cero", () => {
        expect(
            getDebtAudience(
                createStats({ gold: 0 }),
                ["indebted"]
            )
        ).toBeNull();
    });

    it("prioriza la bancarrota", () => {
        expect(
            getDebtAudience(
                createStats({ gold: -50 }),
                []
            )
        ).toBeNull();
    });

    it("cobra cinco oros diarios", () => {
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

        expect(result.nextStats.gold).toBe(-10);
        expect(result.report.appliedIds).toContain("indebted");
    });

    it("no cobra intereses si los ingresos saldan la deuda", () => {
        const result = applyDailyModifiersWithDebt(
            createStats({ gold: -2 }),
            ["indebted", "traveling-circus"]
        );

        expect(result.nextStats.gold).toBe(3);

        expect(result.report.appliedIds).not.toContain(
            "indebted"
        );
    });

    it("continúa cobrando si los ingresos dejan el oro a cero", () => {
        const result = applyDailyModifiersWithDebt(
            createStats({ gold: -5 }),
            ["indebted", "traveling-circus"]
        );

        expect(result.nextStats.gold).toBe(-5);
    });

    it("los intereses pueden provocar bancarrota", () => {
        const result = applyDailyModifiersWithDebt(
            createStats({ gold: -46 }),
            ["indebted"]
        );

        expect(result.nextStats.gold).toBe(-51);

        expect(
            checkGameOver(result.nextStats)
        ).toBe("bankruptcy");
    });

    it("solo anuncia una nueva deuda si el reino sobrevive", () => {
        const previous = createStats({
            gold: 10,
        });

        expect(
            shouldShowTreasuryWarning(
                previous,
                createStats({ gold: -10 })
            )
        ).toBe(true);

        expect(
            shouldShowTreasuryWarning(
                previous,
                createStats({ gold: 0 })
            )
        ).toBe(false);

        expect(
            shouldShowTreasuryWarning(
                previous,
                createStats({ gold: -50 })
            )
        ).toBe(false);

        expect(
            shouldShowTreasuryWarning(
                previous,
                createStats({
                    gold: -10,
                    population: 0,
                })
            )
        ).toBe(false);

        expect(
            shouldShowTreasuryWarning(
                createStats({ gold: -5 }),
                createStats({ gold: -10 })
            )
        ).toBe(false);

        expect(
            shouldShowTreasuryWarning(
                previous,
                null
            )
        ).toBe(false);
    });
});
