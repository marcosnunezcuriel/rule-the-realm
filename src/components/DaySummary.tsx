import type { CSSProperties } from "react";

import type { KingdomValues } from "../types/stats";
import type { DailyModifierReport } from "../types/modifiers";

import { statDefinitions } from "../data/kingdom/statDefinitions";
import { modifierDefinitions } from "../data/kingdom/modifiers";

import StatIcon from "./StatIcon";
import AnimatedNumber from "./AnimatedNumber";

import "../styles/DaySummary.css";

type DaySummaryProps = {
    day: number;
    stats: KingdomValues;
    startStats: KingdomValues;
    animatedFromStats: KingdomValues;
    modifierReport: DailyModifierReport;
    onNextDay: () => void;
    nextLabel?: string;
};

function DaySummary({
    day,
    stats,
    startStats,
    animatedFromStats,
    modifierReport,
    onNextDay,
    nextLabel = "Siguiente día",
}: DaySummaryProps) {
    return (
        <main className="day-summary">
            <div className="day-summary__panel">
                <h2>Resumen del día {day}</h2>

                <p className="day-summary__subtitle">
                    La jornada ha terminado, Majestad.
                </p>

                <h3>Estado del reino</h3>

                <div className="day-summary__stats">
                    {statDefinitions.map(({ key, label, color }) => {
                        const difference =
                            stats[key] - startStats[key];

                        const changeType =
                            difference > 0
                                ? "positive"
                                : difference < 0
                                    ? "negative"
                                    : "neutral";

                        const formattedDifference =
                            difference > 0
                                ? `+${difference}`
                                : String(difference);

                        return (
                            <div
                                key={key}
                                className="day-summary__stat"
                                style={
                                    {
                                        "--stat-color": color,
                                    } as CSSProperties
                                }
                            >
                                <div className="day-summary__stat-heading">
                                    <StatIcon stat={key} />
                                    <span>{label}</span>
                                </div>

                                <strong className="day-summary__stat-value">
                                    <AnimatedNumber
                                        value={stats[key]}
                                        initialValue={animatedFromStats[key]}
                                        delayMs={800}
                                    />
                                </strong>

                                <span
                                    className={
                                        `day-summary__stat-change ` +
                                        `day-summary__stat-change--${changeType}`
                                    }
                                >
                                    {formattedDifference} hoy
                                </span>
                            </div>
                        );
                    })}
                </div>

                <h3>Modificadores aplicados hoy</h3>

                <div className="day-summary__modifiers">
                    {modifierReport.appliedIds.length === 0 ? (
                        <p className="day-summary__empty">
                            No se aplicaron modificadores este día.
                        </p>
                    ) : (
                        modifierReport.appliedIds.map((modifierId) => {
                            const modifier =
                                modifierDefinitions[modifierId];

                            return (
                                <article
                                    key={modifierId}
                                    className="day-summary__modifier"
                                >
                                    <h4 className="day-summary__modifier-name">
                                        {modifier.name}
                                    </h4>

                                    <p className="day-summary__modifier-description">
                                        {modifier.description}
                                    </p>

                                    <div className="day-summary__modifier-effects">
                                        {statDefinitions
                                            .filter(({ key }) => {
                                                return (
                                                    modifier.dailyChanges[key] ?? 0
                                                ) !== 0;
                                            })
                                            .map(({ key, label }) => {
                                                const amount =
                                                    modifier.dailyChanges[key] ?? 0;

                                                const changeType =
                                                    amount > 0
                                                        ? "positive"
                                                        : "negative";

                                                return (
                                                    <span
                                                        key={key}
                                                        className={
                                                            `day-summary__modifier-effect ` +
                                                            `day-summary__modifier-effect--${changeType}`
                                                        }
                                                    >
                                                        {amount > 0 ? "+" : ""}
                                                        {amount} {label}
                                                    </span>
                                                );
                                            })}
                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>
                
                <button
                    type="button"
                    className="day-summary__next"
                    onClick={onNextDay}
                >
                    {nextLabel}
                </button>
            </div>
        </main>
    );
}

export default DaySummary;
