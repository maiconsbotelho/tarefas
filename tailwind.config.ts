import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#0f0f0f',
        secondary: '#f1f1f1',
        accent: '#e23140',
      },

      width: {
        '480': '480px',
        '8/10': '80%',
      },

      maxWidth: {
        '480': '480px',
        '8/10': '80%',
      },

      height: {
        'custom-calc': 'calc(100vh - 80px)',
      },

      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};

export default config;
