// Presenta el epílogo del capítulo y las opciones de continuación disponibles.

import NarrativeParchment from "../narrative/NarrativeParchment";

import type { ChapterDefinition } from "../../data/chapters";
import {
    getNextChapter,
    toRomanNumber,
} from "../../data/chapters";


type ChapterEndingProps = {
    chapter: ChapterDefinition;
    onNextChapter: () => void;
    onMenu: () => void;
    initialParagraphIndex: number;
    onParagraphChange: (index: number) => void;
};

function ChapterEnding({
    chapter,
    initialParagraphIndex,
    onParagraphChange,
    onNextChapter,
    onMenu,
}: ChapterEndingProps) {
    const nextChapter = getNextChapter(chapter);

    const nextChapterNumber = toRomanNumber(
        chapter.number + 1
    );

    return (
        <NarrativeParchment
            title={
                `Fin del Capítulo ${toRomanNumber(chapter.number)}`
            }
            paragraphs={chapter.endingParagraphs}
            initialParagraphIndex={initialParagraphIndex}
            onParagraphChange={onParagraphChange}
            finishLabel={
                `Comenzar capítulo ${nextChapterNumber}`
            }
            onFinish={onNextChapter}
            finishDisabled={nextChapter === null}
            finishNotice={
                nextChapter === null
                    ? "El próximo capítulo todavía no está disponible."
                    : undefined
            }
            topActionLabel="Volver al menú principal"
            onTopAction={onMenu}
        />
    );
}

export default ChapterEnding;
