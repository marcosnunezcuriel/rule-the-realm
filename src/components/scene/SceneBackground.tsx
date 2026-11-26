import { assetUrl } from "../../utils/assetUrl";

type SceneBackgroundProps = {
    src: string;
    active?: boolean;
};

// Representar una capa de fondo del escenario.
function SceneBackground({
    src,
    active = true,
}: SceneBackgroundProps) {
    const className =
        "throne-stage__background" +
        (
            active
                ? " throne-stage__background--active"
                : ""
        );

    return (
        <img
            className={className}
            src={assetUrl(src)}
            alt=""
            aria-hidden="true"
            draggable={false}
        />
    );
}

export default SceneBackground;
