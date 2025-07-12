// tailwind.config.js
module.exports = {
  // where Tailwind looks for your classes
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/components/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/lib/posts.ts",
  ],
  darkMode: "class", // your choice: 'media' or 'class'
  theme: {
    extend: {},
  },
  plugins: [],
};
