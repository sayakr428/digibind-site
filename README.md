# WebGrow360 — Website

A static, two-page marketing site for **WebGrow360** (Branding · Advertising · Marketing). No build step — plain HTML + Tailwind (CDN) + GSAP/Lenis (CDN).

## Pages
- `index.html` — landing page (hero, services, reels, industry portfolio with rotate/stack scroll, analytics, clients, testimonials, process, tech stack, solutions, CTA). Includes **Soul Mode** (☯) — a full-screen "Narrative Canvas" experience.
- `about.html` — About Us page (empty for now; header, menu and footer only).

## Assets
- `assets/webgrow360-mark.webp` — WebGrow360 brand mark (same as realestate.webgrow360.online); also the favicon. The "WEBGROW360 / ONLINE" wordmark is live text, so it adapts to light and soul mode.

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
