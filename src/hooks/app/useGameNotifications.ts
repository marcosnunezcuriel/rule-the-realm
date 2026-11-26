import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { soundEngine } from "../../audio/soundEngine";

import type { AchievementId } from "../../data/registries/achievementRegistry";

import { getStatDifferences } from "../../game/consequences/getStatDifferences";
import { getNotificationEffect } from "../../game/notifications/getNotificationEffect";
import { insertGameNotification } from "../../game/notifications/insertGameNotification";

import { unlockAchievement } from "../../storage/achievementsStorage";
import { unlockItem } from "../../storage/itemsStorage";

import type { ModifierId } from "../../types/modifiers";
import type {
    GameNotification,
    ModifierChange,
} from "../../types/notifications";
import type { KingdomValues } from "../../types/stats";
import type { MonarchRole } from "../../types/monarch";
import type { GameReward } from "../../types/rewards";

// Eliminar la secuencia de cada variante de notificación.
type WithoutSequence<T> =
    T extends { sequence: number }
        ? Omit<T, "sequence">
        : never;

type NotificationInput =
    WithoutSequence<GameNotification>;

// Mantener esta duración sincronizada con --duration-notification de los estilos.
const NOTIFICATION_DURATION = 5000;

// Gestionar los avisos y su orden de aparición.
export function useGameNotifications() {
    const [notificationQueue, setNotificationQueue] =
        useState<GameNotification[]>([]);

    const nextNotificationId = useRef(0);

    const displayedSequenceRef =
        useRef<number | null>(null);

    const handleDismissNotification = useCallback(
        (sequence: number) => {
            setNotificationQueue((previous) => {
                if (
                    previous[0]?.sequence !== sequence
                ) {
                    return previous;
                }

                return previous.slice(1);
            });
        },
        []
    );

    const activeNotification =
        notificationQueue[0] ?? null;

    useEffect(() => {
        displayedSequenceRef.current =
            activeNotification?.sequence ?? null;

        if (activeNotification === null) {
            return;
        }

        soundEngine.playEffect(
            getNotificationEffect(
                activeNotification
            )
        );

        const timeoutId = window.setTimeout(() => {
            handleDismissNotification(
                activeNotification.sequence
            );
        }, NOTIFICATION_DURATION);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [
        activeNotification,
        handleDismissNotification,
    ]);

    function enqueueNotification(
        input: NotificationInput
    ) {
        nextNotificationId.current += 1;

        const notification: GameNotification = {
            ...input,
            sequence: nextNotificationId.current,
        };

        const displayedSequence =
            displayedSequenceRef.current;

        setNotificationQueue((previous) => {
            return insertGameNotification(
                previous,
                notification,
                displayedSequence
            );
        });
    }

    function handleStatsChanged(
        previous: KingdomValues,
        next: KingdomValues
    ) {
        const changes = getStatDifferences(
            previous,
            next
        );

        if (Object.keys(changes).length === 0) {
            return;
        }

        enqueueNotification({
            kind: "stats",
            changes,
        });
    }

    function handleModifierChanged(
        id: ModifierId,
        change: ModifierChange
    ) {
        enqueueNotification({
            kind: change === "added"
                ? "modifier-added"
                : "modifier-removed",

            id,
        });
    }

    function handleAchievementUnlocked(
        id: AchievementId
    ) {
        if (!unlockAchievement(id)) {
            return;
        }

        enqueueNotification({
            kind: "achievement",
            id,
        });
    }

     // Registrar el objeto correspondiente al protagonista.
    function handleItemReward(
        reward: Extract<GameReward, { kind: "item" }>,
        monarch: MonarchRole
    ) {
        const id = monarch === "queen"
            ? reward.queenItemId ?? reward.itemId
            : reward.itemId;

        if (!unlockItem(id)) {
            return;
        }

        enqueueNotification({
            kind: "item-unlocked",
            id,
        });
    }

    function notifyAnthemUnlocked() {
        enqueueNotification({
            kind: "item-unlocked",
            id: "anthem-of-astaria",
        });
    }

    function clearNotifications() {
        setNotificationQueue([]);
    }

    return {
        activeNotification,

        handleStatsChanged,
        handleModifierChanged,
        handleAchievementUnlocked,

        handleItemReward,
        notifyAnthemUnlocked,
        clearNotifications,
    };
}
