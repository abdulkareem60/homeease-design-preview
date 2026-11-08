window.SYSTEM_CONFIG = {
  dir: "b",
  name: "Clear & Practical",
  summary: "White surfaces, light-grey product tiles, hairline grid lines and one deep teal accent for actions. A single grotesk family carries headings and text; a monospace is reserved for specifications, SKUs and counts so facts are easy to scan. Tighter corners and denser spacing fit more products and information on screen.",
  fonts: "Headings and text: Schibsted Grotesk (SIL Open Font License), 400–800. Specifications, SKU and counts: IBM Plex Mono (SIL Open Font License), 400–500. Both load from Google Fonts with font-display: swap; fallbacks are Segoe UI and Consolas.",
  colours: [["--bg", "Page background"], ["--surface", "Image tiles, footer"], ["--ink", "Text"], ["--ink-2", "Secondary text"], ["--line", "Hairlines"], ["--line-strong", "Control borders"], ["--accent", "Primary action, focus ring"], ["--accent-hover", "Primary hover"], ["--accent-soft", "Availability note background"], ["--ok", "In stock"], ["--warn", "Low stock, provisional"], ["--bad", "Sold out, errors"]],
  type: [
    ["intro__title", "Display · Grotesk 700 · 28–43px / 1.08", "Practical home essentials, clearly priced."],
    ["section__title", "H2 · Grotesk 700 · 22–29px / 1.15", "New arrivals"],
    ["pdp__title", "Product title · Grotesk 700 · 26–34px", "Velvet Jewellery Organiser Tray"],
    ["pdp__price", "Price · Grotesk 700 · 28px", "Rs 2,450"],
    ["card__title", "Card title · Grotesk 600 · 15px / 1.32", "Insulated Steel Mug with Lid, 350 ml"],
    ["card__spec", "Spec line · IBM Plex Mono 12px", "24 × 16 cm · 5 compartments"],
    ["", "Body · Grotesk 400 · 15.5px / 1.55", "A low, divided tray for rings, earrings and everyday pieces, so they stay paired and visible on a dresser."]
  ],
  card: function (p, a) { return TEMPLATES_B.card(p, a); }
};
