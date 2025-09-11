import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}','./components/**/*.{ts,tsx}','./app/**/*.{ts,tsx}','./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '2rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        // Genesis tokens
        earth: { obsidian: '#0b0f14', midnight: '#101828', forest: '#003B2D' },
        acc: { emerald: '#00D084', cyan: '#28F2E4', gold: '#f5c84b' },
        hi: { violet: '#8E6CFF', coral: '#FF6C8E' },
        txt: { snow: '#E9F4FF', ash: '#A3AAB8' }
      },
      borderRadius: { xl: 'var(--radius-xl)', lg: 'var(--radius-lg)', md: 'var(--radius-md)', sm: 'var(--radius-sm)' },
      boxShadow: {
        'gen-emerald': '0 0 0 1px rgba(0,208,132,.15),0 0 24px rgba(0,208,132,.10)',
        'gen-violet': '0 0 0 1px rgba(142,108,255,.15),0 0 24px rgba(142,108,255,.10)'
      },
      backgroundImage: {
        'gen-radial': 'radial-gradient(1200px 800px at 20% 10%, rgba(40,242,228,0.06), transparent), radial-gradient(1000px 600px at 80% 100%, rgba(0,208,132,0.05), transparent), linear-gradient(#0b0f14,#101828)'
      },
      keyframes: {
        'gen-parallax': { from: { transform: 'translate3d(0,0,0)' }, to: { transform: 'translate3d(0,-2%,0)' } },
        'gen-ringPulse': { '0%,100%': { boxShadow: 'var(--shadow-mythic)' }, '50%': { boxShadow: 'var(--shadow-violet)' } },
        'gen-scrollUnfurl': { '0%': { transform: 'scaleY(.98)', opacity: '0' }, '100%': { transform: 'scaleY(1)', opacity: '1' } },
        'gen-recursiveZoom': { '0%': { transform: 'scale(.985)', filter: 'blur(.5px)' }, '100%': { transform: 'scale(1)', filter: 'blur(0)' } }
      },
      animation: {
        'gen-parallax': 'gen-parallax 30s linear infinite',
        'gen-ring': 'gen-ringPulse 6s cubic-bezier(0.4,0,0.2,1) infinite',
        'gen-unfurl': 'gen-scrollUnfurl .5s cubic-bezier(0.4,0,0.2,1) both',
        'gen-zoom': 'gen-recursiveZoom .35s cubic-bezier(0.4,0,0.2,1) both'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
} satisfies Config

export default config
