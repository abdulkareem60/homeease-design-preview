window.SYSTEM_CONFIG = {
  dir: "a",
  name: "Warm Everyday",
  summary: "Warm neutrals, a terracotta accent used only for primary actions and the wordmark, Red Hat Display for headings and Red Hat Text for everything people need to read. Rounded, pill-shaped controls and generous spacing make it feel welcoming without hiding the products.",
  fonts: "Headings: Red Hat Display (SIL Open Font License), 600–700, tight letter-spacing. Text, prices and controls: Red Hat Text (SIL Open Font License), 400–700, built for small sizes. Prices use lining, tabular figures so PKR amounts line up. Loaded from Google Fonts with font-display: swap; fallback Segoe UI / system sans.",
  colours: [["--bg", "Page background"], ["--surface", "Tinted section, panels"], ["--ink", "Text, focus ring"], ["--ink-2", "Secondary text"], ["--line", "Dividers"], ["--line-strong", "Control borders"], ["--accent", "Primary action"], ["--accent-hover", "Primary hover"], ["--deep", "Footer and top bar"], ["--ok", "In stock"], ["--warn", "Low stock, provisional"], ["--bad", "Sold out, errors"]],
  type: [
    ["hero__title", "Display · Red Hat Display 700 · 37–62px / 1.04", "Small things that make home easier."],
    ["section__title", "H2 · Red Hat Display 700 · 26–38px / 1.12", "New in the shop"],
    ["pdp__title", "Product title · Red Hat Display 700 · 30–43px", "Velvet Jewellery Organiser Tray"],
    ["pdp__price", "Price · Red Hat Text 600 · 26px", "Rs 2,450"],
    ["card__title", "Card title · Red Hat Text 600 · 15.5px / 1.35", "Insulated Steel Mug with Lid, 350 ml"],
    ["", "Body · Red Hat Text 400 · 16px / 1.55", "A low, divided tray for rings, earrings and everyday pieces, so they stay paired and visible on a dresser."],
    ["eyebrow", "Eyebrow · Red Hat Text 600 · 13px caps", "Home, desk &amp; self-care essentials"]
  ],
  card: function (p, a) { return TEMPLATES_A.card(p, a); }
};
