import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                background: '#ffffff',
                foreground: '#171717',
            },
            fontFamily: {
                sans: ['Arial', 'Helvetica', 'sans-serif'],
            },
        },
    },
    darkMode: false,
    plugins: [],
};

export default config;