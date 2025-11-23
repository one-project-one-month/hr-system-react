import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        bounce: {
          '0%, 80%, 100%': { transform: 'scale(0.8)', opacity: '0.3' },
          '40%': { transform: 'scale(1.2)', opacity: '1' },
        },
      },
      animation: {
        bounceDelay1: 'bounce 1.4s infinite ease-in-out 0s',
        bounceDelay2: 'bounce 1.4s infinite ease-in-out 0.2s',
        bounceDelay3: 'bounce 1.4s infinite ease-in-out 0.4s',
      },
    },
  },
  plugins: [],
};

export default config;
