import { useEffect, useRef, useState } from "react";

type AnimatedNumberProps = {
    value: number;
    initialValue?: number;
    delayMs?: number;
};

function AnimatedNumber({
    value,
    initialValue = value,
    delayMs = 0,
}: AnimatedNumberProps) {
    const [displayedValue, setDisplayedValue] = useState(initialValue);
    const displayedRef = useRef(initialValue);

    useEffect(() => {
        const startValue = displayedRef.current;
        const difference = Math.abs(value - startValue);

        if (difference === 0) {
            return;
        }

        const duration = Math.min(
            Math.max(difference * 25, 120),
            650
        );

        let startTime: number | null = null;
        let frameId = 0;
        let timeoutId = 0;

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

        if (delayMs > 0) {
            timeoutId = window.setTimeout(() => {
                frameId = window.requestAnimationFrame(animate);
            }, delayMs);
        } else {
            frameId = window.requestAnimationFrame(animate);
        }

        return () => {
            window.clearTimeout(timeoutId);
            window.cancelAnimationFrame(frameId);
        };
    }, [value, delayMs]);

    return <span>{displayedValue}</span>;
}

export default AnimatedNumber;
