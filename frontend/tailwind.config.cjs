/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
          /* ── Primary: Deep Navy ── */
          "primary": "#000613",
          "primary-container": "#001f3f",
          "on-primary": "#ffffff",
          "on-primary-container": "#a8c4e6",
          "primary-fixed": "#d5e3ff",
          "primary-fixed-dim": "#b1c7f0",
          "on-primary-fixed": "#001c3b",
          "on-primary-fixed-variant": "#314769",

          /* ── Secondary: Gold Accent ── */
          "secondary": "#C5A059",
          "secondary-container": "#F5ECD7",
          "on-secondary": "#ffffff",
          "on-secondary-container": "#5C4A1E",
          "secondary-fixed": "#F5ECD7",
          "secondary-fixed-dim": "#E0C97A",
          "on-secondary-fixed": "#3D2E0A",
          "on-secondary-fixed-variant": "#6B5623",

          /* ── Tertiary: Warm Muted ── */
          "tertiary": "#111007",
          "tertiary-container": "#26251b",
          "on-tertiary": "#ffffff",
          "on-tertiary-container": "#8f8c7e",
          "tertiary-fixed": "#e7e2d3",
          "tertiary-fixed-dim": "#cbc6b7",
          "on-tertiary-fixed": "#1d1c12",
          "on-tertiary-fixed-variant": "#49473b",

          /* ── Surface Hierarchy (DESIGN §2) ── */
          "surface": "#f8f9fa",
          "surface-dim": "#dbd9dd",
          "surface-bright": "#faf9fc",
          "surface-container-lowest": "#ffffff",
          "surface-container-low": "#f3f4f5",
          "surface-container": "#efedf0",
          "surface-container-high": "#e9e7eb",
          "surface-container-highest": "#e3e2e5",
          "surface-variant": "#e3e2e5",
          "surface-tint": "#001f3f",

          /* ── On Surface ── */
          "on-surface": "#1b1b1e",
          "on-surface-variant": "#44474e",
          "outline": "#74777f",
          "outline-variant": "#c4c6cf",

          /* ── Inverse ── */
          "inverse-surface": "#303033",
          "inverse-on-surface": "#f2f0f3",
          "inverse-primary": "#b1c7f0",

          /* ── Error ── */
          "error": "#ba1a1a",
          "error-container": "#ffdad6",
          "on-error": "#ffffff",
          "on-error-container": "#93000a",

          /* ── Background ── */
          "background": "#f8f9fa",
          "on-background": "#1b1b1e",
      },
      "borderRadius": {
          "sm": "0.25rem",
          "DEFAULT": "0.5rem",
          "md": "0.5rem",
          "lg": "0.75rem",
          "xl": "1rem",
          "2xl": "1.5rem",
          "3xl": "1.75rem",
          "full": "9999px"
      },
      "fontFamily": {
          "headline": ["Noto Serif"],
          "body": ["Manrope"],
          "label": ["Manrope"],
          "serif": ["Noto Serif", "serif"],
          "sans": ["Manrope", "sans-serif"]
      },
      "boxShadow": {
          /* ── Ambient Navy-Tinted Shadows (DESIGN §4) ── */
          "ambient-sm": "0 4px 30px rgba(0, 31, 63, 0.04)",
          "ambient": "0 8px 40px rgba(0, 31, 63, 0.05)",
          "ambient-md": "0 12px 50px rgba(0, 31, 63, 0.06)",
          "ambient-lg": "0 16px 60px rgba(0, 31, 63, 0.08)",
          "ambient-xl": "0 24px 80px rgba(0, 31, 63, 0.10)",
          /* ── Sidebar ── */
          "sidebar": "4px 0 60px rgba(0, 31, 63, 0.08)",
      },
      "backgroundImage": {
          /* ── Signature Gradient (DESIGN §2 Glass) ── */
          "gradient-primary": "linear-gradient(135deg, #000613, #001f3f)",
          "gradient-primary-r": "linear-gradient(to right, #000613, #001f3f)",
          "gradient-primary-b": "linear-gradient(to bottom, #000613, #001f3f)",
          /* ── Radial for Hero backgrounds ── */
          "gradient-primary-radial": "radial-gradient(ellipse at center, #001f3f, #000613)",
          /* ── Gold subtle gradient for accents ── */
          "gradient-gold": "linear-gradient(135deg, #C5A059, #E0C97A)",
      }
    },
  },
  plugins: [],
}
