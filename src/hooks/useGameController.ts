import {
    planDecision,
    planAudienceCompletion,
} from "../game/audienceActions";

import {
    getChapterPresentation,
    planDayAdvance,
    planChapterAdvance,
} from "../game/chapterFlow";

import { getScreenTransition } from "../game/screenFlow";
import { getAudiencePresentation } from "../game/getAudiencePresentation";
import { getSceneBackgrounds } from "../game/getSceneBackgrounds";

import { joustEvent } from "../data/events/chapter1/joust";

import { useGameAutosave } from "./useGameAutosave";
import { useGameSessionState } from "./useGameSessionState";
import { useGameTransitions } from "./useGameTransitions";

import type { AchievementId } from "../data/achievements";
import type { Decision } from "../types/dialogue";
import type { ModifierId } from "../types/modifiers";
import type { ModifierChange } from "../types/notifications";
import type { KingdomValues } from "../types/stats";
import type { MonarchRole } from "../types/monarch";

import type {
    AudienceOperation,
    GameEffect,
} from "../game/audienceActions";

import type {
    ScreenTransitionPlan,
} from "../game/screenFlow";

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
    } = useGameSessionState(monarch);

    const { progress, phase } = state;

    const {
        day,
        screen,
        chapterEndingParagraphIndex,
        selectedDecision,
        stats,
        dayStartStats,
        closingStats,
        activeModifierIds,
        sceneModifierIds,
        modifierReport,
        storyFlags,
        gameOverReason,
    } = progress;

    // Preparar la información de la audiencia actual.
    const presentation = getAudiencePresentation({
        monarch,

        dayEvents: screen === "joust"
            ? [joustEvent]
            : dayEvents,

        audienceIndex: progress.audienceIndex,

        isClosing: progress.isClosing,

        specialAudience:
            progress.specialAudience,

        gameOverReason,
    });

    const {
        currentAudience,
        timeOfDay,
        visitorImage,
        dialogue,
        dialogueKey,
        continueLabel,
    } = presentation;

    const visibleStats = closingStats ?? stats;

    const backgroundMap = getSceneBackgrounds(
        sceneModifierIds
    );

    const {
        chapter,
        summaryContinueLabel,
    } = getChapterPresentation(
        day,
        stats
    );

    useGameAutosave(progress);

    const {
        transitionStage,
        fullScreenFade,
        startScreenTransition,
        handleScreenFadeEnd,
    } = useGameTransitions({
        phase,
        setPhase,
    });

    // Ejecutar una transición preparada por el motor.
    function requestTransition(
        plan: ScreenTransitionPlan
    ) {
        startScreenTransition({
            fullScreen: plan.fullScreen,

            onDark: () => {
                dispatch(plan.action);
            },

            onLight: plan.enterAudience
                ? () => setPhase("entering")
                : undefined,
        });
    }

    // Ejecutar los efectos externos de una operación.
    function runEffects(
        effects: GameEffect[]
    ) {
        for (const effect of effects) {
            switch (effect.kind) {
                case "stats":
                    onStatsChanged(
                        effect.previous,
                        effect.next
                    );
                    break;

                case "modifier":
                    onModifierChanged(
                        effect.id,
                        effect.change
                    );
                    break;

                case "achievement":
                    onAchievementUnlocked(
                        effect.id
                    );
                    break;

                case "anthem":
                    onAnthemUnlocked();
                    break;
            }
        }
    }

    // Aplicar una operación preparada por el motor.
    function runAudienceOperation(
        operation: AudienceOperation | null
    ) {
        if (operation === null) {
            return;
        }

        dispatch(operation.action);

        runEffects(operation.effects);

        if (operation.transition !== null) {
            requestTransition(
                operation.transition
            );
        }
    }

    // Finalizar la entrada o salida del visitante.
    function handleVisitorAnimationEnd() {
        if (phase === "entering") {
            setPhase("speaking");
            return;
        }

        runAudienceOperation(
            planAudienceCompletion(
                state,
                presentation
            )
        );
    }

    // Aplicar una decisión del jugador.
    function handleDecision(
        answer: Decision
    ) {
        runAudienceOperation(
            planDecision(
                state,
                currentAudience,
                answer
            )
        );
    }

    function handleContinue() {
        dispatch({
            type: "CONTINUE",
        });
    }

    // Abrir el resumen después del descanso nocturno.
    function handleSleepFinished() {
        if (screen !== "sleep") {
            return;
        }

        requestTransition(
            getScreenTransition(
                screen,
                {
                    type: "SET_SCREEN",
                    screen: "summary",
                }
            )
        );
    }

    function setChapterEndingParagraphIndex(
        index: number
    ) {
        dispatch({
            type: "SET_ENDING_PARAGRAPH",
            index,
        });
    }

    // Avanzar desde el resumen diario.
    function handleNextDay() {
        const plan = planDayAdvance(
            progress
        );

        if (plan === null) {
            return;
        }

        for (const id of plan.achievements) {
            onAchievementUnlocked(id);
        }

        if (plan.resetEndingParagraph) {
            setChapterEndingParagraphIndex(0);
        }

        requestTransition(
            plan.transition
        );
    }

    // Comenzar el siguiente capítulo.
    function handleStartNextChapter() {
        const plan = planChapterAdvance(
            progress
        );

        if (plan === null) {
            return;
        }

        setChapterEndingParagraphIndex(0);

        requestTransition(plan);
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

        withBrother: storyFlags.includes(
            "brother-is-advisor"
        ),
    };
}
