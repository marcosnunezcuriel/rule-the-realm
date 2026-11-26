import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";

import {
    chapters,
    getChapterForDay,
    getNextChapter,
} from "../../data/chapters";
import { achievements } from "../../data/achievements";
import { getEventsForDay } from "../../data/events/eventRegistry";
import { getEventById } from "../../data/events/eventRegistry";
import {
    defaultSceneBackgrounds,
    sceneThemes,
} from "../../data/scenes/sceneThemes";
import { specialSceneRegistry } from "../../data/scenes/specialSceneRegistry";

// Eventos anunciados cuyo capítulo todavía no está implementado.
const pendingEventIds = new Set<string>([
    "chapter2-bankers-claim",
    "chapter2-hospitals",
    "chapter2-pontiff-meeting",
]);

// Comprobar los recursos que utiliza el contenido narrativo.
function expectAsset(path: string) {
    expect(path).toMatch(/^\/assets\//);

    expect(
        existsSync(
            new URL(
                `../../../public${path}`,
                import.meta.url
            )
        ),
        `No existe el recurso ${path}`
    ).toBe(true);
}

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

    it("mantiene un orden válido y desbloqueos coherentes en todos los capítulos", () => {
        const events = chapters.flatMap(
            (chapter) => chapter.events
        );

        const incomingUnlocks = new Set<string>();

        for (const event of events) {
            expect(
                Number.isInteger(event.order),
                `Orden incorrecto en ${event.id}`
            ).toBe(true);

            expect(event.order).toBeGreaterThan(0);

            const unlocks = [
                ...Object.values(
                    event.unlocks ?? {}
                ).flat(),

                ...(event.unlocksOnComplete ?? []),
            ];

            for (const id of unlocks) {
                incomingUnlocks.add(id);

                const target = getEventById(id);

                if (target === undefined) {
                    expect(
                        pendingEventIds.has(id),
                        `El evento ${event.id} desbloquea un ID inexistente: ${id}`
                    ).toBe(true);

                    continue;
                }

                expect(
                    target.day,
                    `Desbloqueo incorrecto: ${event.id} -> ${id}`
                ).toBeGreaterThan(event.day);

                expect(
                    target.requiresUnlock
                ).toBe(true);
            }
        }

        for (const event of events) {
            if (event.requiresUnlock) {
                expect(
                    incomingUnlocks.has(event.id),
                    `Evento sin ruta de desbloqueo: ${event.id}`
                ).toBe(true);
            }
        }

        for (const chapter of chapters) {
            for (
                let day = chapter.firstDay;
                day <= chapter.lastDay;
                day++
            ) {
                const dayEvents =
                    getEventsForDay(day);

                const orders = dayEvents.map(
                    (event) => event.order
                );

                expect(
                    new Set(orders).size,
                    `Órdenes duplicados en el día ${day}`
                ).toBe(orders.length);

                expect(orders).toEqual(
                    [...orders].sort((a, b) => a - b)
                );
            }
        }
    });

    it("todos los acontecimientos contienen diálogos válidos", () => {
        for (const chapter of chapters) {
            for (const event of chapter.events) {
                const { dialogue } = event;

                expect(
                    dialogue.speaker.trim().length,
                    `Interlocutor vacío en ${event.id}`
                ).toBeGreaterThan(0);

                expect(
                    dialogue.introduction.length,
                    `Introducción vacía en ${event.id}`
                ).toBeGreaterThan(0);

                const paragraphs = [
                    ...dialogue.introduction,
                    ...(dialogue.responses?.yes ?? []),
                    ...(dialogue.responses?.no ?? []),
                ];

                for (const paragraph of paragraphs) {
                    expect(
                        paragraph.trim().length,
                        `Párrafo vacío en ${event.id}`
                    ).toBeGreaterThan(0);
                }

                if (dialogue.responses) {
                    expect(
                        dialogue.responses.yes.length,
                        `Respuesta afirmativa vacía en ${event.id}`
                    ).toBeGreaterThan(0);

                    expect(
                        dialogue.responses.no.length,
                        `Respuesta negativa vacía en ${event.id}`
                    ).toBeGreaterThan(0);
                } else {
                    expect(event.effects).toBeUndefined();
                    expect(event.unlocks).toBeUndefined();
                    expect(event.rewards).toBeUndefined();
                    expect(event.addModifiers).toBeUndefined();
                    expect(event.addStoryFlags).toBeUndefined();
                    expect(event.removeStoryFlags).toBeUndefined();
                }
            }
        }
    });

    it("todos los acontecimientos y escenarios utilizan imágenes existentes", () => {
        for (const chapter of chapters) {
            for (const event of chapter.events) {
                expectAsset(event.image);

                if (event.queenVisitor?.image) {
                    expectAsset(
                        event.queenVisitor.image
                    );
                }
            }
        }

        for (const path of Object.values(
            defaultSceneBackgrounds
        )) {
            expectAsset(path);
        }

        for (const theme of sceneThemes) {
            for (const path of Object.values(
                theme.backgrounds
            )) {
                expectAsset(path);
            }
        }

        for (const scene of Object.values(
            specialSceneRegistry
        )) {
            for (const path of Object.values(
                scene.backgrounds
            )) {
                expectAsset(path);
            }

            for (const variant of scene.variants ?? []) {
                for (const path of Object.values(
                    variant.backgrounds
                )) {
                    expectAsset(path);
                }
            }
        }
    });
});
