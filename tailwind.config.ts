import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#FFFFFF',
                'background-alt': '#F9FAFB',
                border: '#E5E7EB',
                'text-primary': '#111827',
                'text-secondary': '#6B7280',
                accent: '#3B82F6', // 落ち着いたブルー
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
        },
    },
    plugins: [],
};

export default config;
