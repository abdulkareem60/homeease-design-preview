/* Design-system reference page. Reads live tokens from the direction's CSS and computes contrast ratios. */
(function () {
  function lum(hex) {
    const c = hex.trim().replace("#", "");
    const v = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)));
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  function ratio(a, b) { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); }
  const tok = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

  window.renderSystem = function (cfg) {
    const a = HE.api();
    const colours = cfg.colours.map(([name, role]) => `<li class="sys-sw"><span style="background:var(${name})"></span><b>${role}</b><code>${name}: ${tok(name)}</code></li>`).join("");
    const pairs = [
      ["--ink", "--bg", "Body text"], ["--ink-2", "--bg", "Secondary text"], ["--accent-ink", "--accent", "Primary button text"],
      ["--accent", "--bg", "Accent text / links"], ["--ok", "--bg", "In stock"], ["--warn", "--bg", "Low stock / provisional"],
      ["--bad", "--bg", "Sold out / error"], ["--ink-2", "--surface", "Secondary text on surface"], ["--line-strong", "--bg", "Control borders (non-text, 3:1)"]
    ].map(([f, b, label]) => {
      const r = ratio(tok(f), tok(b));
      const need = label.includes("non-text") ? 3 : 4.5;
      return `<tr><td>${label}</td><td><span class="sys-pair" style="color:var(${f});background:var(${b})">Aa</span> <code>${f} on ${b}</code></td><td>${r.toFixed(2)}:1</td><td>${r >= need ? "Pass" : "Below " + need + ":1"}</td></tr>`;
    }).join("");
    const tray = a.representative();
    const sample = a.C.products.find((p) => p.handle === "insulated-steel-mug-350ml");
    document.getElementById("app").innerHTML = `
    <main class="sys wrap" id="main">
      <p class="sys-kicker">Design system reference · Revised v2 · Direction ${cfg.dir.toUpperCase()} — ${cfg.name}</p>
      <h1 class="sys-h1">${cfg.name}</h1>
      <p class="sys-lead">${cfg.summary}</p>

      <h2 class="sys-h2">Colour roles</h2>
      <ul class="sys-swatches">${colours}</ul>
      <h3 class="sys-h3">Contrast (computed from these tokens)</h3>
      <table class="sys-table"><thead><tr><th>Use</th><th>Pair</th><th>Ratio</th><th>WCAG AA</th></tr></thead><tbody>${pairs}</tbody></table>

      <h2 class="sys-h2">Typography</h2>
      <p class="sys-note">${cfg.fonts}</p>
      <div class="sys-type">${cfg.type.map(([cls, label, text]) => `<div><code>${label}</code><p class="${cls}">${text}</p></div>`).join("")}</div>

      <h2 class="sys-h2">Spacing, widths, radii</h2>
      <div class="sys-space">${[4, 8, 12, 16, 24, 32, 48, 64].map((n) => `<div><span style="width:${n}px;height:${n}px"></span><code>${n}px</code></div>`).join("")}</div>
      <p class="sys-note">Content max width <code>${tok("--maxw")}</code> · side gutter <code>${tok("--gutter")}</code> · section spacing <code>${tok("--space-section")}</code> · radii <code>${tok("--radius-s")} / ${tok("--radius-m")} / ${tok("--radius-l")}</code> · buttons <code>${tok("--radius-btn")}</code> · control height <code>${tok("--control-h")}</code></p>

      <h2 class="sys-h2">Buttons and links</h2>
      <div class="sys-row">
        <button class="btn btn--primary">Add to cart</button>
        <button class="btn btn--primary" style="background:var(--accent-hover)">Hover</button>
        <button class="btn btn--primary sys-focus">Focus</button>
        <button class="btn btn--primary is-loading" aria-busy="true"><span class="btn__label">Adding…</span></button>
        <button class="btn btn--primary" disabled>Sold out</button>
      </div>
      <div class="sys-row">
        <button class="btn btn--secondary">${a.icon("chat")} Ask on WhatsApp</button>
        <button class="btn btn--secondary sys-focus">Focus</button>
        <button class="btn btn--ghost">Ghost / text action</button>
        <button class="link-btn">Inline link</button>
      </div>

      <h2 class="sys-h2">Form controls</h2>
      <div class="sys-row sys-row--top">
        <fieldset class="opts"><legend class="opts__legend">Colour: <strong>Blush</strong> (selected, default, sold out)</legend>
          <div class="opts__list">${tray.variants.map((v, i) => a.chip(v, i === 0, "sys-chip", tray)).join("")}</div></fieldset>
        <div><p class="sys-label">Quantity (min / max states)</p>${a.qtyHTML("sys", 1, 3)}</div>
      </div>
      <div class="sys-row sys-row--top">
        <div class="sys-field"><label for="sys-in">Mobile number</label><input id="sys-in" class="input" value="0300 1234567"></div>
        <div class="sys-field sys-field--error"><label for="sys-err">Mobile number</label><input id="sys-err" class="input" value="12345" aria-invalid="true" aria-describedby="sys-err-msg"><p id="sys-err-msg" class="sys-error">Enter a Pakistani mobile number, for example 0300 1234567.</p></div>
      </div>

      <h2 class="sys-h2">Availability states</h2>
      <div class="sys-row"><span class="avail avail--in">In stock</span><span class="avail avail--low">Low stock: 3 available</span><span class="avail avail--out">Sold out</span><span class="avail avail--confirm">Availability to be confirmed</span><span class="prov">Provisional</span></div>

      <h2 class="sys-h2">Product card</h2>
      <ul class="pgrid sys-cards">${cfg.card(sample, a)}${cfg.card(a.C.products.find((p) => p.mode === "enquire"), a)}</ul>

      <h2 class="sys-h2">Icons</h2>
      <div class="sys-row sys-icons">${["search", "bag", "menu", "chat", "cash", "phone", "truck", "check", "expand", "close", "plus", "minus", "chevron"].map((n) => `<span title="${n}">${a.icon(n)}<code>${n}</code></span>`).join("")}</div>
      <p class="sys-note">One outline icon set, 1.7px stroke on a 24px grid, drawn for this preview. Icons always sit beside a text label except for universally understood controls (search, cart, menu, close), which carry accessible names.</p>

      <h2 class="sys-h2">Motion</h2>
      <p class="sys-note">Transitions are 150–250 ms on colour, drawers and small image zooms only. All motion is removed when the visitor prefers reduced motion. No scroll-triggered animation.</p>
    </main>`;
  };
})();
