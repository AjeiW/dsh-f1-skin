// dsh-f1-skin — theme data: the 79 overridable tokens, the per-team
// palettes, the F1 CSS, and the token generator. This file is an ES module
// consumed by scripts/build.mjs and scripts/check.mjs; the build inlines it
// (data + function sources) into lib/client.js.

/** Every alias-layer token the skin overrides (78 from design-platform.css + sidebar fill). */
export const ALL_TOKENS = [
  "--dsw-alias-bg-base",
  "--dsw-alias-bg-layer-1",
  "--dsw-alias-bg-layer-2",
  "--dsw-alias-bg-layer-3",
  "--dsw-alias-bg-mask-1",
  "--dsw-alias-bg-mask-2",
  "--dsw-alias-bg-mask-3",
  "--dsw-alias-bg-mask-drop",
  "--dsw-alias-bg-mask-photo",
  "--dsw-alias-bg-module-platform",
  "--dsw-alias-bg-multi-select",
  "--dsw-alias-bg-overlay",
  "--dsw-alias-bg-skeleton",
  "--dsw-alias-border-inverted",
  "--dsw-alias-border-inverted2",
  "--dsw-alias-border-l1",
  "--dsw-alias-border-l2",
  "--dsw-alias-border-l2-darkmode-thin",
  "--dsw-alias-border-l3",
  "--dsw-alias-border-l4",
  "--dsw-alias-brand-primary",
  "--dsw-alias-brand-primary-invert",
  "--dsw-alias-brand-primary-new-colorprimary-new-color",
  "--dsw-alias-brand-text",
  "--dsw-alias-button-contrast-fill",
  "--dsw-alias-button-elevated-fill",
  "--dsw-alias-button-floating-fill",
  "--dsw-alias-button-floating-hover",
  "--dsw-alias-button-ghost-active-border",
  "--dsw-alias-button-ghost-active-fill",
  "--dsw-alias-button-ghost-active-hover",
  "--dsw-alias-button-info-fill",
  "--dsw-alias-button-info-hover",
  "--dsw-alias-button-primary-dimmed",
  "--dsw-alias-button-primary-fill",
  "--dsw-alias-button-primary-hover",
  "--dsw-alias-button-tool-bar-fill",
  "--dsw-alias-button-tool-bar-fill-invisible",
  "--dsw-alias-button-tool-bar-hover",
  "--dsw-alias-interactive-bg-active",
  "--dsw-alias-interactive-bg-hover",
  "--dsw-alias-interactive-bg-hover-accent",
  "--dsw-alias-interactive-bg-hover-danger",
  "--dsw-alias-interactive-bg-hover-solid",
  "--dsw-alias-label-caption",
  "--dsw-alias-label-dimmed",
  "--dsw-alias-label-primary",
  "--dsw-alias-label-primary-bluish",
  "--dsw-alias-label-primary-dimmed",
  "--dsw-alias-label-primary-foreground",
  "--dsw-alias-label-primary-inverted",
  "--dsw-alias-label-secondary",
  "--dsw-alias-label-tertiary",
  "--dsw-alias-markdown-citation",
  "--dsw-alias-markdown-code-block",
  "--dsw-alias-markdown-code-block-banner",
  "--dsw-alias-markdown-code-segment-selected",
  "--dsw-alias-markdown-code-segment-unselected",
  "--dsw-alias-markdown-inline-code",
  "--dsw-alias-markdown-placeholder",
  "--dsw-alias-markdown-tag",
  "--dsw-alias-scrollbar-bg-l1",
  "--dsw-alias-scrollbar-bg-l2",
  "--dsw-alias-scrollbar-hover-l1",
  "--dsw-alias-scrollbar-hover-l2",
  "--dsw-alias-state-business-primary",
  "--dsw-alias-state-business-tertiary",
  "--dsw-alias-state-error-primary",
  "--dsw-alias-state-error-secondary",
  "--dsw-alias-state-success-primary",
  "--dsw-alias-state-success-secondary",
  "--dsw-alias-state-success-tertiary",
  "--dsw-alias-state-warn-label",
  "--dsw-alias-state-warn-primary",
  "--dsw-alias-state-warn-secondary",
  "--dsw-alias-state-warn-tertiary",
  "--dsw-alias-toast-bg",
  "--dsw-alias-tooltip-bg",
  "--dsw-specific-sidebar-fill"
];

