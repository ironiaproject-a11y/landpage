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
                // Mapping User's Design System (Elite Titanium Refinement)
                white: "#FAF9F7", // Warm White (Primary)
                "gray-body": "#D6D6D6", // Light Gray (Body)
                "silver-main": "#CBD5E1", // Metallic Silver (Accent)
                "blue-tech": "#3B82F6", // Tech Link
                "charcoal": "#1A1A1A",
                "graphite": "#121212",
                "deep-black": "#0B0B0B",
                "accent-gold": "rgba(var(--color-accent-gold-rgb), <alpha-value>)",
            },
            boxShadow: {
                "premium-1": "var(--shadow-premium-1)",
                "premium-2": "var(--shadow-premium-2)",
                "premium-3": "var(--shadow-premium-3)",
            },
            fontFamily: {
                headline: "var(--font-headline)",
                ui: "var(--font-ui)",
                bodoni: "var(--font-bodoni)",
                body: "var(--font-ui)",
            },
        },
    },
    plugins: [],
};
export default config;
