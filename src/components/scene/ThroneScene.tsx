import type { ReactNode } from "react";

import type { AudiencePhase } from "../../types/game";
import type {
    SceneBackgroundMap,
    SceneTime,
} from "../../types/scene";

import { assetUrl } from "../../utils/assetUrl";

import "../../styles/scene/ThroneScene.css";

type ThroneSceneProps = {
    timeOfDay: SceneTime;
    visitorPhase: AudiencePhase;
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
    backgroundMap,
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

                {/* Ilustraciones del escenario */}
                <div className="throne-stage__visuals">
                    {backgrounds.map((background) => (
                        <img
                            key={background.time}
                            className={`throne-stage__background ${
                                timeOfDay === background.time
                                    ? "throne-stage__background--active"
                                    : ""
                            }`}
                            src={assetUrl(background.src)}
                            alt=""
                            aria-hidden="true"
                            draggable={false}
                        />
                    ))}

                    <img
                        className="character character--king"
                        src={assetUrl(
                            "/assets/characters/royalty/king.png"
                        )}
                        alt="Rey de Astaria"
                        draggable={false}
                    />

                    {showVisitor && (
                        <div
                            key={visitorKey}
                            className={
                                `character character--visitor ` +
                                `visitor--${visitorPhase}`
                            }
                            onAnimationEnd={(event) => {
                                if (
                                    event.target === event.currentTarget
                                ) {
                                    onVisitorAnimationEnd();
                                }
                            }}
                        >
                            <img
                                className="visitor__image"
                                src={assetUrl(visitorImage)}
                                alt={visitorName}
                                draggable={false}
                            />
                        </div>
                    )}
                </div>

                {/* Diálogos: superpuestos en PC, debajo en móvil */}
                <div className="throne-stage__dialogue">
                    {children}
                </div>
            </div>
        </main>
    );
}

export default ThroneScene;
