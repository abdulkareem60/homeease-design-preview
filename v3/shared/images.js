/*
  Product photography (v3).
  Licensed stock photographs (Unsplash License) stored in shared/img at 800 px and 1600 px widths.
  Credits: shared/img/CREDITS.md. Replace with the owner's own product photos before launch.

  HEImg.product(product, variant, { view, eager }) returns a responsive <img>:
  - crops with object-fit: cover around the product's focal point (pos)
  - close-up views scale the same photograph around that focal point (zoom)
*/
(function () {
  const BASE = (function () {
    const s = document.currentScript && document.currentScript.src;
    return s ? s.replace(/images\.js(\?.*)?$/, "img/") : "../shared/img/";
  })();
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function pick(p, v, view) {
    if (view && p.views) {
      const found = p.views.find((x) => x.id === view);
      if (found) return found;
    }
    if (v && v.photo) return Object.assign({ label: v.name }, v.photo);
    return Object.assign({ label: "Product photo" }, p.photo || {});
  }

  function product(p, v, opts) {
    opts = opts || {};
    const ph = pick(p, v, opts.view);
    const label = `${p.name}${v && p.variants.length > 1 ? ", " + v.name : ""}${ph.label && ph.label !== "Product photo" && ph.label !== (v && v.name) ? ", " + ph.label.toLowerCase() : ""}`;
    const zoom = ph.zoom || 1;
    const style = `object-position:${ph.pos || "50% 50%"};${zoom > 1 ? `transform:scale(${zoom});transform-origin:${ph.pos || "50% 50%"};` : ""}`;
    const sizes = opts.sizes || "(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw";
    return `<img class="ph-img" src="${BASE}${ph.img}-800.jpg" srcset="${BASE}${ph.img}-800.jpg 800w, ${BASE}${ph.img}-1600.jpg 1600w" sizes="${sizes}" alt="${esc(label)}" style="${style}" ${opts.eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" width="800" height="800">`;
  }

  /* Editorial image: the desk lamp photograph, shown wide. */
  function scene(name) {
    if (name === "desk") {
      return `<img class="ph-img" src="${BASE}desk-lamp-800.jpg" srcset="${BASE}desk-lamp-800.jpg 800w, ${BASE}desk-lamp-1600.jpg 1600w" sizes="(min-width: 900px) 60vw, 100vw" alt="White dome desk lamp on a cork-topped desk beside a potted plant" style="object-position:40% 50%" loading="lazy" decoding="async" width="1600" height="900">`;
    }
    return "";
  }

  window.HEImg = { product, scene };
})();
