import { useEffect, useRef, useState } from "react";

import {
    closingDialogue,
    treasuryWarningDialogue,
    getDefeatAnnouncementDialogue,
} from "../data/specialAudiences";
import { demoAudiences } from "../data/demoAudiences";

import { applyDailyModifiers } from "../game/applyDailyModifiers";
import { applyStatChanges } from "../game/applyStatChanges";
import { getDayEvents } from "../game/getDayEvents";
import { getSceneBackgrounds } from "../game/getSceneBackgrounds";
import { initialKingdomValues } from "../game/initialState";
import { checkGameOver } from "../game/checkGameOver";

import { loadGame, saveGame } from "../storage/gameStorage";

import type { GameOverReason } from "../types/gameOver";
import type { Decision } from "../types/dialogue";
import type {
    AudiencePhase,
    GameScreen,
    TransitionStage,
} from "../types/game";
import type {
    DailyModifierReport,
    ModifierId,
} from "../types/modifiers";
import type { KingdomValues } from "../types/stats";
import type { GameEvent } from "../types/events";
import type { SaveGameV1 } from "../types/saveGame";

const BACKGROUND_TRANSITION_DURATION = 1500;
const ROYAL_ADVISOR_IMAGE =
    "/assets/characters/courtiers/royal-advisor.png";

