import { getChapterForDisplay } from "../data/chapters";
import { getEventById } from "../data/events/eventRegistry";
import { modifierDefinitions } from "../data/kingdom/modifiers";
import { statDefinitions } from "../data/kingdom/statDefinitions";
import { gameOverMessages } from "../data/narrative/gameOverMessages";

import type { ModifierId } from "../types/modifiers";
import type { SaveGame } from "../types/saveGame";

// Los nombres de las estadísticas proceden de su registro.
// No mantenemos otra lista independiente.
const STAT_KEYS = new Set<string>(
    statDefinitions.map(({ key }) => key)
);

// Comprobar que un valor sea un objeto normal.
function isRecord(
    value: unknown
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

// Comprobar que exista una lista de identificadores.
function isStringArray(
    value: unknown
): value is string[] {
    return (
        Array.isArray(value) &&
        value.every((item) => {
            return (
                typeof item === "string" &&
                item.length > 0
            );
        })
    );
}

// Comprobar que las estadísticas estén completas.
function isStats(value: unknown): boolean {
    if (!isRecord(value)) {
        return false;
    }

    // Deben existir exactamente las estadísticas
    // definidas actualmente para el reino.
    if (Object.keys(value).length !== STAT_KEYS.size) {
        return false;
    }

    return statDefinitions.every(({ key }) => {
        const amount = value[key];

        return (
            typeof amount === "number" &&
            Number.isFinite(amount)
        );
    });
}

// Los cambios pueden afectar a una parte de las estadísticas.
function isChanges(value: unknown): boolean {
    return (
        isRecord(value) &&
        Object.entries(value).every(([key, amount]) => {
            return (
                STAT_KEYS.has(key) &&
                typeof amount === "number" &&
                Number.isFinite(amount)
            );
        })
    );
}

// Todos los modificadores guardados deben existir.
// También rechazamos modificadores repetidos.
function isModifierArray(
    value: unknown
): value is ModifierId[] {
    return (
        isStringArray(value) &&
        new Set(value).size === value.length &&
        value.every((id) => {
            return Object.hasOwn(modifierDefinitions, id);
        })
    );
}

// Las audiencias pendientes deben existir y pertenecer
// realmente a la jornada que se está recuperando.
function isDayEventArray(
    value: unknown,
    day: number
): value is string[] {
    return (
        isStringArray(value) &&
        new Set(value).size === value.length &&
        value.every((id) => {
            return getEventById(id)?.day === day;
        })
    );
}

// Comprobar que el índice apunta a un párrafo existente.
function isValidParagraphIndex(
    index: unknown,
    day: number
): boolean {
    if (
        typeof index !== "number" ||
        !Number.isInteger(index) ||
        index < 0
    ) {
        return false;
    }

    const chapter = getChapterForDisplay(day);

    return index < chapter.endingParagraphs.length;
}

// Determinar si los datos corresponden al único
// formato de guardado utilizado por el juego.
export function isSaveGame(
    value: unknown
): value is SaveGame {
    if (!isRecord(value)) {
        return false;
    }

    const day = value.day;

    if (
        typeof day !== "number" ||
        !Number.isInteger(day) ||
        day < 1
    ) {
        return false;
    }

    const report = value.modifierReport;

    return (
        (
            value.screen === "scene" ||
            value.screen === "summary" ||
            value.screen === "gameover" ||
            value.screen === "chapter-ending"
        ) &&
        isValidParagraphIndex(
            value.chapterEndingParagraphIndex,
            day
        ) &&
        isStats(value.stats) &&
        isStats(value.dayStartStats) &&
        (
            value.closingStats === null ||
            isStats(value.closingStats)
        ) &&
        typeof value.audienceIndex === "number" &&
        Number.isInteger(value.audienceIndex) &&
        value.audienceIndex >= 0 &&
        isDayEventArray(value.dayEventIds, day) &&
        value.audienceIndex <= value.dayEventIds.length &&
        typeof value.isClosing === "boolean" &&
        typeof value.dayClosed === "boolean" &&
        (
            value.selectedDecision === null ||
            value.selectedDecision === "yes" ||
            value.selectedDecision === "no"
        ) &&
        // Los desbloqueos futuros pueden existir antes
        // de que su evento esté implementado.
        isStringArray(value.unlockedEventIds) &&
        isModifierArray(value.activeModifierIds) &&
        isModifierArray(value.sceneModifierIds) &&
        isRecord(report) &&
        isModifierArray(report.appliedIds) &&
        isChanges(report.totalChanges) &&
        (
            value.specialAudience === null ||
            value.specialAudience === "treasury-warning" ||
            value.specialAudience === "defeat"
        ) &&
        typeof value.pendingTreasuryWarning === "boolean" &&
        (
            value.gameOverReason === null ||
            (
                typeof value.gameOverReason === "string" &&
                Object.hasOwn(
                    gameOverMessages,
                    value.gameOverReason
                )
            )
        ) &&
        (
            value.specialAudience !== "defeat" ||
            value.gameOverReason !== null
        ) &&
        (
            value.screen !== "gameover" ||
            value.gameOverReason !== null
        )
    );
}
