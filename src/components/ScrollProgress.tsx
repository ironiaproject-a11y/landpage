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
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-[60px] left-0 right-0 z-[9998] h-[1px] bg-transparent pointer-events-none"
        >
            <m.div
                style={{ scaleX }}
                className="h-full origin-left bg-gradient-to-r from-transparent via-white/40 to-transparent shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            />
        </m.div>
    );
}
