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
                headline: "var(--font-poppins)",
                ui: "var(--font-poppins)",
                bodoni: "var(--font-poppins)",
                body: "var(--font-poppins)",
            },
        },
    },
    plugins: [],
};
export default config;
