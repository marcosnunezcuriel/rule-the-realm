import type { ReactNode } from "react";

import type { SceneBackgroundMap } from "../data/scenes/sceneThemes";

import "../styles/ThroneScene.css";

type VisitorPhase =
    | "entering"
    | "speaking"
    | "exiting"
    | "transitioning"
    | "waiting";

type ThroneSceneProps = {
    timeOfDay: "morning" | "evening" | "night";
    visitorPhase: VisitorPhase;
    visitorImage: string;
    visitorName: string;
    visitorKey: string;
    onVisitorAnimationEnd: () => void;
    children?: ReactNode;
    backgroundMap: SceneBackgroundMap;
};

function ThroneScene({
    timeOfDay,
    visitorPhase,
    visitorImage,
    visitorName,
    visitorKey,
    onVisitorAnimationEnd,
    children,
    backgroundMap
}: ThroneSceneProps) {
    const showVisitor =
        visitorPhase === "entering" ||
        visitorPhase === "speaking" ||
        visitorPhase === "exiting";

    const backgrounds = [
        {
            time: "morning",
            src: backgroundMap.morning,
        },
        {
            time: "evening",
            src: backgroundMap.evening,
        },
        {
            time: "night",
            src: backgroundMap.night,
        },
    ] as const;

    return (
        <main className="throne-scene">
            <div className="throne-stage">

                {backgrounds.map((background) => (
                    <img
                        key={background.time}
                        className={`throne-stage__background ${
                            timeOfDay === background.time
                                ? "throne-stage__background--active"
                                : ""
                        }`}
                        src={background.src}
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                    />
                ))}

                <img
                    className="character character--king"
                    src="/assets/characters/royalty/king.png"
                    alt="Rey de Astaria"
                    draggable={false}
                />

                {showVisitor && (
                    <div
                        key={visitorKey}
                        className={`character character--visitor visitor--${visitorPhase}`}
                        onAnimationEnd={(event) => {
                            if (event.target === event.currentTarget) {
                                onVisitorAnimationEnd();
                            }
                        }}
                    >
                        <img
                            className="visitor__image"
                            src={visitorImage}
                            alt={visitorName}
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
