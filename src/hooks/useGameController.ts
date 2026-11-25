import {
    getChapterForDisplay,
    getNextChapter,
    toRomanNumber,
} from "../data/chapters";
import {
    getDecisionAchievements,
    getEventCompletionAchievements,
    getChapterCompletionAchievements,
} from "../data/achievements";
import type { AchievementId } from "../data/achievements";

import {
    applyDailyModifiersWithDebt,
    getDebtAudience,
} from "../game/debtFlow";
import { getEventCompletionConsequences } from "../game/getEventCompletionConsequences";
import { getSceneBackgrounds } from "../game/getSceneBackgrounds";
import {
    getAudienceExit,
    getAudiencePresentation,
    getDecisionConsequences,
} from "../game/audienceFlow";
import { getNextDayPlan, hasCompletedChapter } from "../game/dayFlow";
import { getModifierTransition } from "../game/getModifierTransition";

import { useGameAutosave } from "./useGameAutosave";
import { useGameSessionState } from "./useGameSessionState";
import { useGameTransitions } from "./useGameTransitions";

import type { Decision } from "../types/dialogue";
import type { ModifierId } from "../types/modifiers";
import type { ModifierChange } from "../types/notifications";
import type { KingdomValues } from "../types/stats";

export function useGameController(
    onAchievementUnlocked: (id: AchievementId) => void,
    onModifierChanged: (
        id: ModifierId,
        change: ModifierChange
    ) => void,
    onStatsChanged: (
        previous: KingdomValues,
        next: KingdomValues
    ) => void,
    onAnthemUnlocked: () => void
) {
    // Estado y carga inicial, separados de las reglas del juego.
    const {
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
    } = useGameSessionState();

    // Presentación de la audiencia actual, sin modificar el estado.
    const {
        currentAudience,
        morningCount,
        timeOfDay,
        visitorImage,
        dialogue,
        dialogueKey,
        continueLabel,
    } = getAudiencePresentation({
        dayEvents,
        audienceIndex,
        isClosing,
        specialAudience,
        gameOverReason,
    });

    const visibleStats = closingStats ?? stats;
    const backgroundMap = getSceneBackgrounds(sceneModifierIds);
    const chapter = getChapterForDisplay(day);

    const summaryContinueLabel = hasCompletedChapter(day, stats)
        ? `Fin capítulo ${toRomanNumber(chapter.number)}`
        : "Siguiente día";

    useGameAutosave({
        day,
        screen,
        stats,
        dayStartStats,
        closingStats,
        audienceIndex,
        dayEvents,
        isClosing,
        dayClosedRef,
        selectedDecision,
        unlockedEventIds,
        activeModifierIds,
        sceneModifierIds,
        modifierReport,
        specialAudience,
        pendingTreasuryWarning,
        gameOverReason,
        chapterEndingParagraphIndex,
    });

    const {
        transitionStage,
        fullScreenFade,
        startScreenTransition,
        handleScreenFadeEnd,
    } = useGameTransitions({
        phase,
        setPhase,
        screen,
        setScreen,
        prepareNextDay,
    });

    // Cambiar modificadores y anunciar las diferencias reales.
    function applyModifierChanges(
        toAdd: ModifierId[] = [],
        toRemove: ModifierId[] = []
    ): ModifierId[] {
        const transition = getModifierTransition(
            activeModifierIds,
            toAdd,
            toRemove
        );

        if (
            transition.added.length === 0 &&
            transition.removed.length === 0
        ) {
            return activeModifierIds;
        }

        setActiveModifierIds(transition.next);

        for (const id of transition.added) {
            onModifierChanged(id, "added");
        }

        for (const id of transition.removed) {
            onModifierChanged(id, "removed");
        }

        return transition.next;
    }

    // Termina la entrada o salida del personaje actual.
    // El cierre de una audiencia se confirma cuando termina
    // la animación de salida. Así los efectos informativos
    // y los modificadores se procesan junto con el avance.
    function handleVisitorAnimationEnd() {
        if (phase === "entering") {
            setPhase("speaking");
            return;
        }

        if (phase !== "exiting") {
            return;
        }

        let exitStats = stats;
        let exitTreasuryWarning = pendingTreasuryWarning;
        let exitModifierIds = activeModifierIds;

        if (
            !isClosing &&
            specialAudience === null &&
            currentAudience !== undefined
        ) {
            const completion = getEventCompletionConsequences(
                currentAudience,
                stats
            );

            if (completion.nextStats !== null) {
                onStatsChanged(
                    stats,
                    completion.nextStats
                );

                exitStats = completion.nextStats;
                setStats(completion.nextStats);
            }

            if (completion.showTreasuryWarning) {
                exitTreasuryWarning = true;
                setPendingTreasuryWarning(true);
            }

            if (completion.unlocks.length > 0) {
                setUnlockedEventIds((previous) => [
                    ...new Set([...previous, ...completion.unlocks]),
                ]);
            }
 
            if (
                completion.addModifiers.length > 0 ||
                completion.removeModifiers.length > 0
            ) {
                exitModifierIds = applyModifierChanges(
                    completion.addModifiers,
                    completion.removeModifiers
                );
            }

            const earnedAchievements = getEventCompletionAchievements(
                currentAudience.id
            );

            for (const achievementId of earnedAchievements) {
                onAchievementUnlocked(achievementId);
            }

            // El evento 24.1 desbloquea música, no un logro.
            if (currentAudience.id === "24.1") {
                onAnthemUnlocked();
            }
        }

        // La audiencia de deuda activa los intereses.
        if (
            specialAudience === "treasury-warning" &&
            exitStats.gold < 0
        ) {
            exitModifierIds = applyModifierChanges(
                ["indebted"]
            );
        }

        // La audiencia de recuperación cancela los intereses.
        if (
            specialAudience === "treasury-recovery" &&
            exitStats.gold > 0
        ) {
            exitModifierIds = applyModifierChanges(
                [],
                ["indebted"]
            );
        }

        setSelectedDecision(null);

        const exit = getAudienceExit({
            specialAudience,
            isClosing,
            stats: exitStats,
            pendingTreasuryWarning: exitTreasuryWarning,
            activeModifierIds: exitModifierIds,
            audienceIndex,
            dayEventsCount: dayEvents.length,
            morningCount,
            timeOfDay,
        });

        switch (exit.kind) {
            case "gameover":
                startScreenTransition("gameover");
                return;

            case "summary":
                startScreenTransition("sleep");
                return;

            case "defeat":
                setGameOverReason(exit.reason);
                setPendingTreasuryWarning(false);
                setSpecialAudience("defeat");
                setPhase("entering");
                return;

            case "treasury-warning":
                setPendingTreasuryWarning(false);
                setSpecialAudience("treasury-warning");
                setPhase("entering");
                return;

            case "treasury-recovery":
                setPendingTreasuryWarning(false);
                setSpecialAudience("treasury-recovery");
                setPhase("entering");
                return;

            case "next-audience":
                if (exit.clearSpecialAudience) {
                    setSpecialAudience(null);
                }

                setAudienceIndex(exit.index);
                setPhase(exit.phase);
                return;

            case "closing":
                if (exit.clearSpecialAudience) {
                    setSpecialAudience(null);
                }

                setIsClosing(true);
                setPhase("transitioning");
                return;
        }
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

        setSelectedDecision(answer);

        const consequences = getDecisionConsequences(
            currentAudience,
            answer,
            stats
        );

        if (consequences.nextStats !== null) {
            onStatsChanged(
                stats,
                consequences.nextStats
            );

            setStats(consequences.nextStats);
        }

        if (consequences.showTreasuryWarning) {
            setPendingTreasuryWarning(true);
        }

        if (consequences.unlocks.length > 0) {
            setUnlockedEventIds((previous) => [
                ...new Set([...previous, ...consequences.unlocks]),
            ]);
        }

        if (consequences.addModifiers.length > 0) {
            applyModifierChanges(consequences.addModifiers);
        }

        const earnedAchievements = getDecisionAchievements(
            currentAudience.id,
            answer
        );

        for (const achievementId of earnedAchievements) {
            onAchievementUnlocked(achievementId);
        }
    }

    // Los efectos diarios se calculan exactamente una vez.
    function closeDay() {
        if (dayClosedRef.current) {
            return false;
        }

        dayClosedRef.current = true;

        // El escenario mantiene los valores anteriores al cierre.
        setClosingStats({ ...stats });

        const result = applyDailyModifiersWithDebt(
            stats,
            activeModifierIds
        );

        setStats(result.nextStats);
        setModifierReport(result.report);

        return true;
    }

    function handleContinue() {
        if (phase !== "speaking") {
            return;
        }

        if (
            isClosing &&
            specialAudience === null &&
            !closeDay()
        ) {
            return;
        }

        setPhase("exiting");
    }

    // Terminar el descanso nocturno y abrir el resumen.
    function handleSleepFinished() {
        if (screen !== "sleep") {
            return;
        }

        startScreenTransition("summary");
    }

    // Prepara la nueva jornada sin perder el progreso del reino.
    function prepareNextDay() {
        const plan = getNextDayPlan(
            day,
            stats,
            activeModifierIds,
            unlockedEventIds
        );

        setSceneModifierIds(plan.nextSceneModifierIds);
        setClosingStats(null);
        setDayStartStats({ ...stats });

        dayClosedRef.current = false;
        setModifierReport({
            appliedIds: [],
            totalChanges: {},
        });

        setDay(plan.nextDay);
        setDayEvents(plan.nextDayEvents);
        setAudienceIndex(0);
        setSelectedDecision(null);
        setPendingTreasuryWarning(false);

        const nextSpecialAudience = plan.defeat !== null
            ? "defeat"
            : getDebtAudience(stats, activeModifierIds);

        setGameOverReason(plan.defeat);
        setSpecialAudience(nextSpecialAudience);

        setIsClosing(
            plan.isClosing && nextSpecialAudience === null
        );

        setPhase("waiting");
    }

    function handleNextDay() {
        if (hasCompletedChapter(day, stats)) {
            const earnedAchievements =
                getChapterCompletionAchievements(chapter.number);

            for (const achievementId of earnedAchievements) {
                onAchievementUnlocked(achievementId);
            }

            setChapterEndingParagraphIndex(0);

            // La jornada ha terminado y el reino sigue en pie.
            // Mostrar el epílogo sin avanzar todavía de día.
            startScreenTransition("chapter-ending");
            return;
        }

        // Jornada normal o derrota por modificadores.
        // En este último caso, la consejera anunciará
        // la derrota al comenzar el día siguiente.
        startScreenTransition("scene");
    }

    function handleStartNextChapter() {
        if (screen !== "chapter-ending") {
            return;
        }

        const nextChapter = getNextChapter(chapter);

        if (nextChapter === null) {
            return;
        }

        setChapterEndingParagraphIndex(0);

        // Preparar la primera jornada del siguiente capítulo.
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
        handleSleepFinished,
        handleScreenFadeEnd,
        handleNextDay,
        gameOverReason,
        chapter,
        summaryContinueLabel,
        fullScreenFade,
        handleStartNextChapter,
        chapterEndingParagraphIndex,
        setChapterEndingParagraphIndex,
    };
}
