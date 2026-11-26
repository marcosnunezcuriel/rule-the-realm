import NarrativeParchment from "../narrative/NarrativeParchment";

import { getWelcomeParagraphs } from "../../data/narrative/welcomeMessage";

import type { MonarchRole } from "../../types/monarch";

type WelcomeIntroductionProps = {
    monarch: MonarchRole;
    onFinish: () => void;
};

function WelcomeIntroduction({
    monarch,
    onFinish,
}: WelcomeIntroductionProps) {
    const title = monarch === "queen"
        ? "Bienvenida a Astaria"
        : "Bienvenido a Astaria";

    const paragraphs = getWelcomeParagraphs(monarch);

    return (
        <NarrativeParchment
            title={title}
            paragraphs={paragraphs}
            finishLabel="Comenzar a reinar"
            onFinish={onFinish}
            topActionLabel="Saltar introducción"
            onTopAction={onFinish}
        />
    );
}

export default WelcomeIntroduction;
