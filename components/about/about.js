// About page interactions — plain ES module, no build step.
// Patterns adapted from 21st.dev components and restyled for WebGrow360:
//   - GlowingEffect (manuarora700 / Aceternity): border glow that follows the pointer's angle
//   - NumberTicker (dillionverma / Magic UI): count up once the number scrolls into view
//   - Scroll word reveal (motiondotdev), timeline scroll beam (manuarora700), magnetic button (bundui)
// Every effect is skipped or reduced to a plain state under prefers-reduced-motion.

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 4); // close to cubic-bezier(.22,1,.36,1)

/* One rAF-throttled scroll loop shared by every scroll-linked effect. */
const scrollJobs = new Set();
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { ticking = false; scrollJobs.forEach((fn) => fn()); });
}
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll, { passive: true });

/* Run `init` the first time `el` comes near the viewport (lazy-loads the heavier effects). */
function whenNear(el, init, margin = "200px") {
  if (!("IntersectionObserver" in window)) return init();
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); init(); }
  }, { rootMargin: margin });
  io.observe(el);
}

/* Add .is-in once an element is properly on screen (map lines, mission markers, tickers). */
function inView(el, cb, threshold = 0.35) {
  if (reduce || !("IntersectionObserver" in window)) { el.classList.add("is-in"); cb && cb(); return; }
  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { io.disconnect(); el.classList.add("is-in"); cb && cb(); }
  }, { threshold });
  io.observe(el);
}

/* ---------- 1. Our Story: words light up as the paragraphs scroll past ---------- */
// The paragraphs are the page's largest paint, so they are only split into words once the visitor
// starts scrolling — re-rendering them on load would delay Largest Contentful Paint.
document.querySelectorAll("[data-words]").forEach((box) => {
  const start = () => setupWords(box);
  if (reduce) return start();
  if (window.scrollY > 0) return start();
  addEventListener("scroll", start, { once: true, passive: true });
});
function setupWords(box) {
  if (box.dataset.ready) return;
  box.dataset.ready = "1";
  const words = [];
  box.querySelectorAll("p").forEach((p) => {
    const parts = p.textContent.trim().split(/(\s+)/);
    p.textContent = "";
    parts.forEach((part) => {
      if (/^\s+$/.test(part)) { p.append(part); return; }
      const w = document.createElement("span");
      w.className = "w"; w.textContent = part; p.append(w); words.push(w);
    });
  });
  if (reduce) { words.forEach((w) => w.classList.add("on")); return; }
  let lit = -1;
  const job = () => {
    const r = box.getBoundingClientRect(), vh = innerHeight;
    const p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.2));
    const n = Math.round(p * words.length);
    if (n === lit) return;
    words.forEach((w, i) => w.classList.toggle("on", i < n));
    lit = n;
  };
  whenNear(box, () => { scrollJobs.add(job); job(); }, "400px");
}

/* ---------- 2. Timeline: the rail fills and milestones light up with scroll ---------- */
document.querySelectorAll("[data-timeline]").forEach((tl) => {
  const nodes = [...tl.querySelectorAll(".tl-step")];
  if (reduce) { tl.style.setProperty("--p", 1); nodes.forEach((n) => n.classList.add("on")); return; }
  const job = () => {
    const r = tl.getBoundingClientRect(), vh = innerHeight;
    const p = clamp((vh * 0.85 - r.top) / (vh * 0.55 + r.height * 0.6));
    tl.style.setProperty("--p", p.toFixed(3));
    nodes.forEach((n, i) => n.classList.toggle("on", p >= i / (nodes.length - 1) - 0.02));
  };
  whenNear(tl, () => { scrollJobs.add(job); job(); });
});

/* ---------- 3. Map + mission markers: draw/underline once in view ---------- */
document.querySelectorAll("[data-inview]").forEach((el) => inView(el, null, Number(el.dataset.inview) || 0.35));

/* ---------- 4. Core values: spotlight that follows the cursor ---------- */
if (finePointer && !reduce) {
  document.querySelectorAll("[data-spotlight]").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

/* ---------- 5. Why us: glowing border that tracks the pointer's angle (GlowingEffect) ---------- */
const glowCards = [...document.querySelectorAll("[data-glow]")];
if (finePointer && !reduce && glowCards.length) {
  const PROXIMITY = 64;
  let px = -9999, py = -9999;
  const update = () => {
    glowCards.forEach((card) => {
      const r = card.getBoundingClientRect();
      const active = px > r.left - PROXIMITY && px < r.right + PROXIMITY && py > r.top - PROXIMITY && py < r.bottom + PROXIMITY;
      card.style.setProperty("--active", active ? "1" : "0");
      if (!active) return;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const target = (Math.atan2(py - cy, px - cx) * 180) / Math.PI + 90;
      const cur = parseFloat(card.style.getPropertyValue("--start")) || 0;
      const diff = ((((target - cur) % 360) + 540) % 360) - 180; // shortest way round
      card.style.setProperty("--start", (cur + diff * 0.18).toFixed(2));
    });
  };
  let raf = 0;
  const loop = () => { update(); raf = requestAnimationFrame(loop); };
  const section = glowCards[0].closest("section");
  document.addEventListener("pointermove", (e) => { px = e.clientX; py = e.clientY; }, { passive: true });
  // only animate while the section is on screen
  new IntersectionObserver((en) => {
    if (en[0].isIntersecting) { if (!raf) loop(); }
    else { cancelAnimationFrame(raf); raf = 0; }
  }).observe(section);
}

/* ---------- 6. Stats: number tickers (NumberTicker) ---------- */
document.querySelectorAll("[data-count-to]").forEach((el, i) => {
  const to = Number(el.dataset.countTo), from = Number(el.dataset.from || 0);
  const fmt = (v) => String(Math.round(v)); // "2019" must not get a thousands separator
  if (reduce) { el.textContent = fmt(to); return; }
  el.textContent = fmt(from);
  inView(el, () => {
    const dur = 1600, t0 = performance.now() + i * 90;
    const step = (now) => {
      const t = clamp((now - t0) / dur);
      el.textContent = fmt(from + (to - from) * easeOut(t));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, 0.6);
});

/* ---------- 7. Closing CTA: magnetic button ---------- */
if (finePointer && !reduce) {
  document.querySelectorAll("[data-magnetic]").forEach((btn) => {
    const inner = btn.querySelector(".mag-in");
    const strength = 0.32, reach = 40;
    btn.parentElement.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const near = Math.abs(dx) < r.width / 2 + reach && Math.abs(dy) < r.height / 2 + reach;
      btn.style.transform = near ? `translate(${dx * strength}px, ${dy * strength}px)` : "";
      if (inner) inner.style.transform = near ? `translate(${dx * strength * 0.4}px, ${dy * strength * 0.4}px)` : "";
    });
    btn.parentElement.addEventListener("pointerleave", () => {
      btn.style.transform = ""; if (inner) inner.style.transform = "";
    });
  });
}
