/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          ink: '#061017',
          panel: '#0b1820',
          panel2: '#10242d',
          line: '#1c3a43',
          cyan: '#23d7ff',
          green: '#54f28b',
          red: '#ff5c72',
          amber: '#f7c948',
        },
      },
      boxShadow: {
        glow: '0 0 28px rgba(35, 215, 255, 0.16)',
        success: '0 0 28px rgba(84, 242, 139, 0.18)',
        danger: '0 0 28px rgba(255, 92, 114, 0.16)',
      },
      animation: {
        pulseGlow: 'pulseGlow 2.8s ease-in-out infinite',
        scan: 'scan 4s linear infinite',
        rise: 'rise 0.28s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(35, 215, 255, 0)' },
          '50%': { boxShadow: '0 0 28px rgba(35, 215, 255, 0.18)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(420%)' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
