import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        
        // Component colors
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        
        // Mythic Tech Theme Colors - Genesis Reloop
        'mythic-primary': {
          50: '#e6fff5',
          100: '#ccffeb',
          200: '#99ffd6',
          300: '#66ffc2',
          400: '#33f5ad',
          500: '#00C08B', // Main primary
          600: '#00a676',
          700: '#008c62',
          800: '#00734d',
          900: '#005938',
        },
        'mythic-secondary': {
          50: '#e8f2f0',
          100: '#d1e5e1',
          200: '#a3cbc3',
          300: '#74b1a5',
          400: '#469787',
          500: '#1a7d69',
          600: '#14634b',
          700: '#0f4a39',
          800: '#0a3127',
          900: '#0B1E1A', // Main secondary (dark)
        },
        'mythic-accent': {
          50: '#f0fef9',
          100: '#d9fef0',
          200: '#b3fce2',
          300: '#7EF5CF', // Main accent
          400: '#4aecb8',
          500: '#21d99e',
          600: '#16b07f',
          700: '#158967',
          800: '#166b53',
          900: '#155846',
        },
        'mythic-dark': {
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#cccccc',
          300: '#b3b3b3',
          400: '#999999',
          500: '#666666',
          600: '#4d4d4d',
          700: '#333333',
          800: '#1a1a1a',
          900: '#0B1E1A', // Secondary color for dark backgrounds
          950: '#050F0D',
        },
        'mythic-loop-srl': '#00C08B', // Stabilized Recursive Loop
        'mythic-loop-crl': '#ff0044', // Corrupted Recursive Loop
        'mythic-flow-feedstock': '#0080ff',
        'mythic-flow-byproduct': '#ff6600',
        'mythic-flow-credits': '#ffcc00',
        'mythic-flow-reputation': '#cc00ff',
        'mythic-text': {
          primary: '#E8FFF7',
          muted: '#A7D9C9',
        },
        mythic: {
          // Deep Emerald Greens (SRL/Success)
          emerald: {
            50: '#e6fffa',
            100: '#b3ffe6',
            200: '#66ffd1',
            300: '#00ffb3',
            400: '#00e699',
            500: '#00cc88', // Main SRL green - luminous
            600: '#00b377',
            700: '#009966',
            800: '#008055',
            900: '#006644',
            950: '#003322',
          },
          // Luminous Teal
          teal: {
            50: '#e6ffff',
            100: '#b3ffff',
            200: '#66ffff',
            300: '#00ffff',
            400: '#00e6e6',
            500: '#00cccc', // Main teal
            600: '#00b3b3',
            700: '#009999',
            800: '#008080',
            900: '#006666',
            950: '#003333',
          },
          // Cyber Gold Highlights
          gold: {
            50: '#fffbe6',
            100: '#fff4b3',
            200: '#ffe866',
            300: '#ffd700',
            400: '#e6c200',
            500: '#ccaa00', // Main cyber-gold
            600: '#b39600',
            700: '#998200',
            800: '#806d00',
            900: '#665700',
            950: '#332b00',
          },
          // Matte Black Backgrounds
          black: {
            50: '#1a1a1a',
            100: '#0d0d0d',
            200: '#0a0a0a',
            300: '#080808',
            400: '#050505',
            500: '#030303',
            600: '#020202',
            700: '#010101',
            800: '#000000',
            900: '#000000',
            950: '#000000', // Pure matte black
          },
          // Data Flow Colors
          flow: {
            feedstock: '#0080ff', // Neon blue
            byproduct: '#ff6600', // Neon orange
            credits: '#ffcc00', // Neon yellow
            reputation: '#cc00ff', // Neon purple
          },
          // Loop Status Colors
          loop: {
            srl: '#00ff88', // Luminous green
            crl: '#ff0044', // Glowing red
            unknown: '#666666', // Dark gray
          },
          // Status Indicators
          status: {
            live: '#00ff88',
            planned: '#ff6600',
            active: '#0080ff',
            warning: '#ffaa00',
            error: '#ff0044',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'flow': 'flow 3s ease-in-out infinite',
        'rotate-slow': 'rotate 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(34, 197, 94, 0.5), 0 0 20px rgba(34, 197, 94, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.4)' },
        },
        flow: {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '-100' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'grid-pattern': 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mythic': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
