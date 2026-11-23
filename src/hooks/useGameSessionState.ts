import { useRef, useState } from "react";

import { getEventById } from "../data/events/eventRegistry";
import { getDayEvents } from "../game/getDayEvents";
import { initialKingdomValues } from "../game/initialState";
import { loadGame } from "../storage/gameStorage";
import { getDebtAudience } from "../game/debtFlow";

import type { Decision } from "../types/dialogue";
import type { GameEvent } from "../types/events";
import type {
    AudiencePhase,
    GameScreen,
    SpecialAudience,
} from "../types/game";
import type { GameOverReason } from "../types/gameOver";
import type { DailyModifierReport, ModifierId } from "../types/modifiers";
import type { KingdomValues } from "../types/stats";

// Estado persistente y restauración de una partida.
// No aplica consecuencias ni decide qué pantalla mostrar.
export function useGameSessionState() {
    // Recuperar el guardado al montar el controlador.
    const [initialSave] = useState(() => loadGame());

    // Estado principal de la jornada y de la interfaz.
    const [day, setDay] = useState(
        initialSave?.day ?? 1
    );

    const [screen, setScreen] = useState<GameScreen>(() => {
        if (
            initialSave?.dayClosed &&
            initialSave.screen === "scene"
        ) {
            const pendingDebtAudience =
                initialSave.specialAudience === null
                    ? getDebtAudience(
                        initialSave.stats,
                        initialSave.activeModifierIds
                    )
                    : initialSave.specialAudience;

            // Solo saltar al resumen si no queda ninguna
            // audiencia especial pendiente de completar.
            if (pendingDebtAudience === null) {
                return "sleep";
            }
        }

        return initialSave?.screen ?? "scene";
    });

    const [
        chapterEndingParagraphIndex,
        setChapterEndingParagraphIndex,
    ] = useState(
        initialSave?.chapterEndingParagraphIndex ?? 0
    );

    const [phase, setPhase] = useState<AudiencePhase>("entering");

    const [audienceIndex, setAudienceIndex] = useState(
        initialSave?.audienceIndex ?? 0
    );

    const [isClosing, setIsClosing] = useState(
        initialSave?.isClosing ?? false
    );

    // Tipo de audiencia extraordinaria en curso.
    const [specialAudience, setSpecialAudience] =
        useState<SpecialAudience>(() => {
            if (initialSave === null) {
                return null;
            }

            if (initialSave.specialAudience !== null) {
                return initialSave.specialAudience;
            }

            if (
                initialSave.dayClosed &&
                initialSave.screen === "scene" &&
                initialSave.isClosing
            ) {
                return getDebtAudience(
                    initialSave.stats,
                    initialSave.activeModifierIds
                );
            }

            return null;
        });

    // Aviso económico pendiente de presentar.
    const [
        pendingTreasuryWarning,
        setPendingTreasuryWarning,
    ] = useState(
        initialSave?.pendingTreasuryWarning ?? false
    );

    // Causa de la derrota, si existe.
    const [gameOverReason, setGameOverReason] = useState<
        GameOverReason | null
    >(initialSave?.gameOverReason ?? null);

    // Decisión ya aplicada en la audiencia actual.
    const [selectedDecision, setSelectedDecision] = useState<
        Decision | null
    >(initialSave?.selectedDecision ?? null);

    // Datos del reino.
    const [stats, setStats] = useState<KingdomValues>(
        initialSave?.stats ?? initialKingdomValues
    );

    const [dayStartStats, setDayStartStats] = useState<
        KingdomValues
    >(
        initialSave?.dayStartStats ?? {
            ...initialKingdomValues,
        }
    );

    const [closingStats, setClosingStats] = useState<
        KingdomValues | null
    >(
        initialSave?.closingStats ?? null
    );

    const [activeModifierIds, setActiveModifierIds] = useState<
        ModifierId[]
    >(
        initialSave?.activeModifierIds ?? []
    );

    // Tema visual fijado al comienzo de cada jornada.
    const [sceneModifierIds, setSceneModifierIds] = useState<
        ModifierId[]
    >(
        initialSave?.sceneModifierIds ?? []
    );

    const [modifierReport, setModifierReport] = useState<
        DailyModifierReport
    >(
        initialSave?.modifierReport ?? {
            appliedIds: [],
            totalChanges: {},
        }
    );

    const [unlockedEventIds, setUnlockedEventIds] = useState<
        string[]
    >(
        initialSave?.unlockedEventIds ?? []
    );

    // Mantener las audiencias de la jornada guardada.
    const [dayEvents, setDayEvents] = useState<GameEvent[]>(() => {
        if (initialSave === null) {
            return getDayEvents(1, []);
        }

        // Recuperar las mismas audiencias, en el mismo orden,
        // mediante el registro central de eventos.
        return initialSave.dayEventIds
            .map((id) => getEventById(id))
            .filter((event): event is GameEvent => {
                return event !== undefined;
            });
    });

    // Protege de un segundo cierre de la misma jornada.
    const dayClosedRef = useRef(initialSave?.dayClosed ?? false);

    return {
        day,
        setDay,
        screen,
        setScreen,
        chapterEndingParagraphIndex,
        setChapterEndingParagraphIndex,
        phase,
        setPhase,
        audienceIndex,
        setAudienceIndex,
        isClosing,
        setIsClosing,
        specialAudience,
        setSpecialAudience,
        pendingTreasuryWarning,
        setPendingTreasuryWarning,
        gameOverReason,
        setGameOverReason,
        selectedDecision,
        setSelectedDecision,
        stats,
        setStats,
        dayStartStats,
        setDayStartStats,
        closingStats,
        setClosingStats,
        activeModifierIds,
        setActiveModifierIds,
        sceneModifierIds,
        setSceneModifierIds,
        modifierReport,
        setModifierReport,
        unlockedEventIds,
        setUnlockedEventIds,
        dayEvents,
        setDayEvents,
        dayClosedRef,
    };
}