export function useGameController() {
    // Recuperar el guardado al montar el controlador.
    const [initialSave] = useState(() => loadGame());

    // Estado principal de la jornada y de la interfaz.
    const [day, setDay] = useState(
        initialSave?.day ?? 1
    );

    const [screen, setScreen] = useState<GameScreen>(() => {
        // Si el cierre ya aplicó los modificadores,
        // recuperar el resumen en lugar de repetirlo.
        if (
            initialSave?.dayClosed &&
            initialSave.screen === "scene"
        ) {
            return "summary";
        }

        return initialSave?.screen ?? "scene";
    });

    const [phase, setPhase] = useState<AudiencePhase>("entering");

    const [audienceIndex, setAudienceIndex] = useState(
        initialSave?.audienceIndex ?? 0
    );

    const [isClosing, setIsClosing] = useState(
        initialSave?.isClosing ?? false
    );

    // Tipo de audiencia extraordinaria en curso.
    const [specialAudience, setSpecialAudience] = useState<
        "treasury-warning" | "defeat" | null
    >(initialSave?.specialAudience ?? null);

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

    const [transitionStage, setTransitionStage] =
        useState<TransitionStage>("idle");
    const [transitionTarget, setTransitionTarget] =
        useState<GameScreen | null>(null);

    // Datos del reino; estos serán relevantes para guardar partidas.
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

    // Mantener exactamente las audiencias que tenía la jornada guardada.
    const [dayEvents, setDayEvents] = useState<GameEvent[]>(() => {
        if (initialSave === null) {
            return getDayEvents(1, []);
        }

        return initialSave.dayEventIds
            .map((id) => {
                return demoAudiences.find((event) => event.id === id);
            })
            .filter((event): event is GameEvent => {
                return event !== undefined;
            });
    });

    // Protege de un segundo cierre de la misma jornada.
    const dayClosedRef = useRef(initialSave?.dayClosed ?? false);

    // Datos derivados: no necesitamos guardarlos en otros useState.
    const currentAudience = dayEvents[audienceIndex];
    const morningCount = Math.ceil(dayEvents.length / 2);

    const timeOfDay: "morning" | "evening" | "night" = isClosing
        ? "night"
        : dayEvents.length === 0 || audienceIndex < morningCount
            ? "morning"
            : "evening";

    const visitorImage =
        isClosing ||
        specialAudience !== null ||
        !currentAudience
            ? ROYAL_ADVISOR_IMAGE
            : currentAudience.image;

    const dialogue =
        specialAudience === "defeat" && gameOverReason !== null
            ? getDefeatAnnouncementDialogue(gameOverReason)
            : specialAudience === "treasury-warning"
                ? treasuryWarningDialogue
                : isClosing || !currentAudience
                    ? closingDialogue
                    : currentAudience.dialogue;

    const dialogueKey =
        specialAudience === "defeat"
            ? `defeat-${gameOverReason}`
            : specialAudience === "treasury-warning"
                ? "treasury-warning"
                : isClosing
                    ? "closing"
                    : currentAudience?.id ?? "no-audiences";

    const continueLabel = isClosing
        ? "Terminar día"
        : "Continuar";

    const visibleStats = closingStats ?? stats;
    const backgroundMap = getSceneBackgrounds(sceneModifierIds);

    // Guardar el estado lógico tras cada cambio relevante.
    // Las fases de animación no se guardan: al cargar se reinicia
    // la entrada del personaje o se recupera la pantalla actual.
    useEffect(() => {
        const savedState: SaveGameV1 = {
            version: 1,
            day,
            screen,
            stats,
            dayStartStats,
            closingStats,
            audienceIndex,
            dayEventIds: dayEvents.map((event) => event.id),
            isClosing,
            dayClosed: dayClosedRef.current,
            selectedDecision,
            unlockedEventIds,
            activeModifierIds,
            sceneModifierIds,
            modifierReport,
            specialAudience,
            pendingTreasuryWarning,
            gameOverReason,
        };

        saveGame(savedState);
    }, [
        day,
        screen,
        stats,
        dayStartStats,
        closingStats,
        audienceIndex,
        dayEvents,
        isClosing,
        selectedDecision,
        unlockedEventIds,
        activeModifierIds,
        sceneModifierIds,
        modifierReport,
        specialAudience,
        pendingTreasuryWarning,
        gameOverReason,
    ]);

    // El personaje no entra hasta que termina el cambio de fondo.
    useEffect(() => {
        if (phase !== "transitioning") {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setPhase("entering");
        }, BACKGROUND_TRANSITION_DURATION);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [phase]);

    function startScreenTransition(target: GameScreen) {
        if (transitionStage !== "idle") {
            return;
        }

        setTransitionTarget(target);
        setTransitionStage("darkening");
    }

    // Termina la entrada o salida del personaje actual.
    function handleVisitorAnimationEnd() {
        // El visitante acaba de entrar.
        if (phase === "entering") {
            setPhase("speaking");
            return;
        }

        // Ignorar cualquier otra animación.
        if (phase !== "exiting") {
            return;
        }

        // La siguiente intervención no debe heredar la decisión anterior.
        setSelectedDecision(null);

        // Ha terminado el anuncio de derrota.
        if (specialAudience === "defeat") {
            startScreenTransition("gameover");
            return;
        }

        // Ha terminado el cierre nocturno habitual.
        if (isClosing) {
            startScreenTransition("summary");
            return;
        }

        if (specialAudience === "treasury-warning") {
            // La advertencia termina y continuamos
            // con la siguiente audiencia normal.
            setSpecialAudience(null);
        } else {
            // La audiencia normal acaba de finalizar.
            // Comprobar si sus consecuencias han causado
            // la derrota del reino.
            const defeat = checkGameOver(stats);

            if (defeat !== null) {
                setGameOverReason(defeat);
                setPendingTreasuryWarning(false);
                setSpecialAudience("defeat");
                setPhase("entering");
                return;
            }

            // Si no hay derrota, mostrar la advertencia
            // económica pendiente antes de avanzar.
            if (pendingTreasuryWarning) {
                setPendingTreasuryWarning(false);
                setSpecialAudience("treasury-warning");
                setPhase("entering");
                return;
            }
        }

        // Reanudar el orden de audiencias normales.
        const nextIndex = audienceIndex + 1;

        if (nextIndex < dayEvents.length) {
            const nextTimeOfDay =
                nextIndex < morningCount
                    ? "morning"
                    : "evening";

            setAudienceIndex(nextIndex);

            setPhase(
                nextTimeOfDay !== timeOfDay
                    ? "transitioning"
                    : "entering"
            );

            return;
        }

        // No quedan audiencias normales.
        // Comienza el cierre nocturno.
        setIsClosing(true);
        setPhase("transitioning");
    }

    // Una respuesta produce efectos inmediatos y desbloqueos futuros.
    function handleDecision(answer: Decision) {
        if (
            isClosing ||
            specialAudience !== null ||
            phase !== "speaking" ||
            selectedDecision !== null ||
            !currentAudience
        ) {
            return;
        }

        // La respuesta queda guardada incluso antes de terminar el diálogo.
        setSelectedDecision(answer);

        // Consecuencias inmediatas.
        const changes = currentAudience.effects?.[answer];

        if (changes) {
            const nextStats = applyStatChanges(stats, changes);

            // Detectar cuándo las arcas se agotan.
            const treasuryExhausted =
                stats.gold > 0 &&
                nextStats.gold <= 0 &&
                nextStats.gold > -50;

            // No mostrar una advertencia si la decisión
            // ha provocado directamente una derrota.
            if (
                treasuryExhausted &&
                checkGameOver(nextStats) === null
            ) {
                setPendingTreasuryWarning(true);
            }

            setStats(nextStats);
        }

        // Desbloquear eventos futuros.
        const newUnlocks =
            currentAudience.unlocks?.[answer] ?? [];

        if (newUnlocks.length > 0) {
            setUnlockedEventIds((previous) => {
                return [
                    ...new Set([
                        ...previous,
                        ...newUnlocks,
                    ]),
                ];
            });
        }

        // Activar modificadores.
        const newModifiers =
            currentAudience.addModifiers?.[answer] ?? [];

        if (newModifiers.length > 0) {
            setActiveModifierIds((previous) => {
                return [
                    ...new Set([
                        ...previous,
                        ...newModifiers,
                    ]),
                ];
            });
        }
    }

    // Finaliza un evento narrativo, retirando modificadores si procede.
    function completeAudience() {
        const modifiersToRemove =
            currentAudience?.removeModifiersOnComplete ?? [];

        if (modifiersToRemove.length === 0) {
            return;
        }

        setActiveModifierIds((previous) => {
            return previous.filter((id) => {
                return !modifiersToRemove.includes(id);
            });
        });
    }

    // Los efectos diarios se calculan exactamente una vez.
    function closeDay() {
        if (dayClosedRef.current) {
            return false;
        }

        dayClosedRef.current = true;

        // El escenario mantiene los valores anteriores al cierre.
        setClosingStats({ ...stats });

        const result = applyDailyModifiers(stats, activeModifierIds);

        setStats(result.nextStats);
        setModifierReport(result.report);

        return true;
    }

    function handleContinue() {
        if (phase !== "speaking") {
            return;
        }

        if (isClosing) {
            if (!closeDay()) {
                return;
            }
        } else if (specialAudience === null) {
            // Solo las audiencias normales pueden
            // finalizar eventos y eliminar modificadores.
            completeAudience();
        }

        setPhase("exiting");
    }

    // Prepara la nueva jornada sin perder el progreso del reino.
    function prepareNextDay() {
        const nextDay = day + 1;

        // Comprobar las estadísticas finales,
        // después de los modificadores nocturnos.
        const defeat = checkGameOver(stats);

        // Fijar los fondos visuales del nuevo día.
        setSceneModifierIds([...activeModifierIds]);

        // Obtener las audiencias habituales.
        const nextDayEvents = getDayEvents(
            nextDay,
            unlockedEventIds
        );

        // Preparar las estadísticas de la nueva jornada.
        setClosingStats(null);
        setDayStartStats({ ...stats });

        // Reiniciar el cierre diario.
        dayClosedRef.current = false;

        setModifierReport({
            appliedIds: [],
            totalChanges: {},
        });

        // Avanzar al nuevo día.
        setDay(nextDay);
        setDayEvents(nextDayEvents);
        setAudienceIndex(0);
        setSelectedDecision(null);

        // Limpiar las advertencias anteriores.
        setPendingTreasuryWarning(false);

        // Si los modificadores provocaron la derrota,
        // anunciarla al comenzar el día siguiente.
        setGameOverReason(defeat);

        setSpecialAudience(
            defeat !== null ? "defeat" : null
        );

        // Si existe una derrota pendiente, no entraremos
        // en el cierre nocturno aunque no haya eventos.
        setIsClosing(
            defeat === null && nextDayEvents.length === 0
        );

        // Esperar a que termine el fundido de pantalla.
        setPhase("waiting");
    }

    // La pantalla se sustituye únicamente cuando el fundido está negro.
    function handleScreenFadeEnd() {
        if (
            transitionStage === "darkening" &&
            transitionTarget !== null
        ) {
            if (transitionTarget === "scene") {
                prepareNextDay();
            }

            setScreen(transitionTarget);
            setTransitionStage("lightening");
            return;
        }

        if (transitionStage === "lightening") {
            if (transitionTarget === "scene") {
                setPhase("entering");
            }

            setTransitionStage("idle");
            setTransitionTarget(null);
        }
    }

    function handleNextDay() {
        startScreenTransition("scene");
    }

    return {
        day,
        screen,
        phase,
        timeOfDay,
        backgroundMap,
        visitorImage,
        dialogue,
        dialogueKey,
        selectedDecision,
        continueLabel,
        stats,
        visibleStats,
        dayStartStats,
        modifierReport,
        transitionStage,
        handleVisitorAnimationEnd,
        handleDecision,
        handleContinue,
        handleScreenFadeEnd,
        handleNextDay,
        gameOverReason
    };
}
