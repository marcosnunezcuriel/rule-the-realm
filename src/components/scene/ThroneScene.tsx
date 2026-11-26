import type { ReactNode } from "react";

import type {
    SceneBackgroundMap,
    SceneTime,
} from "../../types/scene";

import type { MonarchRole } from "../../types/monarch";

import { assetUrl } from "../../utils/assetUrl";

import SceneStage from "./SceneStage";
import SceneBackground from "./SceneBackground";
import SceneVisitor from "./SceneVisitor";

import type {
    SceneVisitorProps,
} from "./SceneVisitor";

const sceneTimes = [
    "morning",
    "evening",
    "night",
] as const;

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

type ThroneSceneProps = SceneVisitorProps & {
    monarch: MonarchRole;
    timeOfDay: SceneTime;

    visitorKey: string;

    backgroundMap: SceneBackgroundMap;
    visualClassName?: string;

    children?: ReactNode;
};

// Representación del salón del trono.
function ThroneScene({
    monarch,
    timeOfDay,
    visitorKey,
    children,
    backgroundMap,
    visualClassName,
    ...visitor
}: ThroneSceneProps) {
    return (
        <SceneStage
            visualClassName={visualClassName}

            visuals={
                <>
                    {/* Fondos según el momento del día */}
                    {sceneTimes.map((time) => (
                        <SceneBackground
                            key={time}
                            src={backgroundMap[time]}
                            active={timeOfDay === time}
                        />
                    ))}

                    {/* Poses del monarca */}
                    {sceneTimes.map((time) => (
                        <img
                            key={`${monarch}-${time}`}
                            className={
                                "character character--monarch" +
                                (
                                    timeOfDay === time
                                        ? " character--monarch--active"
                                        : ""
                                )
                            }
                            src={assetUrl(
                                monarchPoses[monarch][time]
                            )}
                            alt={
                                timeOfDay === time
                                    ? monarch === "king"
                                        ? "Rey de Astaria"
                                        : "Reina de Astaria"
                                    : ""
                            }
                            aria-hidden={timeOfDay !== time}
                            draggable={false}
                        />
                    ))}

                    <SceneVisitor
                        key={visitorKey}
                        {...visitor}
                    />
                </>
            }
        >
            {children}
        </SceneStage>
    );
}

export default ThroneScene;
