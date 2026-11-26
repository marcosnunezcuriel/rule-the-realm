import type { ReactNode } from "react";

import type { AudiencePhase } from "../../types/game";

import type {
    SpecialSceneId,
} from "../../data/scenes/specialSceneRegistry";

import { assetUrl } from "../../utils/assetUrl";

import "../../styles/scene/ThroneScene.css";
import "../../styles/scene/JoustScene.css";

type SpecialSceneProps = {
    sceneId: SpecialSceneId;
    background: string;

    visitorPhase: AudiencePhase;
    visitorImage: string;
    visitorName: string;
    visitorKey: string;

    onVisitorAnimationEnd: () => void;

    children?: ReactNode;
};

// Representación visual de cualquier escenario especial.
function SpecialScene({
    sceneId,
    background,
    visitorPhase,
    visitorImage,
    visitorName,
    visitorKey,
    onVisitorAnimationEnd,
    children,
}: SpecialSceneProps) {
    const showVisitor =
        visitorPhase === "entering" ||
        visitorPhase === "speaking" ||
        visitorPhase === "exiting";

    return (
        <main
            className={`throne-scene ${sceneId}-scene`}
        >
            <div
                className={`throne-stage ${sceneId}-stage`}
            >
                <div className="throne-stage__visuals">

                    {/* Fondo del escenario especial */}
                    <img
                        className="
                            throne-stage__background
                            throne-stage__background--active
                        "
                        src={assetUrl(background)}
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                    />

                    {/* Visitante */}
                    {showVisitor && (
                        <div
                            key={visitorKey}
                            className={
                                `character character--visitor ` +
                                `visitor--${visitorPhase}`
                            }
                            onAnimationEnd={(event) => {
                                if (
                                    event.target ===
                                    event.currentTarget
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

                {/* Diálogo y decisión del monarca */}
                <div className="throne-stage__dialogue">
                    {children}
                </div>
            </div>
        </main>
    );
}

export default SpecialScene;
