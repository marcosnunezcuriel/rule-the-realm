import type { CSSProperties } from "react";

import type { KingdomValues } from "../../types/stats";

import { statDefinitions } from "../../data/kingdom/statDefinitions";

import AnimatedNumber from "../shared/AnimatedNumber";
import StatIcon from "./StatIcon";

import "../../styles/kingdom/KingdomStats.css";

type KingdomStatsProps = {
    stats: KingdomValues;
};

function KingdomStats({ stats }: KingdomStatsProps) {
    return (
        <aside
            className="kingdom-stats"
            aria-label="Estadísticas del reino"
        >
            {statDefinitions.map(({ key, label, color }) => {
                const isTreasuryEmpty =
                    key === "gold" &&
                    stats.gold <= 0;

                const isCritical = key === "gold"
                    ? stats.gold <= 0
                    : stats[key] <= 0;

                return (
                    <div
                        key={key}                 
                        className={
                            isCritical
                                ? "kingdom-stats__card kingdom-stats__card--critical"
                                : "kingdom-stats__card"
                        }
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

                        {isTreasuryEmpty && (
                            <span className="kingdom-stats__treasury-warning">
                                Arcas vacías
                            </span>
                        )}
                    </div>
                );
            })}
        </aside>
    );
}

export default KingdomStats;
