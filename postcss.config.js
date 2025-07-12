// postcss.config.js
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {}, // the **only** Tailwind plugin now
    autoprefixer: {}, // still needed for vendor prefixes
  },
};
