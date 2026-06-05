# DigiBind Media — Website

A static, two-page marketing site for **DigiBind Media** (Branding · Advertising · Marketing). No build step — plain HTML + Tailwind (CDN) + GSAP/Lenis (CDN).

## Pages
- `index.html` — landing page (hero, services, reels, industry portfolio with rotate/stack scroll, analytics, clients, testimonials, process, tech stack, solutions, CTA). Includes **Soul Mode** (☯) — a full-screen "Narrative Canvas" experience.
- `pricing.html` — plans (Ignite / Amplify / Dominate), Signature on-site production, transparency policy, and a live **cost calculator**.

## Assets
- `assets/logo.png` — transparent logo (light theme)
- `assets/logo_dark.png` — logo variant for dark / soul mode

## Run locally
Open `index.html` in a browser, or serve the folder:
```bash
python3 -m http.server 3000
# http://localhost:3000
```

## Deploy to Netlify
This folder is the deploy root (`publish = "."` in `netlify.toml`). Two options:

**Drag & drop:** zip the site (or use the provided `digibindmedia_site.zip`) and drop it on https://app.netlify.com/drop

**Git / CLI:**
```bash
netlify deploy --prod        # from this folder, after `netlify link`
```
No build command is required.

## Contact
contact@digibindmedia.com · +91 63535 28739
