// Representa los avisos de modificadores, logros y recompensas.

import FormattedText from "./FormattedText";

import { modifierDefinitions } from "../../data/kingdom/modifiers";
import { achievements } from "../../data/registries/achievementRegistry";
import { items } from "../../data/registries/itemRegistry";

import type { GameNotification } from "../../types/notifications";

import { assetUrl } from "../../utils/assetUrl";

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
    const item =
        notification.kind === "item-unlocked"
            ? items[notification.id]
            : null;

    const isAchievement =
        notification.kind === "achievement";

    const name =
        notification.kind === "item-unlocked"
            ? items[notification.id].name
            : notification.kind === "achievement"
                ? achievements.find(
                    (item) => item.id === notification.id
                )?.name ?? "Logro"
                : modifierDefinitions[notification.id].name;

    const label =
        notification.kind === "item-unlocked"
            ? "¡Nuevo objeto conseguido!"
            : notification.kind === "achievement"
                ? "¡Logro desbloqueado!"
                : notification.kind === "modifier-added"
                    ? "Modificador añadido"
                    : "Modificador eliminado";

    return (
        <>
            {/* Aparición del objeto antes de mostrar su notificación */}
            {item !== null && (
                <div
                    className="item-reveal"
                    aria-hidden="true"
                >
                    <img
                        className="item-reveal__image"
                        src={assetUrl(item.image)}
                        alt=""
                        draggable={false}
                    />
                </div>
            )}

            <div
                className={
                    `notification-toast ` +
                    `notification-toast--${notification.kind}`
                }
                role="status"
                aria-live="polite"
            >
                {item !== null ? (
                    <img
                        className="notification-toast__item-image"
                        src={assetUrl(item.image)}
                        alt=""
                        draggable={false}
                    />
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

                    {item !== null && (
                        <p className="notification-toast__description">
                            <FormattedText text={item.description} />
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

export default NotificationToast;
