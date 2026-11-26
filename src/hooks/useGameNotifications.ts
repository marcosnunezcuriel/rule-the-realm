import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { soundEngine } from "../audio/soundEngine";

import { unlockAchievement } from "../storage/achievementsStorage";

import { getNotificationEffect } from "../game/getNotificationEffect";
import { getStatDifferences } from "../game/getStatDifferences";
import { insertGameNotification } from "../game/insertGameNotification";

import type { AchievementId } from "../data/achievements";
import type { KingdomValues } from "../types/stats";
import type { ModifierId } from "../types/modifiers";

import type {
    GameNotification,
    ModifierChange,
} from "../types/notifications";

const NOTIFICATION_DURATION = 5000;

// Eliminar la secuencia de cada variante de notificación.
type WithoutSequence<T> =
    T extends { sequence: number }
        ? Omit<T, "sequence">
        : never;

type NotificationInput =
    WithoutSequence<GameNotification>;

// Gestionar los avisos y su orden de aparición.
export function useGameNotifications() {
    const [notificationQueue, setNotificationQueue] =
        useState<GameNotification[]>([]);

    const nextNotificationId = useRef(0);

    const displayedSequenceRef =
        useRef<number | null>(null);

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

    function notifyAnthemUnlocked() {
        enqueueNotification({
            kind: "anthem-unlocked",
        });
    }

    function clearNotifications() {
        setNotificationQueue([]);
    }

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

    return {
        activeNotification,

        handleStatsChanged,
        handleModifierChanged,
        handleAchievementUnlocked,

        notifyAnthemUnlocked,
        clearNotifications,
    };
}
