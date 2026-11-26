// Presenta la introducción narrativa y la coronación del protagonista elegido.

import NarrativeParchment from "../narrative/NarrativeParchment";

import { getWelcomeParagraphs } from "../../data/narrative/welcomeMessage";

import type { MonarchRole } from "../../types/monarch";

type WelcomeIntroductionProps = {
    monarch: MonarchRole;
    onFinish: () => void;
};

// Ilustraciones de la coronación según el protagonista.
const coronationIllustrations = {
    king: {
        image: "/assets/ui/coronation-king.png",
        alt: "Coronación del rey de Astaria",
    },

    queen: {
        image: "/assets/ui/coronation-queen.png",
        alt: "Coronación de la reina de Astaria",
    },
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
            illustration={coronationIllustrations[monarch]}
            finishLabel="Comenzar a reinar"
            onFinish={onFinish}
            topActionLabel="Saltar introducción"
            onTopAction={onFinish}
        />
    );
}

export default WelcomeIntroduction;
