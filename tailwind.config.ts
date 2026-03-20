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
                headline: ["var(--font-poppins)", "sans-serif"],
                ui: ["var(--font-poppins)", "sans-serif"],
                body: ["var(--font-poppins)", "sans-serif"],
                sans: ["var(--font-poppins)", "sans-serif"],
            },
            fontSize: {
                h1: ["var(--font-h1)", { lineHeight: "0.9", letterSpacing: "-2px", fontWeight: "700" }],
                h2: ["var(--font-h2)", { lineHeight: "1.0", letterSpacing: "var(--font-h2-tracking)", fontWeight: "700" }],
                h3: ["var(--font-h3)", { lineHeight: "1.2", letterSpacing: "var(--font-h3-tracking)", fontWeight: "600" }],
                "body-refined": ["var(--font-body)", { lineHeight: "1.8", letterSpacing: "0.01em", fontWeight: "300" }],
            },
        },
    },
    plugins: [],
};
export default config;