/** Color helpers: hex (#RGB/#RRGGBB) in, hex (#RRGGBB / #RRGGBBAA) out. */
export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full.slice(0, 6), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }) {
  const c = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** Blend a toward b by t (0..1). */
export function mix(a, b, t) {
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  return rgbToHex({ r: x.r + (y.r - x.r) * t, g: x.g + (y.g - x.g) * t, b: x.b + (y.b - x.b) * t });
}

/** Lighten hex toward white by t. */
export function lighten(hex, t) { return mix(hex, "#FFFFFF", t); }
/** Darken hex toward black by t. */
export function darken(hex, t) { return mix(hex, "#000000", t); }
/** Add alpha (0..1) to a hex color → #RRGGBBAA. */
export function alpha(hex, a) {
  const { r, g, b } = hexToRgb(hex);
  const aa = Math.max(0, Math.min(255, Math.round(a * 255))).toString(16).padStart(2, "0");
  return `#${hex.replace("#", "").length === 6 ? hex.slice(1) : hex.slice(1, 7)}${aa}`;
}

/** Derive the full per-mode palette from a team's three seed colors. */
export function buildPalette({ base, brand, biz }, mode) {
  const lift = mode === "dark" ? lighten : darken; // surfaces step away from the base
  return {
    base,
    layer1: mode === "dark" ? lighten(base, 0.06) : mix(base, "#FFFFFF", 0.55),
    layer2: mode === "dark" ? lighten(base, 0.12) : mix(base, "#FFFFFF", 0.2),
    layer3: mode === "dark" ? lighten(base, 0.18) : mix(base, "#000000", 0.1),
    platform: mode === "dark" ? lighten(base, 0.09) : "#FFFFFF",
    overlay: mode === "dark" ? lighten(base, 0.16) : "#FFFFFF",
    skeleton: mode === "dark" ? lighten(base, 0.1) : mix(base, "#000000", 0.08),
    border1: mode === "dark" ? lighten(base, 0.14) : mix(base, "#000000", 0.14),
    border2: mode === "dark" ? lighten(base, 0.22) : mix(base, "#000000", 0.22),
    border3: mode === "dark" ? lighten(base, 0.3) : mix(base, "#000000", 0.3),
    border4: mode === "dark" ? lighten(base, 0.4) : mix(base, "#000000", 0.4),
    text: mode === "dark" ? "#F2F3F5" : "#17171C",
    text2: mode === "dark" ? "#B8BAC2" : "#4A4A52",
    text3: mode === "dark" ? "#7A7C86" : "#8A8C94",
    textDim: mode === "dark" ? "#565860" : "#A0A2AA",
    textInv: mode === "dark" ? "#0B0B10" : "#FFFFFF",
    brand,
    brandHi: mode === "dark" ? lighten(brand, 0.14) : darken(brand, 0.1),
    biz,
    bizHi: mode === "dark" ? lighten(biz, 0.12) : darken(biz, 0.1),
    success: mode === "dark" ? "#00E701" : "#00A844",
    warn: mode === "dark" ? "#FFD400" : "#B8860B",
    error: mode === "dark" ? "#FF2E2E" : "#D90F0F"
  };
}

/** Token → palette key, or a function (palette) → CSS color value. */
export const TOKEN_MAP = {
  "--dsw-alias-bg-base": (c) => alpha(c.base, 0.55),
  "--dsw-alias-bg-layer-1": "layer1",
  "--dsw-alias-bg-layer-2": "layer2",
  "--dsw-alias-bg-layer-3": "layer3",
  "--dsw-alias-bg-mask-1": () => "rgba(0, 0, 0, 0.24)",
  "--dsw-alias-bg-mask-2": () => "rgba(0, 0, 0, 0.4)",
  "--dsw-alias-bg-mask-3": () => "rgba(0, 0, 0, 0.56)",
  "--dsw-alias-bg-mask-drop": () => "rgba(0, 0, 0, 0.5)",
  "--dsw-alias-bg-mask-photo": () => "rgba(0, 0, 0, 0.32)",
  "--dsw-alias-bg-module-platform": "platform",
  "--dsw-alias-bg-multi-select": (c) => alpha(c.brand, 0.12),
  "--dsw-alias-bg-overlay": "overlay",
  "--dsw-alias-bg-skeleton": "skeleton",
  "--dsw-alias-border-inverted": (c) => alpha(c.textInv, 0.9),
  "--dsw-alias-border-inverted2": (c) => alpha(c.textInv, 0.55),
  "--dsw-alias-border-l1": "border1",
  "--dsw-alias-border-l2": "border2",
  "--dsw-alias-border-l2-darkmode-thin": (c) => alpha(c.border2, 0.6),
  "--dsw-alias-border-l3": "border3",
  "--dsw-alias-border-l4": "border4",
  "--dsw-alias-brand-primary": "brand",
  "--dsw-alias-brand-primary-invert": (c) => c.onBrand ?? c.textInv,
  "--dsw-alias-brand-primary-new-colorprimary-new-color": "brand",
  "--dsw-alias-brand-text": "brand",
  "--dsw-alias-button-contrast-fill": "text",
  "--dsw-alias-button-elevated-fill": "layer2",
  "--dsw-alias-button-floating-fill": (c) => alpha(c.overlay, 0.92),
  "--dsw-alias-button-floating-hover": "layer2",
  "--dsw-alias-button-ghost-active-border": (c) => alpha(c.brand, 0.5),
  "--dsw-alias-button-ghost-active-fill": (c) => alpha(c.brand, 0.12),
  "--dsw-alias-button-ghost-active-hover": (c) => alpha(c.brand, 0.18),
  "--dsw-alias-button-info-fill": "biz",
  "--dsw-alias-button-info-hover": "bizHi",
  "--dsw-alias-button-primary-dimmed": (c) => mix(c.brand, c.layer1, 0.55),
  "--dsw-alias-button-primary-fill": "brand",
  "--dsw-alias-button-primary-hover": "brandHi",
  "--dsw-alias-button-tool-bar-fill": "layer2",
  "--dsw-alias-button-tool-bar-fill-invisible": () => "transparent",
  "--dsw-alias-button-tool-bar-hover": "layer3",
  "--dsw-alias-interactive-bg-active": (c) => alpha(c.text2, 0.16),
  "--dsw-alias-interactive-bg-hover": (c) => alpha(c.text2, 0.1),
  "--dsw-alias-interactive-bg-hover-accent": (c) => alpha(c.brand, 0.14),
  "--dsw-alias-interactive-bg-hover-danger": (c) => alpha(c.error, 0.14),
  "--dsw-alias-interactive-bg-hover-solid": "layer2",
  "--dsw-alias-label-caption": "text3",
  "--dsw-alias-label-dimmed": "textDim",
  "--dsw-alias-label-primary": "text",
  "--dsw-alias-label-primary-bluish": "text",
  "--dsw-alias-label-primary-dimmed": "text2",
  "--dsw-alias-label-primary-foreground": "textInv",
  "--dsw-alias-label-primary-inverted": (c) => c.onBrand ?? c.textInv,
  "--dsw-alias-label-secondary": "text2",
  "--dsw-alias-label-tertiary": "text3",
  "--dsw-alias-markdown-citation": "brand",
  "--dsw-alias-markdown-code-block": "layer1",
  "--dsw-alias-markdown-code-block-banner": (c) => alpha(c.brand, 0.1),
  "--dsw-alias-markdown-code-segment-selected": (c) => alpha(c.brand, 0.16),
  "--dsw-alias-markdown-code-segment-unselected": (c) => alpha(c.text2, 0.1),
  "--dsw-alias-markdown-inline-code": "layer2",
  "--dsw-alias-markdown-placeholder": "text3",
  "--dsw-alias-markdown-tag": (c) => alpha(c.brand, 0.14),
  "--dsw-alias-scrollbar-bg-l1": "layer2",
  "--dsw-alias-scrollbar-bg-l2": "layer3",
  "--dsw-alias-scrollbar-hover-l1": "text3",
  "--dsw-alias-scrollbar-hover-l2": "text2",
  "--dsw-alias-state-business-primary": "biz",
  "--dsw-alias-state-business-tertiary": (c) => alpha(c.biz, 0.16),
  "--dsw-alias-state-error-primary": "error",
  "--dsw-alias-state-error-secondary": (c) => alpha(c.error, 0.14),
  "--dsw-alias-state-success-primary": "success",
  "--dsw-alias-state-success-secondary": (c) => alpha(c.success, 0.14),
  "--dsw-alias-state-success-tertiary": (c) => alpha(c.success, 0.1),
  "--dsw-alias-state-warn-label": (c) => mix(c.warn, c.text, 0.25),
  "--dsw-alias-state-warn-primary": "warn",
  "--dsw-alias-state-warn-secondary": (c) => alpha(c.warn, 0.14),
  "--dsw-alias-state-warn-tertiary": (c) => alpha(c.warn, 0.1),
  "--dsw-alias-toast-bg": (c) => alpha(c.overlay, 0.96),
  "--dsw-alias-tooltip-bg": (c) => alpha(c.overlay, 0.96),
  "--dsw-specific-sidebar-fill": (c) => alpha(c.base, 0.5)
};

/** Build the {token: {light, dark}} override layer for one team. */
export function makeTeamTokens(team) {
  const tokens = {};
  for (const name of ALL_TOKENS) {
    const spec = TOKEN_MAP[name];
    tokens[name] = {
      light: resolveSpec(spec, team.light),
      dark: resolveSpec(spec, team.dark)
    };
  }
  return tokens;
}

export function resolveSpec(spec, palette) {
  return typeof spec === "function" ? spec(palette) : palette[spec];
}

/** The four teams. `cockpit` is filled by scripts/build.mjs (base64 data URL). */
export const TEAMS = [
  {
    id: "redbull",
    name: "Red Bull",
    cockpit: null,
    onBrand: "#141A2E",
    tint: "rgba(255, 200, 0, 0.14)",
    dark: buildPalette({ base: "#10182E", brand: "#FFC800", biz: "#D90F0F" }, "dark"),
    light: buildPalette({ base: "#F2F4FA", brand: "#B58A00", biz: "#A30D0D" }, "light")
  },
  {
    id: "ferrari",
    name: "Ferrari",
    cockpit: null,
    onBrand: "#FFFFFF",
    tint: "rgba(220, 0, 0, 0.16)",
    dark: buildPalette({ base: "#151113", brand: "#DC0000", biz: "#FFF200" }, "dark"),
    light: buildPalette({ base: "#F9F6F5", brand: "#B00000", biz: "#B8A800" }, "light")
  },
  {
    id: "mclaren",
    name: "McLaren",
    cockpit: null,
    onBrand: "#FFFFFF",
    tint: "rgba(255, 128, 0, 0.15)",
    dark: buildPalette({ base: "#141519", brand: "#FF8000", biz: "#47C7FC" }, "dark"),
    light: buildPalette({ base: "#F6F6F7", brand: "#D96A00", biz: "#2E90C4" }, "light")
  },
  {
    id: "mercedes",
    name: "Mercedes",
    cockpit: null,
    onBrand: "#FFFFFF",
    tint: "rgba(0, 210, 190, 0.14)",
    dark: buildPalette({ base: "#101315", brand: "#00D2BE", biz: "#B4B5B7" }, "dark"),
    light: buildPalette({ base: "#F4F6F6", brand: "#00918C", biz: "#8A8B8E" }, "light")
  }
];

/** The skin's injected stylesheet. @import must be the very first rule. */
export const F1_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Titillium+Web:wght@600;700;900&display=swap');

/* ── cockpit backdrop: painted inside body's own background stack ──
   (a negative-z-index overlay layer would sit UNDER body's background,
   which the shell paints with --dsw-alias-bg-base — so the image lives
   in the body background layers instead: tint → readability gradient →
   cockpit image → base color) */
html { background-color: #0B0B10; }
html[data-f1-dark="false"] { background-color: #F4F5F8; }
body {
  background:
    radial-gradient(120% 80% at 50% 18%, var(--f1-tint, transparent) 0%, transparent 62%),
    repeating-linear-gradient(45deg, rgba(255,255,255,.014) 0 1px, transparent 1px 7px),
    repeating-linear-gradient(-45deg, rgba(255,255,255,.01) 0 1px, transparent 1px 7px),
    linear-gradient(to bottom, rgba(10,10,14,.34), rgba(10,10,14,.16) 30%, rgba(10,10,14,.28) 72%, rgba(10,10,14,.5)),
    var(--f1-cockpit, none) center / cover no-repeat fixed,
    var(--dsw-alias-bg-base, #0B0B10);
}
html[data-f1-dark="false"] body {
  background:
    radial-gradient(120% 80% at 50% 18%, var(--f1-tint, transparent) 0%, transparent 62%),
    linear-gradient(to bottom, rgba(244,246,250,.42), rgba(244,246,250,.28) 30%, rgba(244,246,250,.44) 72%, rgba(244,246,250,.72)),
    var(--f1-cockpit, none) center / cover no-repeat fixed,
    var(--dsw-alias-bg-base, #F4F5F8);
}

/* ── checkered-flag top strip ── */
body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 9998;
  background: repeating-conic-gradient(#FFFFFF 0 25%, #0B0B10 0 50%) 0 0 / 14px 14px;
  box-shadow: 0 1px 6px rgba(0,0,0,.45);
  pointer-events: none;
}

/* ── racing typography ── */
h1, h2, h3, h4, button {
  font-family: 'Titillium Web', 'Arial Narrow', 'Helvetica Neue', sans-serif;
}
h1, h2, h3, h4 { letter-spacing: .015em; }

/* ── team accent touches ── */
::selection { background: var(--f1-accent, #FFC800); color: #0B0B10; }
html[data-f1-dark="false"] ::selection { background: var(--f1-accent-light, #B58A00); color: #FFFFFF; }
:focus-visible { outline: 2px solid var(--f1-accent, #FFC800); outline-offset: 2px; }
a { text-decoration-color: var(--f1-accent, #FFC800); }

/* ── pit-lane team switcher (right-edge rail) ── */
#dsh-f1-rail {
  position: fixed;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 9px;
  border-radius: 999px;
  background: rgba(15,15,20,.55);
  border: 1px solid rgba(255,255,255,.08);
  box-shadow: 0 4px 16px rgba(0,0,0,.35);
  backdrop-filter: blur(8px);
}
html[data-f1-dark="false"] #dsh-f1-rail {
  background: rgba(255,255,255,.62);
  border-color: rgba(0,0,0,.08);
}
#dsh-f1-rail .f1-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform .15s ease, box-shadow .15s ease;
}
#dsh-f1-rail .f1-dot:hover { transform: scale(1.25); }
#dsh-f1-rail .f1-dot.active {
  box-shadow: 0 0 0 2px rgba(255,255,255,.85), 0 0 10px 2px var(--f1-accent, #FFC800);
}

@media (prefers-reduced-motion: reduce) {
  #dsh-f1-rail .f1-dot { transition: none; }
}
`;
