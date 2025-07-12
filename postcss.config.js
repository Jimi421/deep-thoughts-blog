// postcss.config.js
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {}, // ← the NEW PostCSS plugin
    autoprefixer: {}, // ← vendor‐prefixing
  },
};
