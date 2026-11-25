import { useEffect, useRef } from "react";

import GoldenFrame from "../shared/GoldenFrame";

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
                <GoldenFrame
                    image="/assets/ui/royalty-sleeping.gif"
                    alt="El rey y la reina durmiendo en sus aposentos"
                />
            </div>
        </main>
    );
}

export default NightRest;
