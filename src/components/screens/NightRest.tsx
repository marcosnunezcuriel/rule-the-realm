import { useEffect, useRef } from "react";

import { assetUrl } from "../../utils/assetUrl";

import "../../styles/screens/NightRest.css";

// Un ciclo del GIF: 4 fotogramas de 650 ms.
export const NIGHT_REST_DURATION_MS = 2600;

type NightRestProps = {
    onFinish: () => void;
};

function NightRest({ onFinish }: NightRestProps) {
    const onFinishRef = useRef(onFinish);

    useEffect(() => {
        onFinishRef.current = onFinish;
    }, [onFinish]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            onFinishRef.current();
        }, NIGHT_REST_DURATION_MS);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, []);

    return (
        <main className="night-rest">
            <div className="night-rest__frame">
                <img
                    className="night-rest__image"
                    src={assetUrl(
                        "/assets/ui/royalty-sleeping.gif"
                    )}
                    alt="El rey y la reina durmiendo en sus aposentos"
                    draggable={false}
                />
            </div>
        </main>
    );
}

export default NightRest;
