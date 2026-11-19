import { useEffect, useRef, useState } from "react";

import { closingDialogue } from "../data/demoAudiences";
import { applyDailyModifiers } from "../game/applyDailyModifiers";
import { applyStatChanges } from "../game/applyStatChanges";
import { getDayEvents } from "../game/getDayEvents";
import { getSceneBackgrounds } from "../game/getSceneBackgrounds";
import { initialKingdomValues } from "../game/initialState";

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

const BACKGROUND_TRANSITION_DURATION = 1500;
const ROYAL_ADVISOR_IMAGE =
    "/assets/characters/courtiers/royal-advisor.png";

export function useGameController() {
    // Estado principal de la jornada y de la interfaz.
    const [day, setDay] = useState(1);
    const [screen, setScreen] = useState<GameScreen>("scene");
    const [phase, setPhase] = useState<AudiencePhase>("entering");
    const [audienceIndex, setAudienceIndex] = useState(0);
    const [isClosing, setIsClosing] = useState(false);

    const [transitionStage, setTransitionStage] =
        useState<TransitionStage>("idle");
    const [transitionTarget, setTransitionTarget] =
        useState<GameScreen | null>(null);

    // Datos del reino; estos serán relevantes para guardar partidas.
    const [stats, setStats] = useState<KingdomValues>(
        initialKingdomValues
    );
    const [dayStartStats, setDayStartStats] = useState<KingdomValues>({
        ...initialKingdomValues,
    });
    const [closingStats, setClosingStats] =
        useState<KingdomValues | null>(null);

    const [activeModifierIds, setActiveModifierIds] =
        useState<ModifierId[]>([]);

    // Tema visual fijado al comienzo de cada jornada.
    const [sceneModifierIds, setSceneModifierIds] =
        useState<ModifierId[]>([]);
    const [modifierReport, setModifierReport] =
        useState<DailyModifierReport>({
            appliedIds: [],
            totalChanges: {},
        });

    const [unlockedEventIds, setUnlockedEventIds] =
        useState<string[]>([]);
    const [dayEvents, setDayEvents] = useState(() => {
        return getDayEvents(1, []);
    });

    // Protege de un segundo cierre de la misma jornada.
    const dayClosedRef = useRef(false);

    // Datos derivados: no necesitamos guardarlos en otros useState.
    const currentAudience = dayEvents[audienceIndex];
    const morningCount = Math.ceil(dayEvents.length / 2);

    const timeOfDay: "morning" | "evening" | "night" = isClosing
        ? "night"
        : audienceIndex < morningCount
            ? "morning"
            : "evening";

    const visitorImage = isClosing || !currentAudience
        ? ROYAL_ADVISOR_IMAGE
        : currentAudience.image;

    const dialogue = isClosing || !currentAudience
        ? closingDialogue
        : currentAudience.dialogue;

    const dialogueKey = isClosing
        ? "closing"
        : (currentAudience?.id ?? "no-audiences");

    const continueLabel = isClosing
        ? "Terminar día"
        : "Continuar";

    const visibleStats = closingStats ?? stats;
    const backgroundMap = getSceneBackgrounds(sceneModifierIds);

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
        if (phase === "entering") {
            setPhase("speaking");
            return;
        }

        if (phase !== "exiting") {
            return;
        }

        if (isClosing) {
            startScreenTransition("summary");
            return;
        }

        const nextIndex = audienceIndex + 1;

        if (nextIndex < dayEvents.length) {
            const nextTimeOfDay = nextIndex < morningCount
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

        // No quedan audiencias normales: empieza el cierre nocturno.
        setIsClosing(true);
        setPhase("transitioning");
    }

    // Una respuesta produce efectos inmediatos y desbloqueos futuros.
    function handleDecision(answer: Decision) {
        if (isClosing || phase !== "speaking" || !currentAudience) {
            return;
        }

        const changes = currentAudience.effects?.[answer];

        if (changes) {
            setStats((previous) => {
                return applyStatChanges(previous, changes);
            });
        }

        const newUnlocks = currentAudience.unlocks?.[answer] ?? [];

        if (newUnlocks.length > 0) {
            setUnlockedEventIds((previous) => {
                return [...new Set([...previous, ...newUnlocks])];
            });
        }

        const newModifiers =
            currentAudience.addModifiers?.[answer] ?? [];

        if (newModifiers.length > 0) {
            setActiveModifierIds((previous) => {
                return [...new Set([...previous, ...newModifiers])];
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
        } else {
            completeAudience();
        }

        setPhase("exiting");
    }

    // Prepara la nueva jornada sin perder el progreso del reino.
    function prepareNextDay() {
        // El escenario refleja los modificadores al INICIO del nuevo día.
        // Los cambios durante la jornada no alteran sus fondos.
        setSceneModifierIds([...activeModifierIds]);

        const nextDay = day + 1;
        const nextDayEvents = getDayEvents(nextDay, unlockedEventIds);

        setClosingStats(null);
        dayClosedRef.current = false;
        setModifierReport({
            appliedIds: [],
            totalChanges: {},
        });

        setDayStartStats({ ...stats });
        setDay(nextDay);
        setDayEvents(nextDayEvents);
        setAudienceIndex(0);
        setIsClosing(nextDayEvents.length === 0);
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
    };
}
