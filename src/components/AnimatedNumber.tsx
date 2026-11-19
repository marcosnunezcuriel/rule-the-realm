
import { useEffect, useRef, useState } from "react";

type AnimatedNumberProps = {
    value: number;
};

function AnimatedNumber({ value }: AnimatedNumberProps) {
    const [displayedValue, setDisplayedValue] = useState(value);
    const displayedRef = useRef(value);

    useEffect(() => {
        const startValue = displayedRef.current;
        const difference = Math.abs(value - startValue);

        if (difference === 0) {
            return;
        }

        // 25 ms por unidad, con un máximo de 650 ms.
        const duration = Math.min(
            Math.max(difference * 25, 120),
            650
        );

        let startTime: number | null = null;
        let frameId: number;

        function animate(currentTime: number) {
            if (startTime === null) {
                startTime = currentTime;
            }

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const nextValue = Math.round(
                startValue + (value - startValue) * progress
            );

            if (nextValue !== displayedRef.current) {
                displayedRef.current = nextValue;
                setDisplayedValue(nextValue);
            }

            if (progress < 1) {
                frameId = window.requestAnimationFrame(animate);
            }
        }

        frameId = window.requestAnimationFrame(animate);

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [value]);

    return <span>{displayedValue}</span>;
}

export default AnimatedNumber;
