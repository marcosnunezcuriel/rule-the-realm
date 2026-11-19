import "../styles/DaySummary.css";

type DaySummaryProps = {
    day: number;
    onNextDay: () => void;
};

const statistics = [
    "Oro",
    "Prestigio",
    "Fe",
    "Población",
    "Ejército",
];

function DaySummary({ day, onNextDay }: DaySummaryProps) {
    return (
        <main className="day-summary">
            <div className="day-summary__panel">
                <h2>Resumen del día {day}</h2>

                <p className="day-summary__subtitle">
                    La jornada ha terminado, Majestad.
                </p>

                <h3>Estado del reino</h3>

                <div className="day-summary__stats">
                    {statistics.map((statistic) => (
                        <div
                            className="day-summary__stat"
                            key={statistic}
                        >
                            <span>{statistic}</span>
                            <strong>—</strong>
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
                    Vista provisional. Las estadísticas y los
                    modificadores todavía no están implementados.
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
