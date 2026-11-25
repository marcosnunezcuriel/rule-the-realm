export const ANTHEM_UNLOCK_KEY =
    "rule-the-realm.anthem-unlocked";

const LEGACY_ACHIEVEMENTS_KEY =
    "rule-the-realm.achievements";

const LEGACY_ANTHEM_ACHIEVEMENT =
    "astaria-anthem";

// Comprobar si el himno ya está desbloqueado.
export function loadAnthemUnlocked(): boolean {
    try {
        const unlocked = window.localStorage.getItem(
            ANTHEM_UNLOCK_KEY
        );

        if (unlocked === "true") {
            return true;
        }

        const legacyRaw = window.localStorage.getItem(
            LEGACY_ACHIEVEMENTS_KEY
        );

        if (legacyRaw === null) {
            return false;
        }

        const legacy: unknown = JSON.parse(legacyRaw);

        const legacyUnlocked =
            Array.isArray(legacy) &&
            legacy.includes(LEGACY_ANTHEM_ACHIEVEMENT);

        // Migrar el desbloqueo antiguo al nuevo almacenamiento.
        // Así no se pierde al actualizar la colección de logros.
        if (legacyUnlocked) {
            window.localStorage.setItem(
                ANTHEM_UNLOCK_KEY,
                "true"
            );
        }

        return legacyUnlocked;
    } catch {
        return false;
    }
}

// Devuelve true solo cuando se desbloquea por primera vez.
export function unlockAnthem(): boolean {
    if (loadAnthemUnlocked()) {
        return false;
    }

    try {
        window.localStorage.setItem(
            ANTHEM_UNLOCK_KEY,
            "true"
        );
    } catch {
        console.warn(
            "No se pudo guardar el desbloqueo del himno."
        );
    }

    return true;
}
