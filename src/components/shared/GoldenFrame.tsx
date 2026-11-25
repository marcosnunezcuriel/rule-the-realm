import { assetUrl } from "../../utils/assetUrl";

import "../../styles/shared/GoldenFrame.css";

type GoldenFrameProps = {
    image: string;
    alt: string;
};

function GoldenFrame({
    image,
    alt,
}: GoldenFrameProps) {
    return (
        <div className="golden-frame">
            {/* Imagen que aparece dentro del cuadro */}
            <img
                className="golden-frame__content"
                src={assetUrl(image)}
                alt={alt}
                draggable={false}
            />

            {/* Marco dorado por encima de la imagen */}
            <img
                className="golden-frame__ornament"
                src={assetUrl("/assets/ui/golden-frame.png")}
                alt=""
                aria-hidden="true"
                draggable={false}
            />
        </div>
    );
}

export default GoldenFrame;
