import { welcomeParagraphs } from "../data/narrative/welcomeMessage";

import NarrativeParchment from "./NarrativeParchment";

type WelcomeIntroductionProps = {
    onFinish: () => void;
};

function WelcomeIntroduction({
    onFinish,
}: WelcomeIntroductionProps) {
    return (
        <NarrativeParchment
            title="Bienvenido a Astaria"
            paragraphs={welcomeParagraphs}
            finishLabel="Comenzar a reinar"
            onFinish={onFinish}
            topActionLabel="Saltar introducción"
            onTopAction={onFinish}
        />
    );
}

export default WelcomeIntroduction;
