# WebGrow360 — Website

A static, two-page marketing site for **WebGrow360** (Branding · Advertising · Marketing). No build step — plain HTML + Tailwind (CDN) + GSAP/Lenis (CDN).

## Pages
- `index.html` — landing page (hero, services, reels, industry portfolio with rotate/stack scroll, analytics, clients, testimonials, process, tech stack, solutions, CTA). Includes **Soul Mode** (☯) — a full-screen "Narrative Canvas" experience.
- `about.html` — About: Our Story (map of India + Agartala pin, scroll timeline), Mission, Core Values bento, Why WebGrow360, stats tickers, Leadership cards, closing CTA. Includes Organization JSON-LD.
  - Behaviour lives in `components/about/` (`about.js` — plain JS effects; `leadership.js` — React + Framer Motion from esm.sh). Team data is the `TEAM` array in `leadership.js`.
  - Unlike the other pages, it uses pre-built Tailwind CSS (`assets/css/about.css`) instead of the Tailwind CDN, for speed. After changing classes in `about.html` or `components/about/`, rebuild with:
    `npx tailwindcss@3.4.17 -c tailwind.config.js -i assets/css/tailwind.in.css -o assets/css/about.css --minify`
  - The map is generated from Datameet's open India state boundaries (official boundaries).
- `contact.html` — Contact page with the enquiry form (name, email, phone, service, message). It's a Netlify Form: submissions appear in the Netlify dashboard under Forms (turn on email notifications there). Service pages link to it with the service pre-selected, e.g. `contact.html?service=reels`.
- Service pages, linked from the four "What we do" cards on the home page:
  `brand-identity.html`, `reels.html`, `campaign-design.html`, `performance-marketing.html`.
  Each has a hero, deliverables, image grid, process, "built for", FAQ, next-service link and CTA.

## Assets
- `assets/webgrow360-mark.webp` — WebGrow360 brand mark (same as realestate.webgrow360.online); also the favicon. The "WEBGROW360 / ONLINE" wordmark is live text, so it adapts to light and soul mode.

- `assets/services/` — service page images (`<page>-1.webp` hero, `-2`/`-3` grid). Stock photos from Unsplash (free to use under the Unsplash License); swap any file for a generated image by keeping the same name.

## Run locally
Open `index.html` in a browser, or serve the folder:
```bash
python3 -m http.server 3000
# http://localhost:3000
```

## Deploy to Netlify
This folder is the deploy root (`publish = "."` in `netlify.toml`). Two options:

**Drag & drop:** zip the site (or use the provided `webgrow360_site.zip`) and drop it on https://app.netlify.com/drop

**Git / CLI:**
```bash
netlify deploy --prod        # from this folder, after `netlify link`
```
No build command is required.

## Contact
Connect@team.webgrow360.online · +91 89743 32863
