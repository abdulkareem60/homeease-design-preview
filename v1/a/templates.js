/* Direction A — Warm Everyday. Composition and markup only; data comes from shared/catalog.js. */
window.TEMPLATES_A = (function () {
  const header = (a) => `
    <a class="skip" href="#main">Skip to content</a>
    <div class="topline"><div class="wrap topline__in">
      <span>${a.icon("cash")} Cash on delivery available</span>
      <button type="button" class="link-btn topline__wa" data-wa="general">Questions? Message us on WhatsApp</button>
    </div></div>
    <header class="hdr"><div class="wrap hdr__in">
      <button type="button" class="icon-btn hdr__menu" data-open-nav aria-label="Open menu">${a.icon("menu")}</button>
      <a class="wordmark" href="${a.href("index.html")}" aria-label="HomeEaseEssentials home">Home<em>Ease</em>Essentials</a>
      <nav class="hdr__nav" aria-label="Main"><ul>
        ${a.C.categories.map((c) => `<li><button type="button" class="hdr__link" data-category="${c.id}">${a.esc(c.name)}</button></li>`).join("")}
      </ul></nav>
      <div class="hdr__tools">
        <button type="button" class="icon-btn" data-open-search aria-label="Search">${a.icon("search")}</button>
        <button type="button" class="icon-btn hdr__cart" data-open-cart data-cart-label aria-label="Cart">${a.icon("bag")}<span class="badge-count" data-cart-count hidden>0</span></button>
      </div>
    </div></header>`;

  function card(p, a) {
    const v = a.firstAvailable(p);
    const av = a.productAvailability(p);
    const opts = p.variants.length > 1 ? `${p.variants.length} colours` : p.variants[0].name === "White" || p.variants.length === 1 ? "" : "";
    const action = a.modeOf(p) === "enquire" ? "Check availability" : p.variants.length > 1 ? "Choose colour" : "Quick add";
    return `<li class="card">
      ${a.productLink(p, `<span class="card__media ph ratio-1">${a.img(p, v, { theme: "warm" })}</span>`, "card__imglink", ' tabindex="-1" aria-hidden="true"')}
      <div class="card__body">
        <h3 class="card__title">${a.productLink(p, a.esc(p.name), "card__link")}</h3>
        <p class="card__price">${a.fmt(p.price)}</p>
        <p class="card__meta"><span class="avail avail--${av.key}">${av.text}</span>${opts ? `<span class="card__opts">${opts}</span>` : ""}</p>
        ${p.representative ? "" : `<button type="button" class="card__action" data-quick="${p.handle}">${action}<span class="sr-only">: ${a.esc(p.name)}</span></button>`}
      </div></li>`;
  }

  function home(a) {
    const P = (h) => a.product(h);
    const tray = P("velvet-jewellery-organiser-tray"), mug = P("insulated-steel-mug-350ml"), lights = P("warm-led-string-lights-10m");
    const tile = (p, vi, cls, crop) => a.productLink(p, `
        <span class="hero__img ph">${a.img(p, p.variants[vi], { theme: "warm", crop })}</span>
        <span class="hero__tag"><span>${a.esc(p.name)}</span><strong>${a.fmt(p.price)}</strong></span>`, "hero__tile " + cls);
    const featured = a.C.products.filter((p) => p.handle !== "bamboo-bath-caddy" || true).sort((x, y) => y.added - x.added).slice(0, 8);
    const counts = (id) => a.C.products.filter((p) => p.category === id).length;
    const catImg = { organisation: ["stackable-drawer-organiser-set", 0], mugs: ["insulated-tumbler-straw-600ml", 0], lighting: ["adjustable-desk-lamp-usb", 1], bath: ["ceramic-soap-dispenser-set", 1] };
    const desk = ["adjustable-desk-lamp-usb", "insulated-steel-mug-350ml", "stackable-drawer-organiser-set"].map(P);
    return `
    <section class="hero wrap" aria-labelledby="hero-title">
      <div class="hero__text">
        <p class="eyebrow">Home, desk &amp; self-care essentials</p>
        <h1 class="hero__title" id="hero-title">Small things that make home easier.</h1>
        <p class="hero__lead">Organisers, insulated mugs, lamps and bathroom pieces, chosen for everyday use and priced to stay practical.</p>
        <div class="hero__actions">
          <button type="button" class="btn btn--primary" data-scroll-to="featured">Shop new arrivals</button>
          <button type="button" class="btn btn--secondary" data-wa="general">${a.icon("chat")} Ask on WhatsApp</button>
        </div>
      </div>
      <div class="hero__media">
        ${tile(tray, 0, "hero__tile--main", "square")}
        ${tile(mug, 1, "hero__tile--a", "square")}
        ${tile(lights, 0, "hero__tile--b", "square")}
      </div>
    </section>

    <section class="section wrap" id="featured" aria-labelledby="featured-title">
      <div class="section__head">
        <h2 class="section__title" id="featured-title">New in the shop</h2>
        <button type="button" class="link-btn section__more" data-category="all">See all ${a.C.products.length} products</button>
      </div>
      <ul class="pgrid">${featured.map((p) => card(p, a)).join("")}</ul>
    </section>

    <section class="section section--tint" aria-labelledby="cats-title">
      <div class="wrap">
        <div class="section__head"><h2 class="section__title" id="cats-title">Shop by room and routine</h2></div>
        <ul class="cats">
          ${a.C.categories.map((c) => { const [h, vi] = catImg[c.id]; const p = P(h); return `<li>
            <button type="button" class="cat" data-category="${c.id}">
              <span class="cat__img ph">${a.img(p, p.variants[vi], { theme: "warm", crop: "square" })}</span>
              <span class="cat__name">${a.esc(c.name)} <span class="cat__count">${counts(c.id)}</span></span>
              <span class="cat__blurb">${a.esc(c.blurb)}</span>
            </button></li>`; }).join("")}
        </ul>
      </div>
    </section>

    <section class="section wrap story" aria-labelledby="story-title">
      <div class="story__media ph ratio-169">${a.scene("desk")}</div>
      <div class="story__text">
        <p class="eyebrow">In use</p>
        <h2 class="section__title" id="story-title">A desk that works after dark</h2>
        <p>Light where you need it, a drink that stays warm with the lid on, and a drawer where chargers and pens stop drifting.</p>
        <ul class="story__list">
          ${desk.map((p) => `<li>${a.productLink(p, `<span>${a.esc(p.name)}</span><strong>${a.fmt(p.price)}</strong>`, "story__item")}</li>`).join("")}
        </ul>
      </div>
    </section>

    <section class="section wrap howto" aria-labelledby="how-title">
      <div class="howto__steps">
        <h2 class="section__title" id="how-title">How ordering works</h2>
        <ol class="steps">
          <li><span class="steps__n">1</span><div><h3>Order here or on WhatsApp</h3><p>Add items to your cart, or send us a message with what you need.</p></div></li>
          <li><span class="steps__n">2</span><div><h3>We confirm before packing</h3><p>For cash on delivery, we call or message you to confirm the order and address.</p></div></li>
          <li><span class="steps__n">3</span><div><h3>Pay when it arrives</h3><p>Pay cash on delivery. The delivery charge is shown at checkout before you order.</p></div></li>
        </ol>
      </div>
      <aside class="help" aria-labelledby="help-title">
        <h2 class="help__title" id="help-title">Not sure it will fit?</h2>
        <p>Send us the product name and your question. We will reply on WhatsApp.</p>
        <button type="button" class="btn btn--primary" data-wa="general">${a.icon("chat")} Message us on WhatsApp</button>
      </aside>
    </section>`;
  }

  const footer = (a) => `
    <footer class="ftr"><div class="wrap ftr__in">
      <div class="ftr__brand">
        <p class="wordmark wordmark--light">Home<em>Ease</em>Essentials</p>
        <p>Practical home and lifestyle products for everyday use. Prices in PKR.</p>
        <button type="button" class="btn btn--light" data-wa="general">${a.icon("chat")} WhatsApp us</button>
      </div>
      <nav class="ftr__col" aria-label="Shop"><h2>Shop</h2><ul>${a.C.categories.map((c) => `<li><button type="button" class="link-btn" data-category="${c.id}">${a.esc(c.name)}</button></li>`).join("")}</ul></nav>
      <nav class="ftr__col" aria-label="Help"><h2>Help</h2><ul>
        <li><button type="button" class="link-btn" data-info="delivery">Delivery</button></li>
        <li><button type="button" class="link-btn" data-info="returns">Returns &amp; refunds</button></li>
        <li><button type="button" class="link-btn" data-info="faq">FAQ</button></li>
        <li><button type="button" class="link-btn" data-info="contact">Contact</button></li></ul></nav>
      <nav class="ftr__col" aria-label="About"><h2>About</h2><ul>
        <li><button type="button" class="link-btn" data-info="about">Our story</button></li>
        <li><button type="button" class="link-btn" data-info="privacy">Privacy policy</button></li>
        <li><button type="button" class="link-btn" data-info="terms">Terms</button></li></ul></nav>
    </div>
    <div class="wrap ftr__base"><p>© HomeEaseEssentials</p><p>Cash on delivery available</p></div></footer>`;

  function gallery(x, a) {
    const views = x.p.views;
    const cur = views[x.img];
    return `
      <div class="gallery__main ph ratio-1">
        ${a.img(x.p, x.v, { view: cur.id, theme: "warm" })}
        <button type="button" class="gallery__zoom" data-enlarge="${x.img}" aria-label="Enlarge image: ${a.esc(cur.label)}">${a.icon("expand")}<span>Enlarge</span></button>
      </div>
      <ul class="gallery__thumbs">
        ${views.map((v, i) => `<li><button type="button" class="thumb${i === x.img ? " is-current" : ""}" data-thumb="${i}" aria-label="Show image ${i + 1} of ${views.length}: ${a.esc(v.label)}" aria-pressed="${i === x.img}">
          <span class="ph ratio-1">${a.img(x.p, x.v, { view: v.id, theme: "warm" })}</span></button></li>`).join("")}
      </ul>`;
  }

  function buyBox(x, a) {
    const p = x.p, v = x.v;
    const already = a.inCart(p, v);
    let actions;
    if (x.enquire) {
      actions = `<div class="enquire">
          <p class="enquire__title">Availability needs confirmation</p>
          <p>We confirm stock and dispatch time for this item on WhatsApp before you order. Your message will include the colour you choose.</p>
          <button type="button" class="btn btn--primary btn--block" data-wa="availability">${a.icon("chat")} Check availability on WhatsApp</button>
        </div>`;
    } else if (v.stock <= 0) {
      actions = `<div class="buy">
          <button type="button" class="btn btn--primary btn--block" disabled>Sold out in ${a.esc(v.name)}</button>
          <button type="button" class="btn btn--secondary btn--block" data-wa="restock">${a.icon("chat")} Ask about restock</button>
        </div>`;
    } else {
      const full = x.left <= 0;
      actions = `<div class="buy">
          <div class="buy__row">
            ${full ? "" : a.qtyHTML("pdp", x.qty, x.left)}
            <button type="button" class="btn btn--primary buy__add" data-add ${full ? "disabled" : ""}><span class="btn__label">${full ? "All available units are in your cart" : "Add to cart"}</span></button>
          </div>
          ${already ? `<p class="note">${already} in your cart${full ? "" : ` · ${x.left} more available`}.</p>` : x.qty >= x.left ? `<p class="note">Maximum available: ${x.left}</p>` : ""}
          <button type="button" class="btn btn--secondary btn--block" data-wa="product">${a.icon("chat")} Ask on WhatsApp</button>
        </div>`;
    }
    return `
      <p class="pdp__price">${a.fmt(p.price)}</p>
      <p class="avail avail--${x.a.key} pdp__avail">${x.a.text}</p>
      <fieldset class="opts">
        <legend class="opts__legend">Colour: <strong>${a.esc(v.name)}</strong></legend>
        <div class="opts__list">${p.variants.map((o) => a.chip(o, o.id === v.id, "pdp-variant", p)).join("")}</div>
      </fieldset>
      ${actions}
      <ul class="assure">
        <li>${a.icon("cash")} Cash on delivery available</li>
        <li>${a.icon("phone")} We confirm COD orders by phone or WhatsApp before packing</li>
        <li>${a.icon("truck")} Delivery charge shown at checkout, before you order</li>
      </ul>`;
  }

  function product(x, a) {
    const p = x.p;
    const cat = a.category(p.category);
    const related = ["stackable-drawer-organiser-set", "ceramic-soap-dispenser-set", "insulated-steel-mug-350ml", "warm-led-string-lights-10m"].map(a.product);
    const specs = Object.entries(p.specs).map(([k, v]) => `<div><dt>${a.esc(k)}</dt><dd>${a.esc(v)}</dd></div>`).join("");
    return `
    <div class="wrap pdp">
      <nav class="crumbs" aria-label="Breadcrumb"><ol>
        <li><a href="${a.href("index.html")}">Home</a></li>
        <li><button type="button" class="link-btn" data-category="${cat.id}">${a.esc(cat.name)}</button></li>
        <li aria-current="page">${a.esc(p.name)}</li></ol></nav>
      <div class="pdp__grid">
        <section id="gallery" class="gallery" aria-label="Product images"></section>
        <div class="pdp__info">
          <h1 class="pdp__title">${a.esc(p.name)}</h1>
          <p class="pdp__summary">${a.esc(p.summary)}</p>
          <div id="buybox" class="buybox"></div>
          <ul class="benefits">${p.details.map((d) => `<li>${a.icon("check")} ${a.esc(d)}</li>`).join("")}</ul>
          <div class="disc">
            <details open><summary>Details and dimensions</summary><dl class="specs">${specs}</dl></details>
            <details><summary>What's included</summary><p>${a.esc(p.included)}</p></details>
            <details><summary>Care</summary><p>${a.esc(p.care)}</p></details>
            <details><summary>Delivery <span class="prov">Provisional</span></summary><p>Delivery charges, areas and timelines will be confirmed after courier selection. The full delivery charge is shown at checkout before you place an order.</p></details>
            <details><summary>Returns and refunds <span class="prov">Provisional</span></summary><p>Our returns policy is being finalised and is not yet published. Please ask on WhatsApp before ordering if you have questions.</p></details>
          </div>
        </div>
      </div>
      <section class="section related" aria-labelledby="rel-title">
        <div class="section__head"><h2 class="section__title" id="rel-title">Also useful around the home</h2></div>
        <ul class="pgrid">${related.map((r) => card(r, a)).join("")}</ul>
      </section>
    </div>`;
  }

  return { header, home, footer, product, gallery, buyBox, card };
})();
