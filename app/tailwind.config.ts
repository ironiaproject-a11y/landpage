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
            },
            fontFamily: {
                display: "var(--font-display)",
                body: "var(--font-body)",
            },
        },
    },
    plugins: [],
};
export default config;
