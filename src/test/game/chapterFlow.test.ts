import { describe, expect, it } from "vitest";

import {
    getChapterPresentation,
    planDayAdvance,
    planChapterAdvance,
} from "../../game/chapterFlow";
import { createGameState } from "../../game/state/createGameState";
import { gameReducer } from "../../game/state/gameReducer";

import { createSave } from "../helpers/createSave";
import { createStats } from "../helpers/createStats";

describe("Progresión de capítulos y jornadas", () => {
    it.each([true, false])(
        "prepara el segundo día con torneo autorizado: %s",
        (withJoust) => {
            const progress = createSave({
                screen: "summary",
                dayClosed: true,

                unlockedEventIds: withJoust
                    ? ["2.1"]
                    : [],
            });

            const plan = planDayAdvance(
                progress
            );

            expect(plan).toEqual({
                transition: {
                    action: {
                        type: "START_DAY",
                    },

                    fullScreen: false,
                    enterAudience: true,
                },

                achievements: [],
                resetEndingParagraph: false,
            });

            if (plan === null) {
                throw new Error(
                    "No se pudo preparar la jornada."
                );
            }

            const next = gameReducer(
                createGameState("king", progress),
                plan.transition.action
            );

            expect(next.progress.screen).toBe(
                withJoust
                    ? "special-scene"
                    : "scene"
            );

            expect(
                next.progress.specialEvent
            ).toEqual(
                withJoust
                    ? {
                        id: "2.1",
                        completed: false,
                    }
                    : null
            );

            expect(progress.day).toBe(1);
        }
    );

    it("no celebra un escenario especial si existe una derrota", () => {
        const progress = createSave({
            screen: "summary",

            stats: createStats({
                gold: -50,
            }),

            unlockedEventIds: [
                "2.1",
            ],
        });

        const plan = planDayAdvance(
            progress
        );

        if (plan === null) {
            throw new Error(
                "No se pudo preparar la jornada."
            );
        }

        expect(
            plan.transition.action
        ).toEqual({
            type: "START_DAY",
        });

        const next = gameReducer(
            createGameState("king", progress),
            plan.transition.action
        );

        expect(next.progress.screen).toBe("scene");

        expect(
            next.progress.specialEvent
        ).toBeNull();

        expect(
            next.progress.specialAudience
        ).toBe("defeat");
    });

    it("prepara el epílogo y el logro al terminar el capítulo I", () => {
        const progress = createSave({
            day: 7,
            screen: "summary",
            dayClosed: true,
        });

        const presentation =
            getChapterPresentation(
                progress.day,
                progress.stats
            );

        expect(
            presentation.summaryContinueLabel
        ).toBe("Fin capítulo I");

        expect(
            planDayAdvance(progress)
        ).toEqual({
            transition: {
                action: {
                    type: "SET_SCREEN",
                    screen: "chapter-ending",
                },

                fullScreen: true,
                enterAudience: false,
            },

            achievements: [
                "first-steps",
            ],

            resetEndingParagraph: true,
        });
    });

    it("no comienza un capítulo que todavía no existe", () => {
        const progress = createSave({
            day: 7,
            screen: "chapter-ending",
        });

        expect(
            planChapterAdvance(progress)
        ).toBeNull();
    });
});
