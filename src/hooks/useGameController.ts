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

import { applyDailyModifiers } from "../game/applyDailyModifiers";
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

export function useGameController(
    onAchievementUnlocked: (id: AchievementId) => void,
    onModifierChanged: (
        id: ModifierId,
        change: ModifierChange
    ) => void
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
    ) {
        const transition = getModifierTransition(
            activeModifierIds,
            toAdd,
            toRemove
        );

        if (
            transition.added.length === 0 &&
            transition.removed.length === 0
        ) {
            return;
        }

        setActiveModifierIds(transition.next);

        for (const id of transition.added) {
            onModifierChanged(id, "added");
        }

        for (const id of transition.removed) {
            onModifierChanged(id, "removed");
        }
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
                applyModifierChanges(
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
        }

        setSelectedDecision(null);

        const exit = getAudienceExit({
            specialAudience,
            isClosing,
            stats: exitStats,
            pendingTreasuryWarning: exitTreasuryWarning,
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
                startScreenTransition("summary");
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

            case "next-audience":
                if (exit.clearTreasuryWarning) {
                    setSpecialAudience(null);
                }

                setAudienceIndex(exit.index);
                setPhase(exit.phase);
                return;

            case "closing":
                if (exit.clearTreasuryWarning) {
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

        const result = applyDailyModifiers(stats, activeModifierIds);

        setStats(result.nextStats);
        setModifierReport(result.report);

        return true;
    }

    function handleContinue() {
        if (phase !== "speaking") {
            return;
        }

        if (isClosing && !closeDay()) {
            return;
        }

        setPhase("exiting");
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

        setGameOverReason(plan.defeat);
        setSpecialAudience(
            plan.defeat !== null ? "defeat" : null
        );

        setIsClosing(plan.isClosing);
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
