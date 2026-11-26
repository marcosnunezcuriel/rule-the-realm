import FormattedText from "./FormattedText";

import { modifierDefinitions } from "../../data/kingdom/modifiers";
import { achievements } from "../../data/registries/achievementRegistry";

import type { GameNotification } from "../../types/notifications";

import "../../styles/shared/NotificationToast.css";

type NotificationToastProps = {
    notification: Exclude<
        GameNotification,
        { kind: "stats" }
    >;
};

function NotificationToast({
    notification,
}: NotificationToastProps) {
    const isAnthem =
        notification.kind === "anthem-unlocked";

    const isAchievement =
        notification.kind === "achievement";

    const name = isAnthem
        ? "Has desbloqueado el Himno de Astaria"
        : notification.kind === "achievement"
            ? achievements.find(
                (item) => item.id === notification.id
            )?.name ?? "Logro"
            : modifierDefinitions[notification.id].name;

    const label = isAnthem
        ? "¡Nuevo contenido desbloqueado!"
        : notification.kind === "achievement"
            ? "¡Logro desbloqueado!"
            : notification.kind === "modifier-added"
                ? "Modificador añadido"
                : "Modificador eliminado";

    return (
        <div
            className={
                `notification-toast ` +
                `notification-toast--${notification.kind}`
            }
            role="status"
            aria-live="polite"
        >
            {isAnthem ? (
                <svg
                    className="notification-toast__icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M9 18V5l12-2v13" />
                    <ellipse cx="6" cy="18" rx="3" ry="2" />
                    <ellipse cx="18" cy="16" rx="3" ry="2" />
                </svg>
            ) : isAchievement ? (
                <svg
                    className="notification-toast__icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <circle cx="12" cy="8" r="5" />

                    <path
                        d="M8.2 12.5 6.9 22l5.1-3 5.1 3-1.3-9.5"
                    />
                </svg>
            ) : (
                <svg
                    className="notification-toast__icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M7 12h10" />

                    {notification.kind === "modifier-added" && (
                        <path d="M12 7v10" />
                    )}
                </svg>
            )}

            <div className="notification-toast__content">
                <span className="notification-toast__label">
                    {label}
                </span>

                <strong className="notification-toast__name">
                    <FormattedText text={name} />
                </strong>

                {isAnthem && (
                    <p className="notification-toast__description">
                        Consulta el panel de control de sonido.
                    </p>
                )}
            </div>
        </div>
    );
}

export default NotificationToast;
