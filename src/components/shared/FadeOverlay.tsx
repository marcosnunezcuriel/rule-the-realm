import type { FadeStage } from "../../types/game";

import "../../styles/shared/FadeOverlay.css";

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
    const className = [
        "fade-overlay",

        variant === "navigation"
            ? "fade-overlay--navigation"
            : "",

        stage === "darkening"
            ? "fade-overlay--visible"
            : "",

        stage !== "idle"
            ? "fade-overlay--active"
            : "",

        variant === "screen" && fullScreen
            ? "fade-overlay--full-screen"
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
