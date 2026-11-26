// Conserva los objetos conseguidos independientemente de la partida activa.

import {
    items,
    type ItemId,
    type ItemRewardId,
} from "../data/registries/itemRegistry";

import { loadAnthemUnlocked } from "./anthemStorage";

export const ITEMS_KEY = "rule-the-realm.items";

// Recuperar los objetos guardados y descartar identificadores inválidos.
function loadStoredItems(): ItemRewardId[] {
    try {
        const raw = window.localStorage.getItem(
            ITEMS_KEY
        );

        if (raw === null) {
            return [];
        }

        const parsed: unknown = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
            return [];
        }

        const valid = parsed.filter(
            (id: unknown): id is ItemRewardId => {
                return (
                    typeof id === "string" &&
                    id !== "anthem-of-astaria" &&
                    Object.hasOwn(items, id)
                );
            }
        );

        return [...new Set(valid)];
    } catch {
        return [];
    }
}

export function loadUnlockedItems(): ItemId[] {
    const unlocked: ItemId[] = loadStoredItems();

    // El desbloqueo musical es también el desbloqueo
    // del objeto correspondiente en la colección.
    if (loadAnthemUnlocked()) {
        unlocked.push("anthem-of-astaria");
    }

    return unlocked;
}

export function unlockItem(
    id: ItemRewardId
): boolean {
    const unlocked = loadStoredItems();

    if (unlocked.includes(id)) {
        return false;
    }

    try {
        window.localStorage.setItem(
            ITEMS_KEY,
            JSON.stringify([...unlocked, id])
        );

        return true;
    } catch {
        console.warn(
            "No se pudo guardar el objeto."
        );

        return false;
    }
}
