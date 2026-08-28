/** @type {import('tailwindcss').Config} */
// Tailwind v3 config format (NOT v4). See design.md §1 & §10.
// Palette + 24px corner-radius conventions are the single source of truth for UI surfaces.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Jungle / Mandai palette — apply throughout, per design.md §10.
        jungle: {
          DEFAULT: '#0f3d2e', // deep canopy green (primary surfaces)
          dark: '#082018',
          light: '#1b5c46',
        },
        leaf: {
          DEFAULT: '#3fae6b', // navigation path / success accents
          light: '#6fd79a',
          dark: '#2b7d4b',
        },
        // Danger Heat Zone color for crowd overlay (Requirement 3.2).
        heat: {
          DEFAULT: '#e2413b',
          glow: '#ff6b63',
        },
        amber: {
          DEFAULT: '#f4b740', // XP / rank accents
        },
        bark: '#2c2119',
        mist: '#f5f7f4', // light text / high-contrast surfaces
      },
      borderRadius: {
        // 24px corner-radius rule (design.md §10) — every card/surface uses this.
        card: '24px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.25)',
      },
      backdropBlur: {
        glass: '12px',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%': { transform: 'scale(1.3)', opacity: '0' },
          '100%': { transform: 'scale(1.3)', opacity: '0' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
