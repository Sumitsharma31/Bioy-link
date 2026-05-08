import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#131313',
        surface: '#131313',
        'surface-container-low': '#1c1b1b',
        'surface-container': '#201f1f',
        'surface-container-high': '#2a2a2a',
        'surface-variant': '#353534',
        primary: '#f6ffb1',
        'primary-container': '#d2e823',
        'on-primary': '#2e3400',
        'on-primary-container': '#5b6600',
        'on-surface': '#e5e2e1',
        'on-surface-variant': '#c7c8ad',
        'outline-variant': '#464833',
        error: '#ffb4ab',
        'error-container': '#93000a',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '40px',
        margin: '20px',
      },
    },
  },
  plugins: [],
}
export default config
