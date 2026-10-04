// Leadership cards: React 18 + Framer Motion as ES modules from esm.sh (no build step).
// Clicking a playing card morphs it (shared layoutId) into a detail card over the intro text.
import React, { useState, useEffect, useRef, useCallback } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import { createPortal } from "https://esm.sh/react-dom@18.3.1";
import { motion, AnimatePresence, LayoutGroup, MotionConfig, useReducedMotion } from "https://esm.sh/framer-motion@11.11.17?deps=react@18.3.1,react-dom@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
const html = htm.bind(React.createElement);
const EASE = [0.22, 1, 0.36, 1];

const TEAM = [
  { id: "ceo", role: "C.E.O", subtitle: "Sales & Growth", tilt: -3,
    name: "Mr. Sushanta Bhattacharya", title: "Chief Executive Officer",
    bio: "Over 25 years of high-stakes sales and customer-focused leadership — now steering how WebGrow360 grows brands and the businesses behind them.",
    responsibilities: [
      "Sets growth strategy and the commercial direction of every engagement",
      "Leads client partnerships with a customer-first, sales-led approach",
      "Aligns creative, media and technology teams around one measurable result",
      "Makes sure no strategy gets lost between the first brief and the final conversion",
    ],
    chips: ["Sales leadership", "Growth strategy", "Client partnerships", "Customer experience"],
    quote: "Attention is only worth something when it turns into a customer.",
    photo: "assets/team/sushanta-bhattacharya.webp", linkedin: null },
  { id: "cto", role: "C.T.O", subtitle: "AI/ML Architecture", tilt: 3,
    name: "Er. Sayak Roy", title: "Chief Technology Officer",
    bio: "Builds Agentic AI and ML systems, including machine learning work on the FIFA World Cup 2026 road safety network and network automation for the 2024 Asian Games.",
    responsibilities: [
      "Architects the AI/ML systems behind the WebGrow360 growth stack",
      "Marketing automation that captures, scores and nurtures every lead over WhatsApp and email",
      "CRM pipelines on HubSpot, Zoho and custom builds",
      "MCP-connected AI agents that read and act on live Meta Ads and CRM data",
    ],
    chips: ["Agentic AI", "Machine learning", "MCP agents", "HubSpot", "Zoho", "Meta Ads API", "WhatsApp automation"],
    quote: "Automation should give every lead a faster, more human answer — not a slower, more robotic one.",
    photo: "assets/team/sayak-roy.webp", linkedin: "https://www.linkedin.com/in/sayak--roy/" },
];

const LinkedInIcon = () => html`<svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>`;

const spring = { type: "spring", stiffness: 320, damping: 30 };
const morph = { layout: { duration: 0.6, ease: EASE }, rotate: { duration: 0.6, ease: EASE }, default: spring };

function Card({ m, onOpen }) {
  const open = (el) => onOpen(m.id, el);
  return html`<${motion.div} layout layoutId=${"card-" + m.id} data-id=${m.id} className="pc"
    style=${{ borderRadius: 14 }} initial=${false} animate=${{ rotate: m.tilt, opacity: 1 }}
    whileHover=${{ scale: 1.04, y: -4, boxShadow: "0 30px 60px -20px rgba(0,0,0,.55)" }}
    transition=${morph}>
    <button type="button" className="pc-hit" aria-expanded="false" aria-label=${"Open " + m.name + ", " + m.title}
      onClick=${(e) => open(e.currentTarget.parentElement)}></button>
    <img src=${m.photo} alt="" draggable="false" />
    <span className="pc-shade" aria-hidden="true"></span>
    <div className="pc-body">
      <b className="pc-role">${m.role}</b>
      <small className="pc-sub">${m.subtitle}</small>
      <span className="pc-pill" aria-hidden="true">Rotate →</span>
      ${m.linkedin ? html`<a className="pc-pill" href=${m.linkedin} target="_blank" rel="noopener noreferrer"
          aria-label=${m.name + " on LinkedIn"} onClick=${(e) => e.stopPropagation()}><${LinkedInIcon} />LinkedIn</a>` : null}
    </div>
  </${motion.div}>`;
}

const list = { hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.26 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } } };

