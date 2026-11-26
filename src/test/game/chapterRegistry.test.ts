import { describe, expect, it } from "vitest";

import {
    chapters,
    getChapterForDay,
    getNextChapter,
} from "../../data/chapters";

import { achievements } from "../../data/achievements";

import { getEventById } from "../../data/events/eventRegistry";

describe("Registro global de capítulos", () => {
    it("mantiene capítulos consecutivos sin huecos ni solapamientos", () => {
        let expectedNumber = 1;
        let expectedFirstDay = 1;

        for (const chapter of chapters) {
            expect(chapter.number).toBe(
                expectedNumber
            );

            expect(chapter.firstDay).toBe(
                expectedFirstDay
            );

            expect(chapter.lastDay).toBeGreaterThanOrEqual(
                chapter.firstDay
            );

            expect(
                chapter.endingParagraphs.length
            ).toBeGreaterThan(0);

            expectedNumber += 1;
            expectedFirstDay = chapter.lastDay + 1;
        }
    });

    it("registra los acontecimientos en el capítulo correspondiente", () => {
        const eventIds = new Set<string>();

        for (const chapter of chapters) {
            for (const event of chapter.events) {
                expect(
                    eventIds.has(event.id)
                ).toBe(false);

                eventIds.add(event.id);

                expect(
                    event.day
                ).toBeGreaterThanOrEqual(
                    chapter.firstDay
                );

                expect(
                    event.day
                ).toBeLessThanOrEqual(
                    chapter.lastDay
                );

                expect(
                    getChapterForDay(event.day)?.number
                ).toBe(chapter.number);

                expect(
                    getEventById(event.id)
                ).toBe(event);
            }
        }
    });

    it("registra los logros del capítulo sin duplicados", () => {
        const achievementIds = new Set<string>();

        for (const chapter of chapters) {
            const eventIds = new Set(
                chapter.events.map(
                    (event) => event.id
                )
            );

            for (const achievement of chapter.achievements) {
                expect(
                    achievementIds.has(
                        achievement.id
                    )
                ).toBe(false);

                achievementIds.add(
                    achievement.id
                );

                const trigger = achievement.trigger;

                if (trigger.type === "chapter-complete") {
                    expect(
                        trigger.chapter
                    ).toBe(chapter.number);
                } else {
                    expect(
                        eventIds.has(trigger.eventId)
                    ).toBe(true);
                }
            }
        }

        expect(
            achievements.map(
                (achievement) => achievement.id
            )
        ).toEqual([...achievementIds]);
    });

    it("permite avanzar únicamente a capítulos registrados", () => {
        chapters.forEach((chapter, index) => {
            expect(
                getNextChapter(chapter)
            ).toBe(
                chapters[index + 1] ?? null
            );
        });
    });
});
