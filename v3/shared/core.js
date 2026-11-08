/*
  Shared preview behaviour for both design directions.
  - Sample data comes only from HE_CATALOG (shared/catalog.js).
  - Each direction supplies its own templates (a/templates.js, b/templates.js) and CSS.
  - Nothing here sends messages, takes payments or records orders.
*/
(function () {
  const C = window.HE_CATALOG;
  const qs = new URLSearchParams(location.search);
  const FRAMED = qs.get("frame") === "1";
  const MODE_OVERRIDE = qs.get("mode"); // "buy" | "enquire" for the representative product

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n) => "Rs " + Number(n).toLocaleString("en-PK");
  const product = (h) => C.products.find((p) => p.handle === h);
  const variant = (p, id) => p.variants.find((v) => v.id === id) || p.variants[0];
  const category = (id) => C.categories.find((c) => c.id === id);
  const firstAvailable = (p) => p.variants.find((v) => v.stock > 0) || p.variants[0];
  const optionLabel = (p) => (new Set(p.variants.map((v) => v.color)).size > 1 ? "Colour" : "Option");
  const representative = () => C.products.find((p) => p.representative);
  const modeOf = (p) => (p.representative && MODE_OVERRIDE ? MODE_OVERRIDE : p.mode);
  const productUrl = (p, v) => `${C.store.baseUrl}/products/${p.handle}${v && p.variants.length > 1 ? "?variant=" + v.id : ""}`;

  // ---------- storage (wrapped; works without it) ----------
  let KEY = "he-preview-cart";
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state.cart)); } catch (e) { /* preview still works in memory */ }
  }

  const state = { cart: [], pdp: null, qv: null, lightbox: 0 };
  let T = null, CTX = null;

  // ---------- cart ----------
  const inCart = (p, v) => state.cart.filter((i) => i.handle === p.handle && i.variantId === v.id).reduce((n, i) => n + i.qty, 0);
  const remaining = (p, v) => Math.max(0, v.stock - inCart(p, v));
  const cartCount = () => state.cart.reduce((n, i) => n + i.qty, 0);
  const cartSubtotal = () => state.cart.reduce((n, i) => n + product(i.handle).price * i.qty, 0);
  function addToCart(p, v, qty) {
    const ok = Math.min(qty, remaining(p, v));
    if (ok <= 0) return 0;
    const line = state.cart.find((i) => i.handle === p.handle && i.variantId === v.id);
    if (line) line.qty += ok; else state.cart.push({ handle: p.handle, variantId: v.id, qty: ok });
    save(); refreshCartUI();
    return ok;
  }
  function setLineQty(key, qty) {
    const line = state.cart.find((i) => i.handle + "|" + i.variantId === key);
    if (!line) return;
    const p = product(line.handle), v = variant(p, line.variantId);
    line.qty = Math.max(1, Math.min(qty, v.stock));
    save(); refreshCartUI();
  }
  function removeLine(key) {
    state.cart = state.cart.filter((i) => i.handle + "|" + i.variantId !== key);
    save(); refreshCartUI();
  }

  // ---------- availability ----------
  function availability(p, v) {
    if (modeOf(p) === "enquire") return { key: "confirm", text: "Availability to be confirmed" };
    if (v.stock <= 0) return { key: "out", text: "Sold out" };
    if (v.stock <= 3) return { key: "low", text: `Low stock: ${v.stock} available` };
    return { key: "in", text: "In stock" };
  }
  function productAvailability(p) {
    if (modeOf(p) === "enquire") return { key: "confirm", text: "Availability to be confirmed" };
    const any = p.variants.some((v) => v.stock > 0);
    const all = p.variants.every((v) => v.stock > 0);
    if (!any) return { key: "out", text: "Sold out" };
    if (!all) return { key: "in", text: "In stock in some colours" };
    return { key: "in", text: "In stock" };
  }

  // ---------- WhatsApp (preview only) ----------
  function waMessage(kind, p, v, qty) {
    const hello = "Hello HomeEaseEssentials,";
    if (kind === "availability") return `${hello} could you confirm availability and dispatch time for:\n${p.name}\nOption: ${v.name}\nQuantity: ${qty || 1}\n${productUrl(p, v)}`;
    if (kind === "restock") return `${hello} will this be back in stock?\n${p.name}\nOption: ${v.name}\n${productUrl(p, v)}`;
    if (kind === "product") return `${hello} I have a question about:\n${p.name}\nOption: ${v.name}\n${productUrl(p, v)}`;
    if (kind === "cart") {
      const lines = state.cart.map((i) => { const pp = product(i.handle), vv = variant(pp, i.variantId); return `- ${pp.name} (${vv.name}) × ${i.qty} = ${fmt(pp.price * i.qty)}`; });
      return `${hello} I'd like to ask about these items:\n${lines.join("\n")}\nSubtotal: ${fmt(cartSubtotal())} (delivery not included)`;
    }
    return `${hello} I have a question.`;
  }
  function openWhatsApp(kind, p, v, qty, opener) {
    const msg = waMessage(kind, p, v, qty);
    const link = `https://wa.me/[number-TBC]?text=${encodeURIComponent(msg)}`;
    const purpose = kind === "cart" ? "This sends a question about your cart. It does not place an order." :
      kind === "availability" ? "This asks us to confirm availability and dispatch time. It does not place an order." :
      "This opens a chat with your question. It does not place an order.";
    const d = dialogShell("dlg-wa", "WhatsApp message preview", `
      <p class="dlg__lead">${purpose}</p>
      <div class="wa-bubble" aria-label="Message text"><pre>${esc(msg)}</pre></div>
      <p class="dlg__fine">Preview only: no chat opens and nothing is sent. The business WhatsApp number is to be confirmed.</p>
      <details class="dlg__tech"><summary>Encoded link</summary><code>${esc(link)}</code></details>
      <div class="dlg__actions"><button class="btn btn--secondary" type="button" data-copy>Copy message</button><button class="btn btn--primary" type="button" data-close>Done</button></div>`, "dialog");
    d.querySelector("[data-copy]").addEventListener("click", (e) => {
      try { navigator.clipboard.writeText(msg).then(() => announce("Message copied")); } catch (err) { announce("Copy not available in this browser"); }
    });
    openDialog(d, opener);
  }

  // ---------- dialogs ----------
  let lastOpener = null;
  function dialogShell(id, title, inner, kind) {
    let d = document.getElementById(id);
    if (!d) {
      d = document.createElement("dialog");
      d.id = id;
      document.body.appendChild(d);
      d.addEventListener("click", (e) => { if (e.target === d) d.close(); });
      d.addEventListener("close", () => {
        document.documentElement.classList.remove("has-dialog");
        let o = d._opener;
        if (!o || !document.contains(o) || o.disabled) o = (d._openerSel && document.querySelector(d._openerSel)) || null;
        if (!o || o.disabled) o = document.querySelector("[data-open-cart]");
        if (o) o.focus();
      });
    }
    d.className = kind || "dialog";
    d.setAttribute("aria-labelledby", id + "-title");
    d.innerHTML = `<div class="${kind === "drawer" || kind === "drawer drawer--left" ? "drawer__inner" : "dialog__inner"}">
      <div class="dlg__head"><h2 class="dlg__title" id="${id}-title">${title}</h2>
      <button class="icon-btn dlg__close" type="button" data-close aria-label="Close">${icon("close")}</button></div>
      <div class="dlg__body">${inner}</div></div>`;
    return d;
  }
  function openDialog(d, opener) {
    d._opener = opener || document.activeElement;
    try { d._openerSel = d._opener && d._opener !== document.body ? selectorFor(d._opener) : null; } catch (e) { d._openerSel = null; }
    if (!d.open) d.showModal();
    document.documentElement.classList.add("has-dialog");
    const first = d.querySelector("[autofocus]") || d.querySelector(".dlg__body button, .dlg__body a, .dlg__body input, .dlg__body summary") || d.querySelector("[data-close]");
    if (first) first.focus();
  }

  const INFO = {
    checkout: ["Checkout is outside this design phase", "In the finished store this button opens the platform's secure checkout, where the delivery charge is shown before the order is placed. Checkout design follows after a visual direction is chosen. Nothing has been ordered and no payment was taken."],
    delivery: ["Delivery (provisional)", "Delivery charges, areas and timelines will be published after the courier is selected. The full delivery charge will be shown at checkout before an order is placed."],
    returns: ["Returns and refunds (provisional)", "The returns policy is being drafted and has not been approved. Details will appear here once confirmed."],
    privacy: ["Privacy policy (provisional)", "This page will be written once services and analytics are confirmed, and reviewed before launch."],
    terms: ["Terms and conditions (provisional)", "This page will be written and reviewed before launch."],
    contact: ["Contact", "WhatsApp is the main contact channel. Support hours, phone and email are to be confirmed."],
    about: ["About HomeEaseEssentials", "The brand story will use facts provided by the owner. Placeholder for design review."],
    faq: ["Frequently asked questions", "FAQ answers on cash on delivery, delivery and returns will be added once policies are confirmed."],
    account: ["Accounts", "Customer accounts are not planned for launch. Guest checkout is used."]
  };
  function openInfo(key, opener) {
    const [title, text] = INFO[key] || ["Not in this preview", "This area is outside the current design phase."];
    openDialog(dialogShell("dlg-info", title, `<p class="dlg__lead">${esc(text)}</p><div class="dlg__actions"><button class="btn btn--primary" type="button" data-close>Close</button></div>`, "dialog"), opener);
  }

  // ---------- cart drawer ----------
  function cartHTML() {
    if (!state.cart.length) {
      return `<div class="cart-empty"><p class="cart-empty__title">Your cart is empty</p>
        <p>Browse a category to find something for your home.</p>
        <ul class="cart-empty__cats">${C.categories.map((c) => `<li><button type="button" class="link-btn" data-category="${c.id}">${esc(c.name)}</button></li>`).join("")}</ul></div>`;
    }
    const lines = state.cart.map((i) => {
      const p = product(i.handle), v = variant(p, i.variantId), key = i.handle + "|" + i.variantId;
      return `<li class="cart-line">
        <div class="cart-line__img">${HEImg.product(p, v, { theme: CTX.theme, sizes: "80px" })}</div>
        <div class="cart-line__info">
          <p class="cart-line__name">${esc(p.name)}</p>
          <p class="cart-line__meta">${p.variants.length > 1 ? optionLabel(p) + ": " + esc(v.name) + " · " : ""}${fmt(p.price)} each</p>
          <div class="cart-line__row">
            <div class="qty qty--sm" role="group" aria-label="Quantity for ${esc(p.name)}">
              <button type="button" class="qty__btn" data-cart-step="${key}" data-d="-1" aria-label="Decrease quantity" ${i.qty <= 1 ? "disabled" : ""}>${icon("minus")}</button>
              <span class="qty__val" aria-live="polite">${i.qty}</span>
              <button type="button" class="qty__btn" data-cart-step="${key}" data-d="1" aria-label="Increase quantity" ${i.qty >= v.stock ? "disabled" : ""}>${icon("plus")}</button>
            </div>
            <button type="button" class="link-btn cart-line__remove" data-cart-remove="${key}">Remove<span class="sr-only"> ${esc(p.name)}</span></button>
          </div>
          ${i.qty >= v.stock ? `<p class="cart-line__note">Maximum available: ${v.stock}</p>` : ""}
        </div>
        <p class="cart-line__total">${fmt(p.price * i.qty)}</p></li>`;
    }).join("");
    return `<ul class="cart-lines">${lines}</ul>
      <div class="cart-sum">
        <div class="cart-sum__row"><span>Subtotal</span><strong>${fmt(cartSubtotal())}</strong></div>
        <p class="cart-sum__note">Delivery charge is shown at checkout before you place your order. Cash on delivery available.</p>
        <button type="button" class="btn btn--primary btn--block" data-info="checkout">Checkout</button>
        <button type="button" class="btn btn--secondary btn--block" data-wa-cart>${icon("chat")} Ask about this cart on WhatsApp</button>
      </div>`;
  }
  function openCart(opener) {
    const d = dialogShell("dlg-cart", `Cart <span class="dlg__count">(${cartCount()})</span>`, `<div id="cart-body">${cartHTML()}</div>`, "drawer");
    openDialog(d, opener);
  }
  function refreshCartUI() {
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = cartCount();
      el.hidden = cartCount() === 0;
    });
    document.querySelectorAll("[data-cart-label]").forEach((el) => el.setAttribute("aria-label", `Cart, ${cartCount()} item${cartCount() === 1 ? "" : "s"}`));
    document.querySelectorAll("[data-cart-subtotal]").forEach((el) => (el.textContent = cartCount() ? fmt(cartSubtotal()) : ""));
    const body = document.getElementById("cart-body");
    if (body) {
      const ae = document.activeElement;
      const step = ae && body.contains(ae) && ae.dataset.cartStep ? { k: ae.dataset.cartStep, d: ae.dataset.d } : null;
      body.innerHTML = cartHTML();
      const t = document.getElementById("dlg-cart-title");
      if (t) t.innerHTML = `Cart <span class="dlg__count">(${cartCount()})</span>`;
      if (step) {
        const el = body.querySelector(`[data-cart-step="${CSS.escape(step.k)}"][data-d="${step.d}"]`);
        const other = body.querySelector(`[data-cart-step="${CSS.escape(step.k)}"]:not([disabled])`);
        (el && !el.disabled ? el : other || body.querySelector("button")).focus();
      }
    }
    if (state.pdp) renderBuy();
  }

  // ---------- search ----------
  function searchResults(q) {
    q = q.trim().toLowerCase();
    if (!q) return `<p class="search__hint">Browse by category</p><ul class="search__cats">${C.categories.map((c) => `<li><button type="button" class="link-btn" data-category="${c.id}">${esc(c.name)}</button></li>`).join("")}</ul>`;
    const terms = q.split(/\s+/);
    const hits = C.products.filter((p) => {
      const hay = (p.name + " " + category(p.category).name + " " + p.summary + " " + p.variants.map((v) => v.name).join(" ")).toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
    if (!hits.length) return `<p class="search__hint" role="status">No sample products match “${esc(q)}”. Try “mug”, “lamp” or “organiser”.</p>`;
    return `<p class="search__hint" role="status">${hits.length} result${hits.length > 1 ? "s" : ""}</p><ul class="search__list">${hits.map((p) => `<li>${productLink(p, `
        <span class="search__thumb">${HEImg.product(p, firstAvailable(p), { theme: CTX.theme, sizes: "60px" })}</span>
        <span class="search__text"><span class="search__name">${esc(p.name)}</span><span class="search__meta">${esc(category(p.category).name)} · ${fmt(p.price)}</span></span>`, "search__item")}</li>`).join("")}</ul>`;
  }
  function openSearch(opener) {
    const d = dialogShell("dlg-search", "Search", `
      <form class="search__form" role="search" onsubmit="return false">
        <label class="sr-only" for="search-input">Search products</label>
        <input id="search-input" class="input" type="search" placeholder="Search organisers, mugs, lamps…" autocomplete="off" autofocus>
      </form><div id="search-results" class="search__results">${searchResults("")}</div>`, "dialog dialog--search");
    const inp = d.querySelector("#search-input");
    inp.addEventListener("input", () => (d.querySelector("#search-results").innerHTML = searchResults(inp.value)));
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { const f = d.querySelector(".search__item"); if (f) f.click(); } });
    openDialog(d, opener);
  }

  // product link: representative → real page; others → quick view
  function productLink(p, inner, cls, extra) {
    if (p.representative) return `<a class="${cls || ""}" href="product.html${location.search}"${extra || ""}>${inner}</a>`;
    return `<button type="button" class="${cls || ""}" data-quick="${p.handle}"${extra || ""}>${inner}</button>`;
  }

  // ---------- category panel ----------
  function openCategory(id, opener) {
    const list = id === "all" ? C.products : C.products.filter((p) => p.category === id);
    const c = category(id);
    const d = dialogShell("dlg-cat", c ? esc(c.name) : "All products", `
      ${c ? `<p class="dlg__lead">${esc(c.blurb)}</p>` : ""}
      <ul class="mini-grid">${list.map((p) => { const a = productAvailability(p); return `<li class="mini">${productLink(p, `
        <span class="mini__img">${HEImg.product(p, firstAvailable(p), { theme: CTX.theme })}</span>
        <span class="mini__name">${esc(p.name)}</span><span class="mini__price">${fmt(p.price)}</span>
        <span class="avail avail--${a.key}">${a.text}</span>`, "mini__link")}</li>`; }).join("")}</ul>`, "drawer");
    openDialog(d, opener);
  }

  // ---------- quick view ----------
  function quickHTML() {
    const { p, v, qty } = state.qv;
    const a = availability(p, v);
    const left = remaining(p, v);
    const enquire = modeOf(p) === "enquire";
    return `<div class="qv">
      <div class="qv__img">${HEImg.product(p, v, { theme: CTX.theme })}</div>
      <div class="qv__info">
        <p class="qv__price">${fmt(p.price)}</p>
        <p class="avail avail--${a.key}">${a.text}</p>
        <p class="qv__summary">${esc(p.summary)}</p>
        ${p.variants.length > 1 ? `<fieldset class="opts"><legend class="opts__legend">${optionLabel(p)}: <strong>${esc(v.name)}</strong></legend><div class="opts__list">${p.variants.map((x) => chip(x, x.id === v.id, "qv-variant", p)).join("")}</div></fieldset>` : ""}
        ${enquire ? `<p class="note">We confirm stock and dispatch time for this item before you order.</p><button type="button" class="btn btn--primary btn--block" data-wa="availability" data-handle="${p.handle}">${icon("chat")} Check availability on WhatsApp</button>`
        : v.stock <= 0 ? `<button type="button" class="btn btn--primary btn--block" disabled>Sold out</button><button type="button" class="btn btn--secondary btn--block" data-wa="restock" data-handle="${p.handle}">${icon("chat")} Ask about restock</button>`
        : `<div class="qv__buy">${qtyHTML("qv", qty, left)}<button type="button" class="btn btn--primary" data-qv-add ${left <= 0 ? "disabled" : ""}>${left <= 0 ? "All available units in cart" : "Add to cart"}</button></div>`}
        <p class="qv__fine">${p.representative ? `<a href="product.html${location.search}">View full product page</a>` : "Full product pages for this item follow in the next design phase."}</p>
      </div></div>`;
  }
  function openQuick(handle, opener) {
    const p = product(handle);
    const v = firstAvailable(p);
    state.qv = { p, v, qty: 1 };
    openDialog(dialogShell("dlg-qv", esc(p.name), `<div id="qv-body">${quickHTML()}</div>`, "dialog dialog--wide"), opener);
  }
  function renderQuick(focusSel) {
    const b = document.getElementById("qv-body");
    if (!b) return;
    b.innerHTML = quickHTML();
    if (focusSel) { const el = b.querySelector(focusSel); if (el) el.focus(); }
  }

  // ---------- small UI parts shared by templates ----------
  function chip(v, selected, name, p) {
    const sold = modeOf(p) !== "enquire" && v.stock <= 0;
    return `<label class="chip${selected ? " is-selected" : ""}${sold ? " is-sold" : ""}">
      <input type="radio" name="${name}" value="${v.id}" ${selected ? "checked" : ""} class="chip__input">
      <span class="chip__swatch" style="background:${v.color}" aria-hidden="true"></span>
      <span class="chip__label">${esc(v.name)}${sold ? '<span class="chip__sold"> · sold out</span>' : ""}</span></label>`;
  }
  function qtyHTML(scope, qty, max) {
    return `<div class="qty" role="group" aria-label="Quantity">
      <button type="button" class="qty__btn" data-qty-scope="${scope}" data-d="-1" aria-label="Decrease quantity" ${qty <= 1 ? "disabled" : ""}>${icon("minus")}</button>
      <label class="sr-only" for="${scope}-qty">Quantity</label>
      <input id="${scope}-qty" class="qty__input" type="number" inputmode="numeric" min="1" max="${Math.max(1, max)}" value="${qty}" data-qty-input="${scope}">
      <button type="button" class="qty__btn" data-qty-scope="${scope}" data-d="1" aria-label="Increase quantity" ${qty >= max ? "disabled" : ""}>${icon("plus")}</button></div>`;
  }
  const ICONS = {
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    minus: '<path d="M5 12h14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    bag: '<path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 016 0V8"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    chat: '<path d="M4.5 19.5l1.2-3.6A7.5 7.5 0 1112 19.5a7.6 7.6 0 01-3.7-1z"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    expand: '<path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/>',
    truck: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/>',
    cash: '<rect x="3" y="6.5" width="18" height="11" rx="1.5"/><circle cx="12" cy="12" r="2.5"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    phone: '<path d="M6.5 4h3l1.5 4-2 1.2a10 10 0 005.3 5.3L15.5 12.5l4 1.5v3a2 2 0 01-2.2 2A15.5 15.5 0 014.5 6.2 2 2 0 016.5 4z"/>'
  };
  function icon(n) {
    return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ""}</svg>`;
  }

  // ---------- product page ----------
  function pdpCtx() {
    const p = state.pdp.p, v = variant(p, state.pdp.variantId);
    return { p, v, qty: state.pdp.qty, img: state.pdp.img, a: availability(p, v), left: remaining(p, v), enquire: modeOf(p) === "enquire", added: state.pdp.added };
  }
  function renderBuy(focusSel) {
    const el = document.getElementById("buybox");
    if (!el) return;
    const active = document.activeElement;
    const keep = focusSel || (active && el.contains(active) ? selectorFor(active) : null);
    const x = pdpCtx();
    if (x.qty > Math.max(1, x.left)) state.pdp.qty = Math.max(1, x.left);
    el.innerHTML = T.buyBox(pdpCtx(), API);
    const sku = document.getElementById("pdp-sku");
    if (sku) sku.textContent = "SKU " + pdpCtx().v.sku;
    const sticky = document.getElementById("sticky-buy");
    if (sticky && T.stickyBar) sticky.innerHTML = T.stickyBar(pdpCtx(), API);
    if (keep) { const f = el.querySelector(keep); if (f) f.focus(); }
  }
  function renderGallery() {
    const el = document.getElementById("gallery");
    if (!el) return;
    const keep = el.contains(document.activeElement) ? selectorFor(document.activeElement) : null;
    el.innerHTML = T.gallery(pdpCtx(), API);
    if (keep) { const f = el.querySelector(keep); if (f) f.focus(); }
  }
  function selectorFor(node) {
    if (node.id) return "#" + CSS.escape(node.id);
    for (const a of ["data-thumb", "data-qty-scope", "data-wa", "data-enlarge", "data-add", "data-quick", "data-category", "data-info", "data-open-cart", "data-open-search", "data-open-nav", "data-wa-cart"]) {
      if (node.hasAttribute && node.hasAttribute(a)) {
        const extra = node.hasAttribute("data-d") ? `[data-d="${node.getAttribute("data-d")}"]` : "";
        return `[${a}="${node.getAttribute(a)}"]${extra}`;
      }
    }
    if (node.name && node.value) return `input[name="${node.name}"][value="${node.value}"]`;
    return null;
  }
  function openLightbox(i, opener) {
    const x = pdpCtx();
    const views = x.p.views || [{ id: "main", label: "Product" }];
    state.lightbox = (i + views.length) % views.length;
    const view = views[state.lightbox];
    const d = dialogShell("dlg-lightbox", `${esc(view.label)} <span class="dlg__count">${state.lightbox + 1} of ${views.length}</span>`, `
      <div class="lightbox__img">${HEImg.product(x.p, x.v, { view: view.id, theme: CTX.theme, eager: true, sizes: "(min-width: 920px) 900px, 100vw" })}</div>
      <div class="lightbox__nav">
        <button type="button" class="icon-btn icon-btn--boxed" data-lb="-1" aria-label="Previous image">${icon("left")}</button>
        <button type="button" class="icon-btn icon-btn--boxed" data-lb="1" aria-label="Next image">${icon("chevron")}</button>
      </div>`, "dialog dialog--lightbox");
    openDialog(d, opener || d._opener);
    d.onkeydown = (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); openLightbox(state.lightbox + 1, d._opener); d.querySelector('[data-lb="1"]').focus(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); openLightbox(state.lightbox - 1, d._opener); d.querySelector('[data-lb="-1"]').focus(); }
    };
  }

  // ---------- announcements ----------
  function announce(msg, actionHTML) {
    const live = document.getElementById("live");
    if (live) { live.textContent = ""; setTimeout(() => (live.textContent = msg), 30); }
    const t = document.getElementById("toast");
    if (t && actionHTML !== undefined) {
      t.innerHTML = `<span>${esc(msg)}</span>${actionHTML || ""}`;
      t.classList.add("is-on");
      clearTimeout(t._h);
      t._h = setTimeout(() => t.classList.remove("is-on"), 4500);
    }
  }

  // ---------- events ----------
  function clampQty(scope, val) {
    if (scope === "pdp") {
      const x = pdpCtx();
      state.pdp.qty = Math.max(1, Math.min(val, Math.max(1, x.left)));
      renderBuy();
    } else if (scope === "qv") {
      const { p, v } = state.qv;
      state.qv.qty = Math.max(1, Math.min(val, Math.max(1, remaining(p, v))));
      renderQuick();
    }
  }
  function bind() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("button, a");
      if (!t) return;
      const ds = t.dataset;
      if ("close" in ds) { const d = t.closest("dialog"); if (d) d.close(); return; }
      if ("openCart" in ds) { openCart(t); return; }
      if ("openSearch" in ds) { openSearch(t); return; }
      if ("openNav" in ds) { openNav(t); return; }
      if (ds.category) { const d = t.closest("dialog"); if (d) d.close(); openCategory(ds.category, t); return; }
      if (ds.quick) { const d = t.closest("dialog"); if (d && d.id !== "dlg-qv") d.close(); openQuick(ds.quick, t); return; }
      if (ds.info) { e.preventDefault(); openInfo(ds.info, t); return; }
      if (ds.cartStep) { const line = state.cart.find((i) => i.handle + "|" + i.variantId === ds.cartStep); if (line) setLineQty(ds.cartStep, line.qty + Number(ds.d)); return; }
      if (ds.cartRemove) { removeLine(ds.cartRemove); announce("Item removed from cart"); const b = document.getElementById("cart-body"); const f = b && b.querySelector("button"); if (f) f.focus(); return; }
      if ("waCart" in ds) { openWhatsApp("cart", null, null, 0, t); return; }
      if (ds.wa) {
        let p, v, qty;
        if (ds.handle && state.qv && state.qv.p.handle === ds.handle) ({ p, v, qty } = state.qv);
        else if (state.pdp) { const x = pdpCtx(); p = x.p; v = x.v; qty = x.qty; }
        if (ds.wa === "general") { openWhatsApp("general", null, null, 0, t); return; }
        openWhatsApp(ds.wa, p, v, qty, t); return;
      }
      if (ds.qtyScope) { const cur = ds.qtyScope === "pdp" ? state.pdp.qty : state.qv.qty; clampQty(ds.qtyScope, cur + Number(ds.d)); const f = document.querySelector(`[data-qty-scope="${ds.qtyScope}"][data-d="${ds.d}"]`); if (f && !f.disabled) f.focus(); else { const i = document.getElementById(ds.qtyScope + "-qty"); if (i) i.focus(); } return; }
      if (ds.thumb != null) { state.pdp.img = Number(ds.thumb); renderGallery(); return; }
      if (ds.enlarge != null) { openLightbox(state.pdp.img, t); return; }
      if (ds.lb) { openLightbox(state.lightbox + Number(ds.lb), document.getElementById("dlg-lightbox")._opener); const f = document.querySelector(`[data-lb="${ds.lb}"]`); if (f) f.focus(); return; }
      if ("qvAdd" in ds) {
        const { p, v, qty } = state.qv;
        const n = addToCart(p, v, qty);
        if (n) { state.qv.qty = 1; renderQuick("[data-qv-add]"); announce(`Added ${n} × ${p.name} (${v.name}) to cart`, `<button type="button" class="link-btn" data-open-cart>View cart</button>`); }
        return;
      }
      if ("add" in ds) { doAdd(t); return; }
      if ("scrollTo" in ds) { const el = document.getElementById(ds.scrollTo); if (el) { el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); const h = el.querySelector("h2"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); } } return; }
    });
    document.addEventListener("change", (e) => {
      const t = e.target;
      if (t.name === "pdp-variant") {
        state.pdp.variantId = t.value; state.pdp.qty = 1; state.pdp.added = false;
        renderGallery(); renderBuy(`input[name="pdp-variant"][value="${t.value}"]`);
        announce(`${variant(state.pdp.p, t.value).name} selected. ${availability(state.pdp.p, variant(state.pdp.p, t.value)).text}`);
      }
      if (t.name === "qv-variant") {
        state.qv.v = variant(state.qv.p, t.value); state.qv.qty = 1;
        renderQuick(`input[name="qv-variant"][value="${t.value}"]`);
      }
      if (t.dataset && t.dataset.qtyInput) {
        const n = parseInt(t.value, 10);
        clampQty(t.dataset.qtyInput, isNaN(n) ? 1 : n);
        const i = document.getElementById(t.dataset.qtyInput + "-qty"); if (i) i.focus();
      }
    });
  }
  function doAdd(btn) {
    const x = pdpCtx();
    if (x.enquire || x.left <= 0) return;
    btn.disabled = true;
    btn.setAttribute("aria-busy", "true");
    btn.classList.add("is-loading");
    const label = btn.querySelector(".btn__label");
    if (label) label.textContent = "Adding…";
    setTimeout(() => {
      const n = addToCart(x.p, x.v, x.qty);
      state.pdp.qty = 1;
      state.pdp.added = n > 0;
      renderBuy();
      const msg = `Added ${n} × ${x.p.name} (${x.v.name}) to cart`;
      if (CTX.addFeedback === "drawer") { announce(msg); openCart(document.querySelector("[data-add]")); }
      else announce(msg, `<button type="button" class="link-btn" data-open-cart>View cart</button>`);
    }, 420);
  }
  function openNav(opener) {
    const d = dialogShell("dlg-nav", "Menu", `
      <nav aria-label="Mobile"><ul class="mnav">
        <li><button type="button" class="mnav__item" data-category="all">All products ${icon("chevron")}</button></li>
        ${C.categories.map((c) => `<li><button type="button" class="mnav__item" data-category="${c.id}">${esc(c.name)} ${icon("chevron")}</button></li>`).join("")}
      </ul>
      <ul class="mnav mnav--secondary">
        <li><button type="button" class="mnav__item" data-open-search>${icon("search")} Search</button></li>
        <li><button type="button" class="mnav__item" data-wa="general">${icon("chat")} Help on WhatsApp</button></li>
        <li><button type="button" class="mnav__item" data-info="delivery">Delivery</button></li>
        <li><button type="button" class="mnav__item" data-info="returns">Returns &amp; refunds</button></li>
      </ul></nav>`, "drawer drawer--left");
    openDialog(d, opener);
  }

  // ---------- sticky bar visibility ----------
  function setupSticky() {
    const bar = document.getElementById("sticky-buy");
    const target = document.getElementById("buybox");
    const footer = document.querySelector("footer");
    if (!bar || !target || !("IntersectionObserver" in window)) return;
    let buyVisible = true, footVisible = false;
    const update = () => {
      const show = !buyVisible && !footVisible;
      bar.classList.toggle("is-on", show);
      bar.setAttribute("aria-hidden", show ? "false" : "true");
      bar.inert = !show;
    };
    new IntersectionObserver((en) => { buyVisible = en[0].isIntersecting; update(); }, { rootMargin: "0px 0px -10% 0px" }).observe(target);
    if (footer) new IntersectionObserver((en) => { footVisible = en[0].isIntersecting; update(); }).observe(footer);
    update();
  }

  // ---------- init ----------
  const href = (page) => page + location.search;
  const API = { C, esc, fmt, href, inCart, remaining, product, variant, category, availability, productAvailability, firstAvailable, representative, modeOf, chip, qtyHTML, icon, productLink, img: (p, v, o) => HEImg.product(p, v, Object.assign({ theme: CTX.theme }, o || {})), scene: (n) => HEImg.scene(n, CTX.theme, C), framed: FRAMED, cartCount, cartSubtotal };
  function init(cfg) {
    T = cfg.templates;
    CTX = cfg;
    KEY = "he-preview-cart-" + cfg.dir;
    state.cart = load().filter((i) => product(i.handle));
    if (FRAMED) document.documentElement.classList.add("is-framed");
    if (cfg.page === "system") { bind(); if (cfg.after) cfg.after(API); return; }
    const app = document.getElementById("app");
    if (cfg.page === "product") {
      const p = representative();
      state.pdp = { p, variantId: firstAvailable(p).id, qty: 1, img: 0, added: false };
      document.title = `${p.name} — HomeEaseEssentials (design preview ${cfg.dir.toUpperCase()}, v3)`;
    }
    app.innerHTML = T.header(API) + `<main id="main" tabindex="-1">${cfg.page === "product" ? T.product(pdpCtx(), API) : T.home(API)}</main>` + T.footer(API) +
      `<div id="live" class="sr-only" aria-live="polite"></div><div id="toast" class="toast" role="status"></div>` +
      (FRAMED ? "" : `<a class="preview-pill" href="../index.html">Design preview ${cfg.dir.toUpperCase()} · v3 · sample data</a>`);
    if (cfg.page === "product") { renderGallery(); renderBuy(); setupSticky(); }
    refreshCartUI();
    bind();
    if (cfg.after) cfg.after(API);
    // screenshot helper: ?open=cart shows the drawer with two sample lines
    if (qs.get("open") === "cart") {
      if (!state.cart.length) { const t = representative(); addToCart(t, firstAvailable(t), 1); const m = product("speckled-ceramic-mug"); addToCart(m, variant(m, "forest"), 2); }
      openCart(document.querySelector("[data-open-cart]"));
    }
    // let the comparison shell reset the sample cart
    window.addEventListener("message", (e) => {
      if (e.data === "he-reset-cart") { state.cart = []; save(); refreshCartUI(); }
    });
  }

  window.HE = { init, api: () => API };
})();
