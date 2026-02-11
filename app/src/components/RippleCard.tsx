"use client";

import { m } from "framer-motion";
import { useState } from "react";

interface RippleCardProps {
    children: React.ReactNode;
    className?: string;
}

export function RippleCard({ children, className = "" }: RippleCardProps) {
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const id = Date.now();
        setRipples(prev => [...prev, { id, x, y }]);

        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== id));
        }, 1000);
    };

    return (
        <div
            className={`relative overflow-hidden ${className}`}
            onMouseEnter={handleMouseEnter}
        >
            {children}

            {/* Ripple effects */}
            {ripples.map(ripple => (
                <m.div
                    key={ripple.id}
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: 100,
                        height: 100,
                        marginLeft: -50,
                        marginTop: -50,
                        background: "radial-gradient(circle, rgba(212, 197, 165, 0.3) 0%, transparent 70%)",
                    }}
                />
            ))}
        </div>
    );
}
