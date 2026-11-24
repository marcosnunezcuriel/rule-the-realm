import type { CSSProperties } from "react";

import { statDefinitions } from "../../data/kingdom/statDefinitions";

import type { StatChangeNotification } from "../../types/notifications";

import StatIcon from "./StatIcon";

import "../../styles/kingdom/StatChangeToast.css";

type StatChangeToastProps = {
    notification: StatChangeNotification;
};

function StatChangeToast({
    notification,
}: StatChangeToastProps) {

    const affectedStats = statDefinitions.filter(
        ({ key }) => (notification.changes[key] ?? 0) !== 0
    );

    return (
        <div
            className="stat-change-toast"
            role="status"
            aria-live="polite"
        >
            {affectedStats.map(({ key, label, color }) => {
                const amount = notification.changes[key] ?? 0;

                const sign = amount > 0 ? "+" : "";

                const changeType = amount > 0
                    ? "positive"
                    : "negative";

                return (
                    <div
                        key={key}
                        className={
                            "stat-change-toast__item " +
                            `stat-change-toast__item--${changeType}`
                        }
                        style={
                            {
                                "--stat-color": color,
                            } as CSSProperties
                        }
                        aria-label={`${label}: ${sign}${amount}`}
                    >
                        <span className="stat-change-toast__icon">
                            <StatIcon stat={key} />
                        </span>

                        <strong className="stat-change-toast__amount">
                            {sign}{amount}
                        </strong>
                    </div>
                );
            })}
        </div>
    );
}

export default StatChangeToast;
