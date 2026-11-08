window.SYSTEM_CONFIG = {
  dir: "a",
  name: "Warm Everyday",
  summary: "Warm neutrals, a terracotta accent used only for primary actions and the wordmark, a soft serif for headings and a clear sans-serif for everything people need to read. Rounded, pill-shaped controls and generous spacing make it feel welcoming without hiding the products.",
  fonts: "Headings: Fraunces (variable serif, SIL Open Font License), weight 500, optical size matched to size. Text, prices and controls: Figtree (SIL Open Font License), 400–700. Both load from Google Fonts with font-display: swap; fallbacks are Georgia and Segoe UI.",
  colours: [["--bg", "Page background"], ["--surface", "Tinted section, panels"], ["--ink", "Text, focus ring"], ["--ink-2", "Secondary text"], ["--line", "Dividers"], ["--line-strong", "Control borders"], ["--accent", "Primary action"], ["--accent-hover", "Primary hover"], ["--deep", "Footer and top bar"], ["--ok", "In stock"], ["--warn", "Low stock, provisional"], ["--bad", "Sold out, errors"]],
  type: [
    ["hero__title", "Display · Fraunces 500 · 37–62px / 1.04", "Small things that make home easier."],
    ["section__title", "H2 · Fraunces 500 · 26–38px / 1.12", "New in the shop"],
    ["pdp__title", "Product title · Fraunces 500 · 30–43px", "Velvet Jewellery Organiser Tray"],
    ["pdp__price", "Price · Figtree 600 · 26px", "Rs 2,450"],
    ["card__title", "Card title · Figtree 600 · 15.5px / 1.35", "Insulated Steel Mug with Lid, 350 ml"],
    ["", "Body · Figtree 400 · 16px / 1.55", "A low, divided tray for rings, earrings and everyday pieces, so they stay paired and visible on a dresser."],
    ["eyebrow", "Eyebrow · Figtree 600 · 13px caps", "Home, desk &amp; self-care essentials"]
  ],
  card: function (p, a) { return TEMPLATES_A.card(p, a); }
};
