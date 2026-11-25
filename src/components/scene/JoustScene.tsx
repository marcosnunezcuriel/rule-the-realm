import type { ReactNode } from "react";

import type { AudiencePhase } from "../../types/game";
import type { MonarchRole } from "../../types/monarch";

import { assetUrl } from "../../utils/assetUrl";

import "../../styles/scene/ThroneScene.css";
import "../../styles/scene/JoustScene.css";

type JoustSceneProps = {
    monarch: MonarchRole;
    withBrother: boolean;
    visitorPhase: AudiencePhase;
    visitorImage: string;
    visitorName: string;
    visitorKey: string;
    onVisitorAnimationEnd: () => void;
    children?: ReactNode;
};

function JoustScene({
    monarch,
    withBrother,
    visitorPhase,
    visitorImage,
    visitorName,
    visitorKey,
    onVisitorAnimationEnd,
    children,
}: JoustSceneProps) {
    const background = `/assets/backgrounds/joust-${monarch}${
        withBrother ? "-2" : ""
    }.png`;

    const showVisitor =
        visitorPhase === "entering" ||
        visitorPhase === "speaking" ||
        visitorPhase === "exiting";

    return (
        <main className="throne-scene joust-scene">
            <div className="throne-stage joust-stage">
                <div className="throne-stage__visuals">

                    {/* Grada real y recinto del torneo */}
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

                    {/* Caballero campeón */}
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

export default JoustScene;