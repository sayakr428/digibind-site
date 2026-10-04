// Used only to pre-build the About page CSS (assets/css/about.css). Other pages still use the Tailwind CDN.
// Rebuild after changing classes in about.html or components/about/*.js:
//   npx tailwindcss@3.4.17 -c tailwind.config.js -i assets/css/tailwind.in.css -o assets/css/about.css --minify
module.exports = {
  content: ["./about.html", "./components/about/**/*.js"],
  theme: { extend: { fontFamily: {
    display: ["Space Grotesk", "sans-serif"], body: ["Inter", "sans-serif"], serif: ["Cormorant Garamond", "serif"], mono: ["JetBrains Mono", "monospace"],
  } } },
};
