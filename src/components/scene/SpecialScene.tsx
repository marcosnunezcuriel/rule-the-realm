import type { ReactNode } from "react";

import {
    specialSceneRegistry,
} from "../../data/scenes/specialSceneRegistry";

import type {
    SpecialSceneId,
} from "../../data/scenes/specialSceneRegistry";

import SceneStage from "./SceneStage";
import SceneBackground from "./SceneBackground";
import SceneVisitor from "./SceneVisitor";

import type {
    SceneVisitorProps,
} from "./SceneVisitor";

type SpecialSceneProps = SceneVisitorProps & {
    sceneId: SpecialSceneId;
    background: string;
    visitorKey: string;

    children?: ReactNode;
};

// Representación de cualquier escenario especial.
function SpecialScene({
    sceneId,
    background,
    visitorKey,
    children,
    ...visitor
}: SpecialSceneProps) {
    const layout =
        specialSceneRegistry[sceneId].layout;

    return (
        <SceneStage
            layout={layout}

            visuals={
                <>
                    <SceneBackground
                        src={background}
                    />

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

export default SpecialScene;
