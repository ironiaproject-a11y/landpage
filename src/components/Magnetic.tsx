"use client";

import { m, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";

interface MagneticProps {
    children: React.ReactNode;
    strength?: number;
    range?: number;
    className?: string;
}

export function Magnetic({ children, strength = 0.5, range = 100, className = "" }: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Displacement motion values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring physics
    const springConfig = { damping: 15, stiffness: 150 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distanceX = e.clientX - centerX;
            const distanceY = e.clientY - centerY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (distance < range) {
                // Calculate pull strength based on distance
                const pull = Math.max(0, (range - distance) / range);
                x.set(distanceX * pull * strength);
                y.set(distanceY * pull * strength);
            } else {
                x.set(0);
                y.set(0);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [x, y, range, strength]);

    return (
        <m.div
            ref={ref}
            className={className}
            style={{ x: springX, y: springY }}
            data-cursor="magnetic"
        >
            {children}
        </m.div>
    );
}
