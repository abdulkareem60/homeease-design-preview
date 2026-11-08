/* Direction B — Clear & Practical. Composition and markup only; data comes from shared/catalog.js. */
window.TEMPLATES_B = (function () {
  const count = (a, id) => a.C.products.filter((p) => p.category === id).length;

  const header = (a) => `
    <a class="skip" href="#main">Skip to content</a>
    <header class="hdr">
      <div class="wrap hdr__row">
        <button type="button" class="icon-btn hdr__menu" data-open-nav aria-label="Open menu">${a.icon("menu")}</button>
        <a class="wordmark" href="${a.href("index.html")}" aria-label="HomeEaseEssentials home"><b>HomeEase</b>Essentials</a>
        <button type="button" class="hdr__search" data-open-search>${a.icon("search")}<span>Search organisers, mugs, lamps…</span></button>
        <div class="hdr__tools">
          <button type="button" class="hdr__help" data-wa="general">${a.icon("chat")}<span>Help</span></button>
          <button type="button" class="hdr__cart" data-open-cart data-cart-label aria-label="Cart">${a.icon("bag")}<span class="hdr__cart-text">Cart</span><span class="badge-count" data-cart-count hidden>0</span><span class="hdr__sub" data-cart-subtotal></span></button>
        </div>
      </div>
      <nav class="catbar" aria-label="Categories"><div class="wrap"><ul class="catbar__list">
        <li><button type="button" class="catbar__link" data-category="all">All <span>${a.C.products.length}</span></button></li>
        ${a.C.categories.map((c) => `<li><button type="button" class="catbar__link" data-category="${c.id}">${a.esc(c.name)} <span>${count(a, c.id)}</span></button></li>`).join("")}
      </ul></div></nav>
    </header>`;

  function cardAction(p, a) {
    if (a.modeOf(p) === "enquire") return `<button type="button" class="btn btn--secondary btn--block btn--sm" data-quick="${p.handle}">Check availability<span class="sr-only">: ${a.esc(p.name)}</span></button>`;
    if (p.representative) return `<a class="btn btn--secondary btn--block btn--sm" href="product.html${location.search}">${p.variants.length > 1 ? "Select colour" : "View details"}<span class="sr-only">: ${a.esc(p.name)}</span></a>`;
    return `<button type="button" class="btn btn--secondary btn--block btn--sm" data-quick="${p.handle}">${p.variants.length > 1 ? "Select option" : "Add to cart"}<span class="sr-only">: ${a.esc(p.name)}</span></button>`;
  }
  function card(p, a) {
    const v = a.firstAvailable(p);
    const av = a.productAvailability(p);
    const spec = p.cardSpec || Object.values(p.specs)[0];
    return `<li class="card" data-cat="${p.category}">
      ${a.productLink(p, `<span class="card__media ph ratio-1">${a.img(p, v, { theme: "soft" })}</span>`, "card__imglink", ' tabindex="-1" aria-hidden="true"')}
      <div class="card__body">
        <p class="card__cat">${a.esc(a.category(p.category).name)}</p>
        <h3 class="card__title">${a.productLink(p, a.esc(p.name), "card__link")}</h3>
        <p class="card__spec">${a.esc(spec)}</p>
        ${p.variants.length > 1 ? `<p class="card__swatches" aria-label="${p.variants.length} options: ${p.variants.map((x) => a.esc(x.name)).join(", ")}">${p.variants.map((x) => `<span style="background:${x.color}"></span>`).join("")}</p>` : `<p class="card__swatches card__swatches--none"></p>`}
        <div class="card__foot">
          <p class="card__price">${a.fmt(p.price)}</p>
          <p class="avail avail--${av.key}">${av.text}</p>
        </div>
        ${cardAction(p, a)}
      </div></li>`;
  }

  function home(a) {
    const P = (h) => a.product(h);
    const mug = P("speckled-ceramic-mug"), tumbler = P("vacuum-flask");
    const catThumb = { organisation: "travel-jewellery-organiser-box", mugs: "speckled-ceramic-mug", lighting: "dome-desk-lamp", bath: "ribbed-glass-soap-dispenser" };
    const products = a.C.products.slice().sort((x, y) => y.added - x.added).slice(0, 8);
    const row = (label, f) => `<tr><th scope="row">${label}</th><td>${f(mug)}</td><td>${f(tumbler)}</td></tr>`;
    return `
    <section class="intro wrap" aria-labelledby="intro-title">
      <div class="intro__text">
        <h1 class="intro__title" id="intro-title">Practical home essentials, clearly priced.</h1>
        <p class="intro__lead">Organisers, drinkware, lighting and bath pieces, with sizes, materials and stock shown up front.</p>
        <ul class="facts">
          <li>${a.icon("cash")}<span><b>Cash on delivery</b> available</span></li>
          <li>${a.icon("phone")}<span><b>COD orders confirmed</b> by phone or WhatsApp before packing</span></li>
          <li>${a.icon("chat")}<span><b>Order on WhatsApp</b> if you prefer to chat</span></li>
        </ul>
      </div>
      <nav class="catindex" aria-label="Shop by category">
        <p class="catindex__label">Shop by category</p>
        <ul>${a.C.categories.map((c) => { const p = P(catThumb[c.id]); return `<li><button type="button" class="catindex__item" data-category="${c.id}">
          <span class="catindex__img ph">${a.img(p, a.firstAvailable(p), { theme: "soft" })}</span>
          <span class="catindex__name">${a.esc(c.name)}</span><span class="catindex__count">${count(a, c.id)} items</span>${a.icon("chevron")}</button></li>`; }).join("")}</ul>
      </nav>
    </section>

    <section class="section wrap" id="products" aria-labelledby="products-title">
      <div class="section__head">
        <h2 class="section__title" id="products-title">New arrivals</h2>
        <button type="button" class="link-btn" data-category="all">See all ${a.C.products.length} products</button>
      </div>
      <ul class="pgrid" id="grid">${products.map((p) => card(p, a)).join("")}</ul>
    </section>

    <section class="section wrap compare" aria-labelledby="cmp-title">
      <div class="compare__head">
        <h2 class="section__title" id="cmp-title">Mug or flask?</h2>
        <p>Choose by where you drink: at a desk, or on the move.</p>
      </div>
      <div class="compare__scroll" tabindex="0" role="region" aria-label="Drinkware comparison">
      <table class="cmp">
        <thead><tr><th scope="col"><span class="sr-only">Feature</span></th>
          <th scope="col">${a.productLink(mug, `<span class="cmp__img ph">${a.img(mug, mug.variants[0], { theme: "soft" })}</span><span>${a.esc(mug.name)}</span>`, "cmp__prod")}</th>
          <th scope="col">${a.productLink(tumbler, `<span class="cmp__img ph">${a.img(tumbler, tumbler.variants[0], { theme: "soft" })}</span><span>${a.esc(tumbler.name)}</span>`, "cmp__prod")}</th></tr></thead>
        <tbody>
          ${row("Best for", (p) => (p === mug ? "Tea or coffee at home or at a desk" : "Hot tea on the commute or outdoors"))}
          ${row("Capacity", (p) => p.specs.Capacity)}
          ${row("Size", (p) => p.specs.Size)}
          ${row("Lid", (p) => (p === mug ? "No lid" : "Screw lid doubles as a cup"))}
          ${row("Material", (p) => p.specs.Material)}
          ${row("Price", (p) => `<b>${a.fmt(p.price)}</b>`)}
        </tbody>
      </table></div>
    </section>

    <section class="section wrap order" aria-labelledby="order-title">
      <h2 class="section__title" id="order-title">How ordering works</h2>
      <ol class="order__steps">
        <li><span class="order__n">01</span><h3>Choose and check out</h3><p>Guest checkout. The delivery charge is shown before you place the order.</p></li>
        <li><span class="order__n">02</span><h3>We confirm COD orders</h3><p>We call or message you on WhatsApp to confirm items and address before packing.</p></li>
        <li><span class="order__n">03</span><h3>Pay on delivery</h3><p>Pay cash when the parcel arrives. Online bank payment is planned for later.</p></li>
        <li class="order__help"><h3>Prefer to order by chat?</h3><p>Send the product name and option on WhatsApp.</p><button type="button" class="btn btn--primary btn--sm" data-wa="general">${a.icon("chat")} WhatsApp us</button></li>
      </ol>
    </section>`;
  }

  const footer = (a) => `
    <footer class="ftr"><div class="wrap ftr__in">
      <div class="ftr__brand"><p class="wordmark"><b>HomeEase</b>Essentials</p><p>Practical home and lifestyle products. Prices in PKR. Cash on delivery available.</p></div>
      <nav aria-label="Shop"><h2>Shop</h2><ul>${a.C.categories.map((c) => `<li><button type="button" class="link-btn" data-category="${c.id}">${a.esc(c.name)}</button></li>`).join("")}</ul></nav>
      <nav aria-label="Help"><h2>Help</h2><ul>
        <li><button type="button" class="link-btn" data-wa="general">WhatsApp</button></li>
        <li><button type="button" class="link-btn" data-info="contact">Contact</button></li>
        <li><button type="button" class="link-btn" data-info="delivery">Delivery</button></li>
        <li><button type="button" class="link-btn" data-info="returns">Returns &amp; refunds</button></li>
        <li><button type="button" class="link-btn" data-info="faq">FAQ</button></li></ul></nav>
      <nav aria-label="Company"><h2>Company</h2><ul>
        <li><button type="button" class="link-btn" data-info="about">About</button></li>
        <li><button type="button" class="link-btn" data-info="privacy">Privacy policy</button></li>
        <li><button type="button" class="link-btn" data-info="terms">Terms</button></li></ul></nav>
    </div><div class="wrap ftr__base">© HomeEaseEssentials</div></footer>`;

  function gallery(x, a) {
    const views = x.p.views, cur = views[x.img];
    return `
      <ul class="gallery__thumbs">
        ${views.map((v, i) => `<li><button type="button" class="thumb${i === x.img ? " is-current" : ""}" data-thumb="${i}" aria-label="Show image ${i + 1} of ${views.length}: ${a.esc(v.label)}" aria-pressed="${i === x.img}">
          <span class="ph ratio-1">${a.img(x.p, x.v, { view: v.id, theme: "soft", sizes: "120px" })}</span></button></li>`).join("")}
      </ul>
      <div class="gallery__main ph ratio-1">
        ${a.img(x.p, x.v, { view: cur.id, theme: "soft", eager: true, sizes: "(min-width: 900px) 50vw, 100vw" })}
        <p class="gallery__count" aria-hidden="true">${x.img + 1} / ${views.length}</p>
        <button type="button" class="gallery__zoom" data-enlarge="${x.img}" aria-label="Enlarge image: ${a.esc(cur.label)}">${a.icon("expand")}</button>
      </div>`;
  }

  function buyBox(x, a) {
    const p = x.p, v = x.v;
    const already = a.inCart(p, v);
    let actions;
    if (x.enquire) {
      actions = `<div class="enquire" role="note">
          <p><b>Availability needs confirmation.</b> We confirm stock and dispatch time on WhatsApp before you order.</p>
          <button type="button" class="btn btn--primary btn--block" data-wa="availability">${a.icon("chat")} Check availability on WhatsApp</button></div>`;
    } else if (v.stock <= 0) {
      actions = `<div class="buy"><button type="button" class="btn btn--primary btn--block" disabled>Sold out in ${a.esc(v.name)}</button>
          <button type="button" class="btn btn--ghost btn--block" data-wa="restock">${a.icon("chat")} Ask about restock on WhatsApp</button></div>`;
    } else {
      const full = x.left <= 0;
      actions = `<div class="buy">
          <div class="buy__row">${full ? "" : a.qtyHTML("pdp", x.qty, x.left)}
            <button type="button" class="btn btn--primary buy__add" data-add ${full ? "disabled" : ""}><span class="btn__label">${full ? "All available units in cart" : `Add to cart · ${a.fmt(p.price * x.qty)}`}</span></button></div>
          ${already ? `<p class="note">${already} in cart${full ? "" : ` · ${x.left} more available`}</p>` : x.qty >= x.left ? `<p class="note">Maximum available: ${x.left}</p>` : ""}
          <button type="button" class="btn btn--ghost btn--block" data-wa="product">${a.icon("chat")} Ask a question on WhatsApp</button></div>`;
    }
    return `
      <div class="pdp__pricerow"><p class="pdp__price">${a.fmt(p.price)}</p><p class="avail avail--${x.a.key}">${x.a.text}</p></div>
      <fieldset class="opts">
        <legend class="opts__legend">Colour: <strong>${a.esc(v.name)}</strong></legend>
        <div class="opts__list">${p.variants.map((o) => a.chip(o, o.id === v.id, "pdp-variant", p)).join("")}</div>
      </fieldset>
      ${actions}`;
  }

  function stickyBar(x, a) {
    const p = x.p, v = x.v;
    let btn;
    if (x.enquire) btn = `<button type="button" class="btn btn--primary btn--sm" data-wa="availability">Check availability</button>`;
    else if (v.stock <= 0) btn = `<button type="button" class="btn btn--primary btn--sm" disabled>Sold out</button>`;
    else btn = `<button type="button" class="btn btn--primary btn--sm" data-add ${x.left <= 0 ? "disabled" : ""}><span class="btn__label">${x.left <= 0 ? "In cart" : "Add to cart"}</span></button>`;
    return `<div class="sticky-buy__in"><div class="sticky-buy__text"><p class="sticky-buy__name">${a.esc(p.name)}</p><p class="sticky-buy__meta">${a.esc(v.name)} · ${a.fmt(p.price)}</p></div>${btn}</div>`;
  }

  function product(x, a) {
    const p = x.p, cat = a.category(p.category);
    const related = ["woven-storage-box", "ribbed-glass-soap-dispenser", "speckled-ceramic-mug", "dome-desk-lamp"].map(a.product);
    const glance = Object.assign({}, p.specs, { Included: p.included });
    return `
    <div class="wrap pdp">
      <nav class="crumbs" aria-label="Breadcrumb"><ol>
        <li><a href="${a.href("index.html")}">Home</a></li>
        <li><button type="button" class="link-btn" data-category="${cat.id}">${a.esc(cat.name)}</button></li>
        <li aria-current="page">${a.esc(p.name)}</li></ol></nav>
      <div class="pdp__grid">
        <section id="gallery" class="gallery" aria-label="Product images"></section>
        <div class="pdp__info">
          <p class="pdp__sku">${a.esc(cat.name)} · <span id="pdp-sku">SKU ${a.esc(x.v.sku)}</span></p>
          <h1 class="pdp__title">${a.esc(p.name)}</h1>
          <p class="pdp__summary">${a.esc(p.summary)}</p>
          <div id="buybox" class="buybox"></div>
          <ul class="facts facts--compact">
            <li>${a.icon("cash")}<span>Cash on delivery available</span></li>
            <li>${a.icon("phone")}<span>COD orders confirmed before packing</span></li>
            <li>${a.icon("truck")}<span>Delivery charge shown at checkout</span></li>
          </ul>
          <h2 class="glance__title">At a glance</h2>
          <dl class="glance">${Object.entries(glance).map(([k, v]) => `<div><dt>${a.esc(k)}</dt><dd>${a.esc(v)}</dd></div>`).join("")}</dl>
          <ul class="benefits">${p.details.map((d) => `<li>${a.esc(d)}</li>`).join("")}</ul>
          <div class="disc">
            <details><summary>Care</summary><p>${a.esc(p.care)}</p></details>
            <details><summary>Delivery <span class="prov">Provisional</span></summary><p>Delivery charges, areas and timelines will be confirmed after courier selection. The full delivery charge is shown at checkout before you place an order.</p></details>
            <details><summary>Returns and refunds <span class="prov">Provisional</span></summary><p>Our returns policy is being finalised and is not yet published. Please ask on WhatsApp before ordering if you have questions.</p></details>
          </div>
        </div>
      </div>
      <section class="section related" aria-labelledby="rel-title">
        <div class="section__head"><h2 class="section__title" id="rel-title">More for the same room</h2></div>
        <ul class="pgrid pgrid--related">${related.map((r) => card(r, a)).join("")}</ul>
      </section>
    </div>
    <div id="sticky-buy" class="sticky-buy" aria-hidden="true" aria-label="Quick purchase"></div>`;
  }

  function after() {
    if (document.getElementById("sticky-buy")) document.body.classList.add("has-sticky");
  }

  return { header, home, footer, product, gallery, buyBox, stickyBar, after, card };
})();
