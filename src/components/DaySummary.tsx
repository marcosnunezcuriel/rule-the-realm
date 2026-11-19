
import type { KingdomValues } from "../types/stats";

import { statDefinitions } from "../data/statDefinitions";

import "../styles/DaySummary.css";

type DaySummaryProps = {
    day: number;
    stats: KingdomValues;
    onNextDay: () => void;
};

function DaySummary({
    day,
    stats,
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
                    {statDefinitions.map(({ key, label }) => (
                        <div
                            className="day-summary__stat"
                            key={key}
                        >
                            <span>{label}</span>
                            <strong>{stats[key]}</strong>
                        </div>
                    ))}
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
