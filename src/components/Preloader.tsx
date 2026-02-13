"use client";

import { m, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Minimum loading time for the animation to feel intentional
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <m.div
                    initial={{ opacity: 1 }}
                    exit={{
                        scale: 1.8,
                        opacity: 0,
                        filter: "blur(60px)",
                        transition: {
                            duration: 1.4,
                            ease: [0.76, 0, 0.24, 1],
                            opacity: { duration: 1 }
                        }
                    }}
                    className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden origin-center"
                >
                    {/* Atmospheric Lighting */}
                    <m.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.15, scale: 1 }}
                        transition={{ duration: 2 }}
                        className="absolute inset-0 bg-gradient-to-br from-[var(--color-silver-bh)]/30 via-transparent to-transparent blur-[120px]"
                    />

                    <div className="relative flex flex-col items-center">
                        <m.div
                            initial={{ width: 0 }}
                            animate={{ width: "240px" }}
                            transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
                            className="h-[1px] bg-gradient-to-r from-transparent via-[var(--color-silver-bh)] to-transparent mb-8"
                        />

                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="flex flex-col items-center"
                        >
                            <span className="font-display text-lg font-light text-white tracking-[0.3em] uppercase mb-2">
                                Clínica
                            </span>
                            <span className="text-white/20 text-[8px] uppercase tracking-[0.6em] ml-1">
                                Excellence in Dentistry
                            </span>
                        </m.div>

                        <m.div
                            initial={{ width: 0 }}
                            animate={{ width: "240px" }}
                            transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
                            className="h-[1px] bg-gradient-to-r from-transparent via-[var(--color-silver-bh)] to-transparent mt-8"
                        />

                        {/* Progress Indicator */}
                        <div className="absolute -bottom-24 w-40 h-[2px] bg-white/5 overflow-hidden rounded-full">
                            <m.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ duration: 1.8, ease: "easeInOut" }}
                                className="w-full h-full bg-[var(--color-silver-bh)] shadow-[0_0_10px_var(--color-silver-bh)]"
                            />
                        </div>
                    </div>

                    {/* Background Noise/Texture */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-leather.png")' }} />
                </m.div>
            )}
        </AnimatePresence>
    );
}
