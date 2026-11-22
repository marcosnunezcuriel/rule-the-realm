import { useEffect } from "react";

import {
    achievements,
    type AchievementId,
} from "../../data/achievements";

import "../../styles/screens/AchievementToast.css";

type AchievementToastProps = {
    achievementId: AchievementId;
    onDismiss: () => void;
};

function AchievementToast({
    achievementId,
    onDismiss,
}: AchievementToastProps) {
    const achievement = achievements.find(
        (item) => item.id === achievementId
    );

    useEffect(() => {
        const timeoutId = window.setTimeout(
            onDismiss,
            5000
        );

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [achievementId, onDismiss]);

    if (!achievement) {
        return null;
    }

    return (
        <div
            className="achievement-toast"
            role="status"
            aria-live="polite"
        >
            <svg
                className="achievement-toast__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <circle cx="12" cy="8" r="5" />
                <path d="M8.2 12.5 6.9 22l5.1-3 5.1 3-1.3-9.5" />
            </svg>

            <div className="achievement-toast__content">
                <span className="achievement-toast__label">
                    ¡Logro desbloqueado!
                </span>

                <strong className="achievement-toast__name">
                    {achievement.name}
                </strong>
            </div>
        </div>
    );
}

export default AchievementToast;
