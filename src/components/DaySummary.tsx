import type { CSSProperties } from "react";
import type { KingdomValues } from "../types/stats";

import { statDefinitions } from "../data/statDefinitions";
import StatIcon from "./StatIcon";

import "../styles/DaySummary.css";

type DaySummaryProps = {
    day: number;
    stats: KingdomValues;
    startStats: KingdomValues;
    onNextDay: () => void;
};

function DaySummary({
    day,
    stats,
    startStats,
    onNextDay,
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
                                    { "--stat-color": color } as CSSProperties
                                }
                            >
                                <div className="day-summary__stat-heading">
                                    <StatIcon stat={key} />
                                    <span>{label}</span>
                                </div>

                                <strong className="day-summary__stat-value">
                                    {stats[key]}
                                </strong>

                                <span
                                    className={`day-summary__stat-change day-summary__stat-change--${changeType}`}
                                >
                                    {formattedDifference} hoy
                                </span>
                            </div>
                        );
                    })}
                </div>

                <h3>Modificadores activos</h3>

                <div className="day-summary__modifiers">
                    <p>
                        Los modificadores y sus efectos
                        diarios se mostrarán aquí.
                    </p>
                </div>

                <p className="day-summary__notice">
                    Los modificadores todavía no están implementados.
                </p>

                <button
                    type="button"
                    className="day-summary__next"
                    onClick={onNextDay}
                >
                    Siguiente día
                </button>
            </div>
        </main>
    );
}

export default DaySummary;
