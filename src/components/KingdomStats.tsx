
import type { CSSProperties } from "react";
import type { KingdomValues } from "../types/stats";

import { statDefinitions } from "../data/statDefinitions";
import AnimatedNumber from "./AnimatedNumber";
import StatIcon from "./StatIcon";

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
            {statDefinitions.map(({ key, label, color }) => (
                <div
                    key={key}
                    className="kingdom-stats__card"
                    style={
                        { "--stat-color": color } as CSSProperties
                    }
                >
                    <span className="kingdom-stats__icon">
                        <StatIcon stat={key} />
                    </span>

                    <span className="kingdom-stats__label">
                        {label}
                    </span>

                    <strong className="kingdom-stats__value">
                        <AnimatedNumber value={stats[key]} />
                    </strong>
                </div>
            ))}
        </aside>
    );
}

export default KingdomStats;
