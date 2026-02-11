"use client";

import { useEffect, useState } from "react";
import { m, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
    const [isVisible, setIsVisible] = useState(false);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 100);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-[9998] h-[2px] bg-transparent pointer-events-none"
        >
            <m.div
                style={{ scaleX }}
                className="h-full origin-left bg-gradient-to-r from-[var(--color-silver-bh)] via-[var(--color-gold-light)] to-[var(--color-silver-bh)] shadow-[0_0_10px_rgba(212,197,165,0.5)]"
            />
        </m.div>
    );
}
