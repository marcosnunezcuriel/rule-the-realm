
import type { ReactNode } from "react";

import "../styles/ThroneScene.css";

type VisitorPhase = "entering" | "speaking" | "exiting" | "finished";

type ThroneSceneProps = {
    timeOfDay: "morning" | "evening" | "night";
    visitorPhase: VisitorPhase;
    onVisitorAnimationEnd: () => void;
    children?: ReactNode;
};

function ThroneScene({
    timeOfDay,
    visitorPhase,
    onVisitorAnimationEnd,
    children,
}: ThroneSceneProps) {
    const backgroundMap = {
        morning: "/assets/backgrounds/background-morning.png",
        evening: "/assets/backgrounds/background-evening.png",
        night: "/assets/backgrounds/background-night.png",
    };

    return (
        <main className="throne-scene">
            <div className="throne-stage">
                <img
                    className="throne-stage__background"
                    src={backgroundMap[timeOfDay]}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                />

                <img
                    className="character character--king"
                    src="/assets/characters/royalty/king.png"
                    alt="Rey de Astaria"
                    draggable={false}
                />

                {visitorPhase !== "finished" && (
                    <div
                        className={`character character--visitor visitor--${visitorPhase}`}
                        onAnimationEnd={(event) => {
                            if (event.target === event.currentTarget) {
                                onVisitorAnimationEnd();
                            }
                        }}
                    >
                        <img
                            className="visitor__image"
                            src="/assets/characters/courtiers/royal-advisor.png"
                            alt="Consejera real"
                            draggable={false}
                        />
                    </div>
                )}

                {children}
            </div>
        </main>
    );
}

export default ThroneScene;