function Detail({ m, onClose }) {
  const back = useRef(null);
  useEffect(() => { back.current && back.current.focus({ preventScroll: true }); }, []);
  return html`<${motion.article} layoutId=${"card-" + m.id} className="detail" style=${{ borderRadius: 20 }}
    initial=${{ rotate: 0 }} animate=${{ rotate: 0, opacity: 1 }} exit=${{ opacity: 0, transition: { duration: 0.2 } }}
    transition=${morph} onClick=${onClose} aria-label=${m.name + ", " + m.title}>
    <${motion.div} className="detail-in" variants=${list} initial="hidden" animate="show">
      <${motion.div} variants=${item} className="d-head"><img src=${m.photo} alt="" /><span className="d-eyebrow">${m.title}</span></${motion.div}>
      <${motion.h2} variants=${item} className="serif d-name">${m.name}</${motion.h2}>
      <${motion.p} variants=${item} className="d-bio">${m.bio}</${motion.p}>
      <${motion.p} variants=${item} className="d-label">Core responsibilities & capabilities</${motion.p}>
      <${motion.ul} variants=${list} className="d-list">
        ${m.responsibilities.map((r) => html`<${motion.li} key=${r} variants=${item}><span className="tick" aria-hidden="true">✓</span><span>${r}</span></${motion.li}>`)}
      </${motion.ul}>
      ${m.chips && m.chips.length ? html`<${motion.div} variants=${item} className="d-chips">${m.chips.map((c) => html`<span key=${c}>${c}</span>`)}</${motion.div}>` : null}
      ${m.quote ? html`<${motion.blockquote} variants=${item} className="d-quote">“${m.quote}”</${motion.blockquote}>` : null}
      <${motion.div} variants=${item} className="d-foot">
        <span>WEBGROW360.ONLINE</span>
        <button ref=${back} type="button" onClick=${(e) => { e.stopPropagation(); onClose(); }}>Click to flip back ↺</button>
      </${motion.div}>
    </${motion.div}>
  </${motion.article}>`;
}

function Leadership({ detailSlot, intro, left }) {
  const [active, setActive] = useState(null);
  const [ghost, setGhost] = useState(null);
  const lastId = useRef(null);
  const reduce = useReducedMotion();

  const open = useCallback((id, el) => {
    lastId.current = id;
    if (!reduce && el) {
      const a = el.getBoundingClientRect(), b = left.getBoundingClientRect();
      setGhost({ k: Date.now(), photo: TEAM.find((t) => t.id === id).photo, a, b });
    }
    setActive(id);
    if (window.innerWidth < 1024) {
      const top = left.getBoundingClientRect().top + window.scrollY - 100;
      if (Math.abs(window.scrollY - top) > 40) window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    }
  }, [reduce, left]);

  const close = useCallback(() => {
    setActive(null);
    setTimeout(() => { const c = document.querySelector('.pc[data-id="' + lastId.current + '"] .pc-hit'); c && c.focus({ preventScroll: true }); }, 80);
  }, []);

  useEffect(() => {
    intro.classList.toggle("is-hidden", !!active);
    intro.setAttribute("aria-hidden", active ? "true" : "false");
    if (!active) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [active, close, intro]);

  const m = TEAM.find((t) => t.id === active);
  return html`<${MotionConfig} reducedMotion="user">
    <${LayoutGroup}>
      ${TEAM.filter((t) => t.id !== active).map((t) => html`<${Card} key=${t.id} m=${t} onOpen=${open} />`)}
      ${createPortal(html`<${AnimatePresence}>${m ? html`<${Detail} key=${m.id} m=${m} onClose=${close} />` : null}</${AnimatePresence}>`, detailSlot)}
    </${LayoutGroup}>
    ${ghost ? html`<${motion.div} key=${ghost.k} className="ghost" aria-hidden="true"
        style=${{ backgroundImage: "url(" + ghost.photo + ")" }}
        initial=${{ left: ghost.a.left, top: ghost.a.top, width: ghost.a.width, height: ghost.a.height, opacity: 0.4 }}
        animate=${{ left: ghost.b.left, top: ghost.b.top, width: ghost.b.width, height: ghost.b.height, opacity: 0 }}
        transition=${{ duration: 0.7, ease: EASE, delay: 0.05 }}
        onAnimationComplete=${() => setGhost(null)} />` : null}
  </${MotionConfig}>`;
}

const panel = document.getElementById("lead-panel");
const slot = document.getElementById("lead-detail");
const intro = document.getElementById("lead-intro");
const left = document.getElementById("lead-left");
if (panel && slot && intro && left) {
  panel.innerHTML = "";
  createRoot(panel).render(html`<${Leadership} detailSlot=${slot} intro=${intro} left=${left} />`);
}
