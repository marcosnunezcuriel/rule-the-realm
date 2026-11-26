import { useState } from "react";

import GoldenFrame from "../shared/GoldenFrame";

import { useModalFocus } from "../../hooks/modals/useModalFocus";

const MAP_IMAGE =
    "/assets/ui/astaria-map.png";

type ExpandedMapProps = {
    onClose: () => void;
};

// Ventana ampliada del mapa.
function ExpandedMap({
    onClose,
}: ExpandedMapProps) {
    const modalRef = useModalFocus(onClose);

    return (
        <div
            ref={modalRef}
            tabIndex={-1}
            className="main-menu__map-overlay realm-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label="Mapa ampliado del reino de Astaria"
        >
            <button
                type="button"
                className="main-menu__map-dismiss"
                onClick={onClose}
                aria-label="Cerrar mapa ampliado"
            />

            <div className="main-menu__map-expanded">
                <GoldenFrame
                    image={MAP_IMAGE}
                    alt="Mapa del reino de Astaria"
                />
            </div>
        </div>
    );
}

// Mapa decorativo y su vista ampliada.
function MapPreview() {
    const [isMapOpen, setIsMapOpen] =
        useState(false);

    return (
        <>
            <button
                type="button"
                className="main-menu__map"
                onClick={() => {
                    setIsMapOpen(true);
                }}
                aria-label="Ampliar mapa del reino de Astaria"
                aria-haspopup="dialog"
            >
                <GoldenFrame
                    image={MAP_IMAGE}
                    alt=""
                />
            </button>

            {isMapOpen && (
                <ExpandedMap
                    onClose={() => {
                        setIsMapOpen(false);
                    }}
                />
            )}
        </>
    );
}

export default MapPreview;
