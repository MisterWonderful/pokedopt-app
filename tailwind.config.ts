import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "pd-ink": "#29261b",
        "pd-ink-soft": "#5a4e3a",
        "pd-ink-muted": "#7a6e5a",
        "pd-bg": "#fef9ed",
        "pd-cream": "#fff8ec",
        "pd-paper": "#ffffff",
        "pd-primary": "#c44a2a",
        "pd-primary-soft": "#fff5f1",
        "pd-violet": "#7a4a8a",
        "pd-green": "#3a7a4e",
        "pd-line": "rgba(41, 38, 27, 0.08)",
        "pd-line-strong": "rgba(41, 38, 27, 0.15)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        fraunces: ["Fraunces", "Georgia", "serif"],
        nunito: ["Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
        springwood: ["Springwood Display", "Fraunces", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "pd-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pd-holo": {
          "0%": { backgroundPosition: "120% 0", opacity: "0" },
          "30%": { opacity: "1" },
          "100%": { backgroundPosition: "-20% 0", opacity: "0" },
        },
        "toast-pop": {
          from: { opacity: "0", transform: "translate(-50%, 12px)" },
          to: { opacity: "1", transform: "translate(-50%, 0)" },
        },
        "olive-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        "pd-float": "pd-float 7s ease-in-out infinite",
        "pd-holo": "pd-holo 1.4s ease-in-out",
        "toast-pop": "toast-pop 240ms cubic-bezier(.2,.8,.3,1.4)",
        "olive-bounce": "olive-bounce 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
