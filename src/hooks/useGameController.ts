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

import { joustEvent } from "../data/events/chapter1/joust";

import { checkGameOver } from "../game/checkGameOver";
import { getEventCompletionConsequences } from "../game/getEventCompletionConsequences";
import { getSceneBackgrounds } from "../game/getSceneBackgrounds";

import {
    getAudienceExit,
    getAudiencePresentation,
    getDecisionConsequences,
} from "../game/audienceFlow";

import { hasCompletedChapter } from "../game/dayFlow";
import { getModifierTransition } from "../game/getModifierTransition";

import { useGameAutosave } from "./useGameAutosave";
import { useGameSessionState } from "./useGameSessionState";
import { useGameTransitions } from "./useGameTransitions";

import type { Decision } from "../types/dialogue";
import type { ModifierId } from "../types/modifiers";
import type { ModifierChange } from "../types/notifications";
import type { KingdomValues } from "../types/stats";
import type { MonarchRole } from "../types/monarch";

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
    onAnthemUnlocked: () => void,
    monarch: MonarchRole
) {
    const {
        state,
        dispatch,
        dayEvents,
        setPhase,
        setScreen,
    } = useGameSessionState(monarch);

    const { progress, phase } = state;

    const {
        day,
        screen,
        chapterEndingParagraphIndex,
        audienceIndex,
        isClosing,
        specialAudience,
        pendingTreasuryWarning,
        gameOverReason,
        selectedDecision,
        stats,
        dayStartStats,
        closingStats,
        activeModifierIds,
        sceneModifierIds,
        modifierReport,
        unlockedEventIds,
    } = progress;

    // Presentación de la audiencia actual.
    const {
        currentAudience,
        morningCount,
        timeOfDay,
        visitorImage,
        dialogue,
        dialogueKey,
        continueLabel,
    } = getAudiencePresentation({
        dayEvents: screen === "joust"
            ? [joustEvent]
            : dayEvents,
        audienceIndex,
        isClosing,
        specialAudience,
        gameOverReason,
        monarch,
    });

    const visibleStats = closingStats ?? stats;

    const backgroundMap = getSceneBackgrounds(
        sceneModifierIds
    );

    const chapter = getChapterForDisplay(day);

    const summaryContinueLabel = hasCompletedChapter(
        day,
        stats
    )
        ? `Fin capítulo ${toRomanNumber(chapter.number)}`
        : "Siguiente día";

    useGameAutosave(progress);

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
        finishJoust,
    });

    // Calcular los cambios de modificadores y notificar
    // únicamente las diferencias reales.
    function getNextModifierIds(
        currentIds: ModifierId[],
        toAdd: ModifierId[] = [],
        toRemove: ModifierId[] = []
    ): ModifierId[] {
        const transition = getModifierTransition(
            currentIds,
            toAdd,
            toRemove
        );

        if (
            transition.added.length === 0 &&
            transition.removed.length === 0
        ) {
            return currentIds;
        }

        for (const id of transition.added) {
            onModifierChanged(id, "added");
        }

        for (const id of transition.removed) {
            onModifierChanged(id, "removed");
        }

        return transition.next;
    }

    // Finalizar la entrada o salida del visitante.
    function handleVisitorAnimationEnd() {
        if (phase === "entering") {
            setPhase("speaking");
            return;
        }

        if (phase !== "exiting") {
            return;
        }

        let exitStats = stats;

        let exitTreasuryWarning =
            pendingTreasuryWarning;

        let exitModifierIds = activeModifierIds;

        let exitUnlocks: string[] = [];

        // Aplicar las consecuencias que corresponden
        // al finalizar un acontecimiento.
        if (
            !isClosing &&
            specialAudience === null &&
            currentAudience !== undefined
        ) {
            const completion =
                getEventCompletionConsequences(
                    currentAudience,
                    stats
                );

            if (completion.nextStats !== null) {
                onStatsChanged(
                    stats,
                    completion.nextStats
                );

                exitStats = completion.nextStats;
            }

            if (completion.showTreasuryWarning) {
                exitTreasuryWarning = true;
            }

            exitUnlocks = completion.unlocks;

            if (
                completion.addModifiers.length > 0 ||
                completion.removeModifiers.length > 0
            ) {
                exitModifierIds = getNextModifierIds(
                    exitModifierIds,
                    completion.addModifiers,
                    completion.removeModifiers
                );
            }

            const earnedAchievements =
                getEventCompletionAchievements(
                    currentAudience.id
                );

            for (const achievementId of earnedAchievements) {
                onAchievementUnlocked(achievementId);
            }

            // El evento 24.1 desbloquea música,
            // no un logro.
            if (currentAudience.id === "24.1") {
                onAnthemUnlocked();
            }
        }

        // La audiencia de deuda activa los intereses.
        if (
            specialAudience === "treasury-warning" &&
            exitStats.gold < 0
        ) {
            exitModifierIds = getNextModifierIds(
                exitModifierIds,
                ["indebted"]
            );
        }

        // La audiencia de recuperación cancela los intereses.
        if (
            specialAudience === "treasury-recovery" &&
            exitStats.gold > 0
        ) {
            exitModifierIds = getNextModifierIds(
                exitModifierIds,
                [],
                ["indebted"]
            );
        }

        // La justa utiliza su propio cambio de escenario.
        const exit = screen === "joust"
            ? null
            : getAudienceExit({
                specialAudience,
                isClosing,
                stats: exitStats,

                pendingTreasuryWarning:
                    exitTreasuryWarning,

                activeModifierIds: exitModifierIds,

                audienceIndex,
                dayEventsCount: dayEvents.length,
                morningCount,
                timeOfDay,
            });

        // Aplicar conjuntamente todas las consecuencias
        // y avanzar el estado de la audiencia.
        dispatch({
            type: "COMPLETE_AUDIENCE",

            changes: {
                stats: exitStats,

                activeModifierIds:
                    exitModifierIds,

                pendingTreasuryWarning:
                    exitTreasuryWarning,

                unlocks: exitUnlocks,
            },

            exit,
        });

        // Las transiciones visuales se mantienen
        // fuera del reducer.
        if (exit === null) {
            startScreenTransition("scene");
            return;
        }

        if (exit.kind === "gameover") {
            startScreenTransition("gameover");
            return;
        }

        if (exit.kind === "summary") {
            startScreenTransition("sleep");
        }
    }

    // Aplicar una decisión del jugador.
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

        const consequences = getDecisionConsequences(
            currentAudience,
            answer,
            stats
        );

        const nextStats =
            consequences.nextStats ?? stats;

        if (consequences.nextStats !== null) {
            onStatsChanged(
                stats,
                consequences.nextStats
            );
        }

        const nextModifierIds =
            consequences.addModifiers.length > 0
                ? getNextModifierIds(
                    activeModifierIds,
                    consequences.addModifiers
                )
                : activeModifierIds;

        dispatch({
            type: "MAKE_DECISION",

            decision: answer,

            changes: {
                stats: nextStats,

                activeModifierIds:
                    nextModifierIds,

                pendingTreasuryWarning:
                    pendingTreasuryWarning ||
                    consequences.showTreasuryWarning,

                unlocks: consequences.unlocks,
            },
        });

        const earnedAchievements =
            getDecisionAchievements(
                currentAudience.id,
                answer
            );

        for (const achievementId of earnedAchievements) {
            onAchievementUnlocked(achievementId);
        }
    }

    // Continuar la audiencia o cerrar la jornada.
    function handleContinue() {
        dispatch({
            type: "CONTINUE",
        });
    }

    // Terminar el descanso nocturno y abrir el resumen.
    function handleSleepFinished() {
        if (screen !== "sleep") {
            return;
        }

        startScreenTransition("summary");
    }

    // Preparar una nueva jornada.
    function prepareNextDay(
        target: "scene" | "joust"
    ) {
        dispatch({
            type: "START_DAY",
            target,
        });
    }

    // Regresar al salón del trono sin avanzar de día.
    function finishJoust() {
        dispatch({
            type: "FINISH_JOUST",
        });
    }

    function setChapterEndingParagraphIndex(
        index: number
    ) {
        dispatch({
            type: "SET_ENDING_PARAGRAPH",
            index,
        });
    }

    function handleNextDay() {
        if (hasCompletedChapter(day, stats)) {
            const earnedAchievements =
                getChapterCompletionAchievements(
                    chapter.number
                );

            for (const achievementId of earnedAchievements) {
                onAchievementUnlocked(achievementId);
            }

            setChapterEndingParagraphIndex(0);

            startScreenTransition("chapter-ending");
            return;
        }

        // El torneo se celebra al comenzar el segundo día
        // si el monarca autorizó los festejos de coronación.
        const shouldShowJoust =
            day === 1 &&
            unlockedEventIds.includes("2.1") &&
            checkGameOver(stats) === null;

        startScreenTransition(
            shouldShowJoust ? "joust" : "scene"
        );
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

        startScreenTransition("scene");
    }

    return {
        day,
        screen,
        phase,
        timeOfDay,
        backgroundMap,

        blackFeverActive:
            activeModifierIds.includes("black-fever"),

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

        withBrother: unlockedEventIds.includes(
            "joust-with-brother"
        ),
    };
}
