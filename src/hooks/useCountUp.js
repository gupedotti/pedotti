import { useEffect, useState, useRef } from 'react';

export const useCountUp = (target, duration = 2000, startCounting = false) => {
    const [count, setCount] = useState(0);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!startCounting || hasAnimated.current) return;
        hasAnimated.current = true;

        const startTime = performance.now();
        const numericTarget = parseInt(target, 10) || 0;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.round(eased * numericTarget);

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [target, duration, startCounting]);

    return count;
};
