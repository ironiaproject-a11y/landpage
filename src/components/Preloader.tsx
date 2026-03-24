"use client";

import { m, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (window as any).__PRELOADER_ACTIVE__ = true;
        let minTimeElapsed = false;
        let assetsLoaded = (window as any).__HERO_ASSETS_LOADED__ || false;

        const checkExit = () => {
            if (minTimeElapsed && assetsLoaded) {
                window.dispatchEvent(new CustomEvent("preloader-exiting"));
                setIsLoading(false);
                // Dispatch finished after transition duration (1.4s)
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent("preloader-finished"));
                    (window as any).__PRELOADER_ACTIVE__ = false;
                }, 1400);
            }
        };

        const timer = setTimeout(() => {
            minTimeElapsed = true;
            checkExit();
        }, 800); // Snappier entrance

        const handleAssetsLoaded = () => {
            assetsLoaded = true;
            checkExit();
        };

        window.addEventListener("hero-assets-loaded", handleAssetsLoaded);

        // Failsafe timeout to force loading finish after 6 seconds
        const safetyTimer = setTimeout(() => {
            assetsLoaded = true;
            minTimeElapsed = true;
            checkExit();
        }, 6000);

        return () => {
            clearTimeout(timer);
            clearTimeout(safetyTimer);
            window.removeEventListener("hero-assets-loaded", handleAssetsLoaded);
            (window as any).__PRELOADER_ACTIVE__ = false;
        };
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
                        className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent blur-[120px]"
                    />

                    <div className="relative flex flex-col items-center">
                        <m.div
                            initial={{ width: 0 }}
                            animate={{ width: "240px" }}
                            transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
                            className="h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent mb-8"
                        />

                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="flex flex-col items-center"
                        >
                            <span className="font-headline text-lg font-light text-white tracking-[var(--font-h3-tracking)] uppercase mb-2">
                                Clínica
                            </span>
                            <span className="text-white/40 text-[var(--font-small)] uppercase tracking-[var(--font-small-tracking)] ml-1 font-[400]">
                                Excellence in Dentistry
                            </span>
                        </m.div>

                        <m.div
                            initial={{ width: 0 }}
                            animate={{ width: "240px" }}
                            transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
                            className="h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent mt-8"
                        />

                        {/* Progress Indicator */}
                        <div className="absolute -bottom-24 w-40 h-[1px] bg-white/10 overflow-hidden rounded-full">
                            <m.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
                                className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_15px_rgba(255,255,255,0.3)]"
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
