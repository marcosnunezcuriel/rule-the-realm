import type { FadeStage } from "../../types/game";

import "../../styles/layout/Navigation.css";

type FadeOverlayProps = {
    stage: FadeStage;
    variant: "navigation" | "screen";
    fullScreen?: boolean;
    onFadeEnd: () => void;
};

// Capa compartida para los fundidos a negro.
function FadeOverlay({
    stage,
    variant,
    fullScreen = false,
    onFadeEnd,
}: FadeOverlayProps) {
    const baseClass =
        variant === "navigation"
            ? "navigation-fade"
            : "screen-fade";

    const className = [
        baseClass,

        stage === "darkening"
            ? `${baseClass}--visible`
            : "",

        stage !== "idle"
            ? `${baseClass}--active`
            : "",

        variant === "screen" && fullScreen
            ? "screen-fade--full-screen"
            : "",
    ].filter(Boolean).join(" ");

    return (
        <div
            className={className}
            aria-hidden="true"
            onTransitionEnd={(event) => {
                if (
                    event.target === event.currentTarget &&
                    event.propertyName === "opacity"
                ) {
                    onFadeEnd();
                }
            }}
        />
    );
}

export default FadeOverlay;
