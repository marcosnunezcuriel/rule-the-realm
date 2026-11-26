import type { AudiencePhase } from "../../types/game";

import { assetUrl } from "../../utils/assetUrl";

export type SceneVisitorProps = {
    visitorPhase: AudiencePhase;
    visitorImage: string;
    visitorName: string;
    onVisitorAnimationEnd: () => void;
};

// Representar al visitante y sus animaciones.
function SceneVisitor({
    visitorPhase,
    visitorImage,
    visitorName,
    onVisitorAnimationEnd,
}: SceneVisitorProps) {
    const showVisitor =
        visitorPhase === "entering" ||
        visitorPhase === "speaking" ||
        visitorPhase === "exiting";

    if (!showVisitor) {
        return null;
    }

    return (
        <div
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
    );
}

export default SceneVisitor;
