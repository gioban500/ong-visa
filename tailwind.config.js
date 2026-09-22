/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-fraunces)", "Fraunces", "Georgia", "serif"],
        sans: ["var(--font-work-sans)", "Work Sans", "Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        bg: {
          DEFAULT: "#FAF6F0",
          subtle: "#F5EFE6",
          raised: "#EFE6D8",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dim: "#dddad4",
          bright: "#fdf9f3",
          container: "#f1ede7",
        },
        ink: {
          DEFAULT: "#2A2521",
          secondary: "#514A43",
          soft: "#756B60",
          faint: "#A3978A",
        },
        line: {
          DEFAULT: "#E2D7C7",
          strong: "#CFC1AD",
        },
        teal: {
          DEFAULT: "#1F5A56",
          deep: "#123E3B",
          light: "#EBF3F1",
          accent: "#2A736E",
        },
        clay: {
          DEFAULT: "#9E2F55",
          deep: "#7A2143",
          soft: "#F9EBF0",
          border: "#E8C1CF",
        },
        gold: {
          DEFAULT: "#C49A45",
          soft: "#FCF7E9",
        },
        cancer: {
          breast: "#EC4899",
          prostate: "#3B82F6",
          lung: "#6B7280",
          colorectal: "#92400E",
          cervical: "#7C3AED",
          pancreatic: "#EA580C",
        },
      },
      maxWidth: {
        container: "1180px",
        content: "1120px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

