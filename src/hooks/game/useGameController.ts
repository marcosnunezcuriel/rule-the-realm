import {
    planDecision,
    planAudienceCompletion,
} from "../../game/audiences/audienceActions";

import {
    getChapterPresentation,
    planDayAdvance,
    planChapterAdvance,
} from "../../game/progression/chapterFlow";

import { getScreenTransition } from "../../game/progression/screenFlow";
import { getAudiencePresentation } from "../../game/audiences/getAudiencePresentation";
import { getSceneBackgrounds } from "../../game/scenes/getSceneBackgrounds";
import { getSceneVisualClassName } from "../../game/scenes/getSceneVisualClassName";

import { getEventById } from "../../data/registries/eventRegistry";
import { getSpecialScenePresentation } from "../../game/scenes/getSpecialScenePresentation";

import { useGameAutosave } from "./useGameAutosave";
import { useGameSessionState } from "./useGameSessionState";
import { useGameTransitions } from "./useGameTransitions";

import type { AchievementId } from "../../data/registries/achievementRegistry";
import type { Decision } from "../../types/dialogue";
import type { ModifierId } from "../../types/modifiers";
import type { ModifierChange } from "../../types/notifications";
import type { KingdomValues } from "../../types/stats";
import type { MonarchRole } from "../../types/monarch";
import type { GameReward } from "../../types/rewards";

import type {
    AudienceOperation,
    GameEffect,
} from "../../game/audiences/audienceActions";

import type {
    ScreenTransitionPlan,
} from "../../game/progression/screenFlow";

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
    onRewardUnlocked: (reward: GameReward) => void,
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

    // Recuperar el acontecimiento especial activo.
    const specialEvent =
        screen === "special-scene" &&
        progress.specialEvent !== null
            ? getEventById(
                progress.specialEvent.id
            )
            : undefined;

    // Seleccionar su fondo y variante narrativa.
    const specialScene =
        specialEvent?.scene !== undefined
            ? getSpecialScenePresentation(
                specialEvent.scene.id,
                monarch,
                storyFlags
            )
            : null;

    // Preparar la información de la audiencia actual.
    const presentation = getAudiencePresentation({
        monarch,

        dayEvents: specialEvent !== undefined
            ? [specialEvent]
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

                case "reward":
                    onRewardUnlocked(effect.reward);
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

        sceneVisualClassName:
            getSceneVisualClassName(
                activeModifierIds
            ),

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

        specialScene,
    };
}
