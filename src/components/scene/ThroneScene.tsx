import type { ReactNode } from "react";

import type { AudiencePhase } from "../../types/game";
import type {
    SceneBackgroundMap,
    SceneTime,
} from "../../types/scene";
import type { MonarchRole } from "../../types/monarch";

import { assetUrl } from "../../utils/assetUrl";

import "../../styles/scene/ThroneScene.css";

const monarchPoses: Record<
    MonarchRole,
    Record<SceneTime, string>
> = {
    king: {
        morning:
            "/assets/characters/royalty/king-throne-pose-1.png",
        evening:
            "/assets/characters/royalty/king-throne-pose-2.png",
        night:
            "/assets/characters/royalty/king-throne-pose-3.png",
    },

    queen: {
        morning:
            "/assets/characters/royalty/queen-throne-pose-1.png",
        evening:
            "/assets/characters/royalty/queen-throne-pose-2.png",
        night:
            "/assets/characters/royalty/queen-throne-pose-3.png",
    },
};

type ThroneSceneProps = {
    monarch: MonarchRole;
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
    monarch,
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

    
    const poses = [
            {
                time: "morning",
                image: monarchPoses[monarch].morning,
            },
            {
                time: "evening",
                image: monarchPoses[monarch].evening,
            },
            {
                time: "night",
                image: monarchPoses[monarch].night,
            },
        ] as const;

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

                    {/* Poses del monarca según el momento del día */}
                    {poses.map((pose) => (
                        <img
                            key={`${monarch}-${pose.time}`}
                            className={
                                `character character--monarch ` +
                                (
                                    timeOfDay === pose.time
                                        ? "character--monarch--active"
                                        : ""
                                )
                            }
                            src={assetUrl(pose.image)}
                            alt={
                                timeOfDay === pose.time
                                    ? monarch === "king"
                                        ? "Rey de Astaria"
                                        : "Reina de Astaria"
                                    : ""
                            }
                            aria-hidden={timeOfDay !== pose.time}
                            draggable={false}
                        />
                    ))}

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
