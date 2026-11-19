import type { KingdomValues } from "../types/stats";

import { statDefinitions } from "../data/statDefinitions";

import "../styles/KingdomStats.css";

type KingdomStatsProps = {
    stats: KingdomValues;
};

function KingdomStats({ stats }: KingdomStatsProps) {
    return (
        <aside
            className="kingdom-stats"
            aria-label="Estadísticas del reino"
        >
            {statDefinitions.map(({ key, label }) => (
                <div
                    key={key}
                    className={`kingdom-stats__card kingdom-stats__card--${key}`}
                >
                    <span className="kingdom-stats__label">
                        {label}
                    </span>

                    <strong className="kingdom-stats__value">
                        {stats[key]}
                    </strong>
                </div>
            ))}
        </aside>
    );
}

export default KingdomStats;
