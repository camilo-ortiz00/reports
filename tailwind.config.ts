const config = {
  important: true,
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    // Tu configuración personalizada de Tailwind
  },
  plugins: [
    require("flowbite/plugin"), // DaisyUI debe ser después si lo incluyes
    require("daisyui"),
  ],
  daisyui: {
    themes: [], // Esto debería desactivar los temas de DaisyUI
  },
};

export default config;
