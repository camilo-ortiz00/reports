const config = {
  important: true,
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
  },
  plugins: [
    require("daisyui"),
    require("flowbite/plugin"),
  ],
  daisyui: {
    themes: ["light"],
  },
  
};

export default config;
