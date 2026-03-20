import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Monochromatic Design System
                white: "#FFFFFF",
                black: "#000000",
                "gray-body": "#A1A1A1",
                "silver-main": "#E5E5E5",
                "charcoal": "#111111",
                "graphite": "#080808",
                "deep-black": "#000000",
                "accent": "var(--color-accent)",
            },
            boxShadow: {
                "premium-1": "var(--shadow-premium-1)",
                "premium-2": "var(--shadow-premium-2)",
                "premium-3": "var(--shadow-premium-3)",
            },
            fontFamily: {
                serif: ["var(--font-serif)", "serif"],
                sans: ["var(--font-sans)", "sans-serif"],
                headline: ["var(--font-serif)", "serif"],
                ui: ["var(--font-sans)", "sans-serif"],
                body: ["var(--font-sans)", "sans-serif"],
            },
            fontSize: {
                h1: ["var(--font-h1)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "500" }],
                h2: ["var(--font-h2)", { lineHeight: "1.1", letterSpacing: "-0.015em", fontWeight: "500" }],
                h3: ["var(--font-h3)", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "500" }],
                "body-refined": ["16px", { lineHeight: "1.7", letterSpacing: "0", fontWeight: "400" }],
            },
        },
    },
    plugins: [],
};
export default config;
