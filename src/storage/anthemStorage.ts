// Conserva permanentemente el desbloqueo del himno de Astaria.

export const ANTHEM_UNLOCK_KEY =
    "rule-the-realm.anthem-unlocked";

export function loadAnthemUnlocked(): boolean {
    try {
        return window.localStorage.getItem(
            ANTHEM_UNLOCK_KEY
        ) === "true";
    } catch {
        return false;
    }
}

export function unlockAnthem(): boolean {
    if (loadAnthemUnlocked()) {
        return false;
    }

    try {
        window.localStorage.setItem(
            ANTHEM_UNLOCK_KEY,
            "true"
        );

        return true;
    } catch {
        console.warn(
            "No se pudo guardar el desbloqueo del himno."
        );

        return false;
    }
}
