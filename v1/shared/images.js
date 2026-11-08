/*
  Generated sample product renders (SVG), drawn in code for this preview.
  They stand in for real product photography, which is not yet available.
  Every image is labelled "sample render" in its accessible name.
  Replace with the owner's real product photos before launch.
*/
(function () {
  let uid = 0;
  const nid = (p) => `${p}${++uid}`;

  // ---------- colour helpers ----------
  function rgb(hex) {
    const h = hex.replace("#", "");
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  }
  function hex(r) {
    return "#" + r.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
  }
  // t > 0 lightens toward white, t < 0 darkens toward black
  function shade(c, t) {
    const [r, g, b] = rgb(c);
    const target = t > 0 ? 255 : 0;
    const k = Math.abs(t);
    return hex([r + (target - r) * k, g + (target - g) * k, b + (target - b) * k]);
  }
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  // bilinear point inside quad TL,TR,BR,BL
  function quadPoint(q, u, v) {
    const top = lerp(q[0], q[1], u);
    const bot = lerp(q[3], q[2], u);
    return lerp(top, bot, v);
  }
  const pts = (arr) => arr.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  function subQuad(q, u0, u1, v0, v1) {
    return [quadPoint(q, u0, v0), quadPoint(q, u1, v0), quadPoint(q, u1, v1), quadPoint(q, u0, v1)];
  }

  // ---------- shared defs ----------
  function cylGrad(id, c) {
    return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${shade(c, -0.3)}"/>
      <stop offset="0.16" stop-color="${shade(c, -0.04)}"/>
      <stop offset="0.3" stop-color="${shade(c, 0.2)}"/>
      <stop offset="0.42" stop-color="${shade(c, 0.06)}"/>
      <stop offset="0.78" stop-color="${shade(c, -0.14)}"/>
      <stop offset="1" stop-color="${shade(c, -0.34)}"/>
    </linearGradient>`;
  }
  function goldGrad(id) {
    return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F0DDA0"/><stop offset="0.45" stop-color="#C39A45"/>
      <stop offset="0.7" stop-color="#E8CF88"/><stop offset="1" stop-color="#A9822F"/></linearGradient>`;
  }
  function steelGrad(id) {
    return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#9DA2A6"/><stop offset="0.3" stop-color="#F3F4F5"/>
      <stop offset="0.55" stop-color="#C5C9CC"/><stop offset="1" stop-color="#8E9397"/></linearGradient>`;
  }
  function blur(id, sd) {
    return `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
  }

  // ---------- backdrops ----------
  const THEMES = {
    warm: { top: "#F2EBE1", mid: "#ECE3D7", table: "#E3D6C5", tableEnd: "#DCCDBA", line: true },
    clean: { top: "#F5F6F4", mid: "#F1F2F0", table: "#ECEEEB", tableEnd: "#E7E9E5", line: false }
  };
  function backdrop(theme, W, H, horizon) {
    const t = THEMES[theme] || THEMES.clean;
    const id = nid("bg");
    const hz = horizon == null ? 0.6 : horizon;
    const stops = t.line
      ? `<stop offset="0" stop-color="${t.top}"/><stop offset="${hz}" stop-color="${t.mid}"/>
         <stop offset="${hz + 0.002}" stop-color="${t.table}"/><stop offset="1" stop-color="${t.tableEnd}"/>`
      : `<stop offset="0" stop-color="${t.top}"/><stop offset="0.7" stop-color="${t.mid}"/><stop offset="1" stop-color="${t.tableEnd}"/>`;
    return {
      defs: `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${H}">${stops}</linearGradient>`,
      body: `<rect x="${-W / 2}" y="${-H / 2}" width="${W * 2}" height="${H * 2}" fill="url(#${id})"/>`
    };
  }
  function shadow(cx, cy, rx, ry, op, sd) {
    const f = nid("sh");
    return {
      defs: blur(f, sd || 14),
      body: `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#3A2C20" opacity="${op || 0.22}" filter="url(#${f})"/>`
    };
  }

  // ---------- generic open tray (rim + inner floor + front face) ----------
  function openTray(q, depth, c, o) {
    o = o || {};
    const g = nid("tf"), fl = nid("fl");
    const front = [q[3], q[2], [q[2][0], q[2][1] + depth], [q[3][0], q[3][1] + depth]];
    const inner = subQuad(q, o.iu || 0.045, 1 - (o.iu || 0.045), o.iv || 0.09, 1 - (o.iv || 0.09));
    const rimW = o.rimStroke || 14;
    const defs = `<linearGradient id="${g}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${shade(c, -0.3)}"/><stop offset="0.5" stop-color="${shade(c, -0.17)}"/>
        <stop offset="1" stop-color="${shade(c, -0.32)}"/></linearGradient>
      <radialGradient id="${fl}" cx="0.5" cy="0.45" r="0.7">
        <stop offset="0" stop-color="${shade(c, o.floorLight != null ? o.floorLight : -0.04)}"/>
        <stop offset="1" stop-color="${shade(c, o.floorDark != null ? o.floorDark : -0.2)}"/></radialGradient>`;
    const body = `
      <polygon points="${pts(front)}" fill="url(#${g})" stroke="url(#${g})" stroke-width="${rimW}" stroke-linejoin="round"/>
      <polygon points="${pts(q)}" fill="${shade(c, 0.1)}" stroke="${shade(c, 0.1)}" stroke-width="${rimW}" stroke-linejoin="round"/>
      <polygon points="${pts(inner)}" fill="url(#${fl})" stroke="${shade(c, -0.26)}" stroke-width="2" stroke-opacity="0.45" stroke-linejoin="round"/>
      <polyline points="${pts([inner[3], inner[0], inner[1]])}" fill="none" stroke="${shade(c, -0.32)}" stroke-width="5" stroke-opacity="0.28" stroke-linejoin="round"/>`;
    return { defs, body, inner };
  }

  // ---------- jewellery tray ----------
  function trayContents(inner, c, sy, gold, s) {
    // sy: vertical foreshortening for round items, s: size scale
    const P = (u, v) => quadPoint(inner, u, v);
    let out = "";
    const divider = (a, b, w) => {
      const pa = P(a[0], a[1]), pb = P(b[0], b[1]);
      out += `<line x1="${pa[0]}" y1="${pa[1] + 4 * sy}" x2="${pb[0]}" y2="${pb[1] + 4 * sy}" stroke="${shade(c, -0.35)}" stroke-opacity="0.35" stroke-width="${w}" stroke-linecap="round"/>`;
      out += `<line x1="${pa[0]}" y1="${pa[1]}" x2="${pb[0]}" y2="${pb[1]}" stroke="${shade(c, 0.12)}" stroke-width="${w}" stroke-linecap="round"/>`;
    };
    // ring roll (right 38%)
    for (let i = 0; i < 6; i++) {
      const v = 0.1 + i * 0.16;
      const a = P(0.66, v), b = P(0.97, v);
      out += `<line x1="${a[0]}" y1="${a[1] + 3}" x2="${b[0]}" y2="${b[1] + 3}" stroke="${shade(c, -0.3)}" stroke-width="${17 * s}" stroke-linecap="round" opacity="0.5"/>`;
      out += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${shade(c, -0.02)}" stroke-width="${15 * s}" stroke-linecap="round"/>`;
      out += `<line x1="${a[0]}" y1="${a[1] - 4 * s}" x2="${b[0]}" y2="${b[1] - 4 * s}" stroke="${shade(c, 0.22)}" stroke-width="${3 * s}" stroke-linecap="round" opacity="0.8"/>`;
    }
    // rings seated between rolls
    [[0.74, 0.18, true], [0.86, 0.34, false], [0.76, 0.5, false], [0.9, 0.66, true], [0.8, 0.82, false]].forEach(([u, v, gem]) => {
      const p = P(u, v);
      out += `<ellipse cx="${p[0]}" cy="${p[1] - 6 * s}" rx="${15 * s}" ry="${12 * s * Math.max(sy, 0.75)}" fill="none" stroke="url(#${gold})" stroke-width="${5.5 * s}"/>`;
      if (gem) out += `<circle cx="${p[0]}" cy="${p[1] - 19 * s}" r="${5.5 * s}" fill="#E9EEF2" stroke="#B7C3CC" stroke-width="1.2"/>`;
    });
    // pearl stud pairs (cell 1)
    [[0.1, 0.18], [0.2, 0.18], [0.1, 0.34], [0.2, 0.34]].forEach(([u, v]) => {
      const p = P(u, v);
      out += `<circle cx="${p[0]}" cy="${p[1]}" r="${8 * s}" fill="#F6F1E8" stroke="#D9CFBF" stroke-width="1"/>
              <circle cx="${p[0] - 2.5 * s}" cy="${p[1] - 2.5 * s}" r="${2.6 * s}" fill="#FFFFFF" opacity="0.9"/>`;
    });
    // chain coil (cell 2)
    const cc = P(0.465, 0.26);
    for (let k = 0; k < 3; k++) {
      out += `<ellipse cx="${cc[0] + (k - 1) * 6 * s}" cy="${cc[1] + (k - 1) * 4 * s * sy}" rx="${(34 - k * 7) * s}" ry="${(22 - k * 4) * s * sy}" fill="none" stroke="url(#${gold})" stroke-width="${2.6 * s}"/>`;
    }
    // hoops (cell 3)
    [[0.11, 0.7], [0.21, 0.74]].forEach(([u, v]) => {
      const p = P(u, v);
      out += `<ellipse cx="${p[0]}" cy="${p[1]}" rx="${17 * s}" ry="${17 * s * sy}" fill="none" stroke="url(#${gold})" stroke-width="${4 * s}"/>`;
    });
    // bangle (cell 4)
    const bp = P(0.465, 0.74);
    out += `<ellipse cx="${bp[0]}" cy="${bp[1]}" rx="${36 * s}" ry="${26 * s * sy}" fill="none" stroke="url(#${gold})" stroke-width="${6 * s}"/>`;
    // dividers on top of contents edges
    divider([0.62, -0.02], [0.62, 1.02], 9 * s);
    divider([0.31, -0.02], [0.31, 1.02], 8 * s);
    divider([-0.02, 0.5], [0.62, 0.5], 8 * s);
    return out;
  }
  function velvetPattern(id, c) {
    return `<pattern id="${id}" width="6" height="6" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="0.7" fill="${shade(c, 0.25)}" opacity="0.25"/>
      <circle cx="4" cy="4" r="0.6" fill="${shade(c, -0.4)}" opacity="0.18"/></pattern>`;
  }
  function trayMain(c) {
    const gold = nid("gd"), vel = nid("vp");
    const q = [[188, 382], [612, 382], [676, 506], [124, 506]];
    const sh = shadow(404, 562, 318, 26, 0.26, 16);
    const t = openTray(q, 44, c, { floorLight: -0.06, floorDark: -0.22 });
    return {
      defs: sh.defs + t.defs + goldGrad(gold) + velvetPattern(vel, c),
      body: sh.body + t.body + `<polygon points="${pts(t.inner)}" fill="url(#${vel})"/>` + trayContents(t.inner, c, 0.62, gold, 1)
    };
  }
  function trayTop(c, opts) {
    opts = opts || {};
    const gold = nid("gd"), fl = nid("fl"), vel = nid("vp"), f = nid("sh");
    const x = opts.x || 140, y = opts.y || 226, w = opts.w || 520, h = opts.h || 347;
    const inset = 20 * (w / 520);
    const inner = [[x + inset, y + inset], [x + w - inset, y + inset], [x + w - inset, y + h - inset], [x + inset, y + h - inset]];
    const defs = blur(f, 18) + goldGrad(gold) + velvetPattern(vel, c) +
      `<radialGradient id="${fl}" cx="0.5" cy="0.5" r="0.7"><stop offset="0" stop-color="${shade(c, -0.05)}"/><stop offset="1" stop-color="${shade(c, -0.2)}"/></radialGradient>`;
    const body = `
      <rect x="${x + 6}" y="${y + 22}" width="${w}" height="${h}" rx="26" fill="#3A2C20" opacity="0.22" filter="url(#${f})"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${26 * (w / 520)}" fill="${shade(c, 0.1)}"/>
      <rect x="${inner[0][0]}" y="${inner[0][1]}" width="${w - 2 * inset}" height="${h - 2 * inset}" rx="${12 * (w / 520)}" fill="url(#${fl})"/>
      <rect x="${inner[0][0]}" y="${inner[0][1]}" width="${w - 2 * inset}" height="${h - 2 * inset}" rx="${12 * (w / 520)}" fill="url(#${vel})"/>
      <path d="M${inner[3][0]},${inner[3][1] - 10} L${inner[0][0]},${inner[0][1] + 10} Q${inner[0][0]},${inner[0][1]} ${inner[0][0] + 10},${inner[0][1]} L${inner[1][0]},${inner[1][1]}" fill="none" stroke="${shade(c, -0.35)}" stroke-width="6" opacity="0.25"/>`;
    return { defs, body: body + trayContents(inner, c, 1, gold, w / 520) };
  }
  function trayDims(c, labels, ink) {
    const t = trayTop(c, { x: 190, y: 250, w: 420, h: 280 });
    const col = ink || "#5A4E44";
    const line = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="2"/>`;
    const body = t.body +
      line(190, 580, 610, 580) + line(190, 568, 190, 592) + line(610, 568, 610, 592) +
      `<text x="400" y="620" text-anchor="middle" font-family="system-ui, sans-serif" font-size="26" fill="${col}">${labels.w}</text>` +
      line(650, 250, 650, 530) + line(638, 250, 662, 250) + line(638, 530, 662, 530) +
      `<text x="672" y="398" font-family="system-ui, sans-serif" font-size="26" fill="${col}">${labels.d}</text>` +
      `<text x="190" y="205" font-family="system-ui, sans-serif" font-size="24" fill="${col}">Height ${labels.h}</text>`;
    return { defs: t.defs, body };
  }

  // ---------- drawer organiser set ----------
  function boxes(c) {
    const sh = shadow(400, 600, 330, 30, 0.22, 16);
    let defs = sh.defs, body = sh.body;
    const trays = [
      [[[232, 318], [568, 318], [606, 380], [194, 380]], 44],
      [[[150, 420], [372, 420], [394, 500], [120, 500]], 46],
      [[[426, 420], [648, 420], [678, 500], [404, 500]], 46],
      [[[300, 538], [474, 538], [490, 596], [282, 596]], 34]
    ];
    trays.forEach(([q, d]) => {
      const t = openTray(q, d, c, { floorLight: -0.1, floorDark: -0.24, rimStroke: 8, iu: 0.03, iv: 0.07 });
      defs += t.defs;
      body += t.body;
    });
    return { defs, body };
  }

  // ---------- mug ----------
  function mug(c) {
    const g = nid("cy"), st = nid("st"), lid = nid("ld");
    const sh = shadow(414, 612, 150, 18, 0.28, 12);
    const lidC = shade(c, -0.1).startsWith("#2") || c.toLowerCase() === "#2a2a2c" ? "#3B3C40" : "#2F3033";
    const defs = sh.defs + cylGrad(g, c) + steelGrad(st) + cylGrad(lid, lidC);
    const body = sh.body + `
      <path d="M505,370 C600,366 604,524 505,524" fill="none" stroke="${shade(c, -0.2)}" stroke-width="30" stroke-linecap="round"/>
      <path d="M512,382 C584,384 586,510 512,512" fill="none" stroke="${shade(c, 0.14)}" stroke-width="5" stroke-linecap="round" opacity="0.6"/>
      <path d="M295,304 L295,584 Q295,612 324,612 L476,612 Q505,612 505,584 L505,304 Z" fill="url(#${g})"/>
      <rect x="295" y="292" width="210" height="16" fill="url(#${st})"/>
      <path d="M289,268 L289,296 Q400,312 511,296 L511,268 Z" fill="url(#${lid})"/>
      <ellipse cx="400" cy="268" rx="111" ry="21" fill="${shade(lidC, 0.12)}"/>
      <rect x="352" y="256" width="96" height="14" rx="7" fill="#151517"/>
      <ellipse cx="400" cy="268" rx="111" ry="21" fill="none" stroke="#000" stroke-opacity="0.2" stroke-width="1.5"/>`;
    return { defs, body };
  }
  // ---------- tumbler ----------
  function tumbler(c) {
    const g = nid("cy"), lid = nid("ld");
    const sh = shadow(410, 612, 120, 16, 0.26, 12);
    const defs = sh.defs + cylGrad(g, c) + cylGrad(lid, "#E4E3DF");
    const body = sh.body + `
      <line x1="430" y1="196" x2="466" y2="78" stroke="#000" stroke-opacity="0.12" stroke-width="16" stroke-linecap="round"/>
      <line x1="430" y1="196" x2="466" y2="78" stroke="#F4F6F7" stroke-opacity="0.85" stroke-width="12" stroke-linecap="round"/>
      <path d="M308,222 L334,590 Q336,612 360,612 L440,612 Q464,612 466,590 L492,222 Z" fill="url(#${g})"/>
      <path d="M332,560 L468,560 L466,590 Q464,612 440,612 L360,612 Q336,612 334,590 Z" fill="${shade(c, -0.12)}" opacity="0.5"/>
      <path d="M302,196 L302,224 Q400,240 498,224 L498,196 Z" fill="url(#${lid})"/>
      <ellipse cx="400" cy="196" rx="98" ry="19" fill="#EFEEEA" stroke="#000" stroke-opacity="0.12"/>
      <ellipse cx="430" cy="194" rx="10" ry="4" fill="#9A9A96"/>`;
    return { defs, body };
  }
  // ---------- string lights ----------
  function lights(c, variantId) {
    const glow = nid("gl");
    let defs = `<radialGradient id="${glow}"><stop offset="0" stop-color="#FFE7A3" stop-opacity="0.85"/><stop offset="1" stop-color="#FFE7A3" stop-opacity="0"/></radialGradient>`;
    let body = "";
    const strands = [
      (x) => 400 + 80 * Math.sin(x / 95) + 25 * Math.sin(x / 37),
      (x) => 470 + 60 * Math.sin(x / 80 + 1.7) + 20 * Math.sin(x / 41),
      (x) => 330 + 50 * Math.sin(x / 70 + 0.6)
    ];
    strands.forEach((f, si) => {
      let d = "";
      for (let x = 120; x <= 690; x += 6) d += (x === 120 ? "M" : "L") + x + "," + f(x).toFixed(1);
      body += `<path d="${d}" fill="none" stroke="#B9874B" stroke-width="2.2" opacity="0.9"/>`;
      for (let x = 132 + si * 11; x <= 680; x += 34) {
        const y = f(x);
        body += `<circle cx="${x}" cy="${y}" r="20" fill="url(#${glow})"/>
                 <ellipse cx="${x}" cy="${y}" rx="5" ry="6" fill="#FFF6D8" stroke="#E7B65C" stroke-width="1.5"/>`;
      }
    });
    // power end
    const y0 = strands[1](120);
    if (variantId === "usb") {
      body += `<path d="M120,${y0} C100,${y0 + 40} 110,${y0 + 80} 140,${y0 + 96}" fill="none" stroke="#2C2C2C" stroke-width="5"/>
        <rect x="128" y="${y0 + 90}" width="44" height="26" rx="5" fill="#2E2F33"/>
        <rect x="170" y="${y0 + 94}" width="34" height="18" rx="2" fill="#C9CDD1" stroke="#8E9397"/>
        <rect x="178" y="${y0 + 99}" width="18" height="8" fill="#5A5E62"/>`;
    } else {
      body += `<path d="M120,${y0} C96,${y0 + 40} 104,${y0 + 80} 132,${y0 + 96}" fill="none" stroke="#F2F1EE" stroke-width="5"/>
        <rect x="112" y="${y0 + 92}" width="70" height="56" rx="10" fill="#F4F3EF" stroke="#C9C6BE" stroke-width="2"/>
        <rect x="128" y="${y0 + 146}" width="8" height="22" rx="2" fill="#B8BCC0"/>
        <rect x="158" y="${y0 + 146}" width="8" height="22" rx="2" fill="#B8BCC0"/>`;
    }
    const sh = shadow(400, 640, 300, 18, 0.12, 14);
    return { defs: defs + sh.defs, body: sh.body + body };
  }
  // ---------- desk lamp ----------
  function lamp(c) {
    const g = nid("cy"), gl = nid("gl"), hd = nid("hd");
    const sh = shadow(400, 612, 170, 22, 0.26, 12);
    const out = shade(c, -0.28);
    const defs = sh.defs + cylGrad(g, c) + cylGrad(hd, c) +
      `<radialGradient id="${gl}"><stop offset="0" stop-color="#FFE9B0" stop-opacity="0.7"/><stop offset="1" stop-color="#FFE9B0" stop-opacity="0"/></radialGradient>`;
    const body = sh.body + `
      <ellipse cx="560" cy="560" rx="170" ry="46" fill="url(#${gl})"/>
      <path d="M262,588 L262,602 Q380,632 498,602 L498,588 Z" fill="${shade(c, -0.22)}" stroke="${out}" stroke-width="1.5"/>
      <ellipse cx="380" cy="588" rx="118" ry="24" fill="url(#${g})" stroke="${out}" stroke-width="1.5"/>
      <rect x="430" y="604" width="24" height="7" rx="2" fill="#1E1F21"/>
      <line x1="372" y1="584" x2="300" y2="370" stroke="${out}" stroke-width="20" stroke-linecap="round"/>
      <line x1="372" y1="584" x2="300" y2="370" stroke="${c}" stroke-width="16" stroke-linecap="round"/>
      <line x1="300" y1="370" x2="518" y2="268" stroke="${out}" stroke-width="18" stroke-linecap="round"/>
      <line x1="300" y1="370" x2="518" y2="268" stroke="${c}" stroke-width="14" stroke-linecap="round"/>
      <circle cx="300" cy="370" r="17" fill="${shade(c, -0.12)}" stroke="${out}" stroke-width="1.5"/>
      <circle cx="372" cy="580" r="13" fill="${shade(c, -0.12)}" stroke="${out}" stroke-width="1.5"/>
      <g transform="rotate(28 520 270)">
        <path d="M494,246 L546,246 L604,350 L436,350 Z" fill="url(#${hd})" stroke="${out}" stroke-width="1.5" stroke-linejoin="round"/>
        <ellipse cx="520" cy="350" rx="84" ry="15" fill="#FFF3CC" stroke="${out}" stroke-width="1.5"/>
        <circle cx="520" cy="250" r="15" fill="${shade(c, -0.12)}" stroke="${out}" stroke-width="1.5"/>
      </g>`;
    return { defs, body };
  }
  // ---------- bath caddy ----------
  function caddy(c) {
    const sh = shadow(400, 540, 340, 22, 0.24, 14);
    const q = [[150, 430], [650, 430], [722, 500], [78, 500]];
    const g = nid("tf");
    let body = sh.body;
    const front = [q[3], q[2], [q[2][0], q[2][1] + 22], [q[3][0], q[3][1] + 22]];
    const defs = sh.defs + `<linearGradient id="${g}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${shade(c, -0.3)}"/><stop offset="1" stop-color="${shade(c, -0.18)}"/></linearGradient>`;
    body += `<polygon points="${pts(front)}" fill="url(#${g})" stroke="url(#${g})" stroke-width="8" stroke-linejoin="round"/>
             <polygon points="${pts(q)}" fill="${shade(c, 0.08)}" stroke="${shade(c, 0.08)}" stroke-width="8" stroke-linejoin="round"/>`;
    for (let i = 1; i < 7; i++) {
      const a = quadPoint(q, 0, i / 7), b = quadPoint(q, 1, i / 7);
      body += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${shade(c, -0.18)}" stroke-width="1.6" opacity="0.6"/>`;
    }
    for (let i = 1; i < 6; i++) {
      const a = quadPoint(q, i / 6 - 0.04, 0), b = quadPoint(q, i / 6 - 0.04, 1);
      body += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${shade(c, -0.12)}" stroke-width="1" opacity="0.35"/>`;
    }
    const cup = quadPoint(q, 0.84, 0.52);
    const soap = subQuad(q, 0.6, 0.72, 0.25, 0.75);
    body += `<ellipse cx="${cup[0]}" cy="${cup[1]}" rx="36" ry="14" fill="${shade(c, -0.42)}"/>
      <polygon points="${pts(soap)}" fill="${shade(c, -0.2)}" stroke="${shade(c, -0.3)}" stroke-width="2" stroke-linejoin="round"/>
      <polygon points="214,466 444,466 420,300 240,300" fill="${shade(c, 0.02)}" stroke="${shade(c, -0.22)}" stroke-width="2" stroke-linejoin="round"/>
      <rect x="212" y="452" width="234" height="16" rx="4" fill="${shade(c, -0.1)}"/>
      <line x1="236" y1="330" x2="422" y2="330" stroke="${shade(c, -0.16)}" stroke-width="1.4" opacity="0.6"/>
      <line x1="232" y1="370" x2="428" y2="370" stroke="${shade(c, -0.16)}" stroke-width="1.4" opacity="0.6"/>
      <line x1="226" y1="410" x2="434" y2="410" stroke="${shade(c, -0.16)}" stroke-width="1.4" opacity="0.6"/>`;
    return { defs, body };
  }
  // ---------- scalp massager ----------
  function massager(c) {
    const r = nid("rg");
    const sh = shadow(400, 560, 170, 20, 0.24, 12);
    const defs = sh.defs + `<radialGradient id="${r}" cx="0.38" cy="0.3" r="0.8"><stop offset="0" stop-color="${shade(c, 0.35)}"/><stop offset="0.6" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, -0.25)}"/></radialGradient>`;
    let body = sh.body + `<path d="M336,352 C336,262 464,262 464,352" fill="none" stroke="${shade(c, -0.18)}" stroke-width="24" stroke-linecap="round"/>`;
    const nub = (x, y, h, k) => `<rect x="${x - 7}" y="${y}" width="14" height="${h}" rx="7" fill="${shade(c, -0.1 - k)}"/><circle cx="${x}" cy="${y + h - 5}" r="4" fill="${shade(c, 0.15)}" opacity="0.6"/>`;
    [[118, 0.06], [82, 0.1], [44, 0.14]].forEach(([R, k], ri) => {
      for (let a = 0.12; a < Math.PI - 0.1; a += 0.32 - ri * 0.04) {
        const x = 400 + R * Math.cos(a), y = 462 + (R / 118) * 22 * Math.sin(a) - ri * 6;
        body += nub(x, y, 44 - ri * 6, k);
      }
    });
    body += `<ellipse cx="400" cy="420" rx="148" ry="96" fill="url(#${r})"/>
      <ellipse cx="400" cy="462" rx="146" ry="30" fill="${shade(c, -0.14)}" opacity="0.55"/>
      <ellipse cx="360" cy="380" rx="50" ry="22" fill="#fff" opacity="0.18"/>`;
    return { defs, body };
  }
  // ---------- soap dispenser ----------
  function dispenser(c) {
    const g = nid("cy"), st = nid("st");
    const sh = shadow(400, 620, 220, 18, 0.26, 12);
    const tray = openTray([[232, 560], [568, 560], [604, 606], [196, 606]], 14, c, { rimStroke: 10, iu: 0.05, iv: 0.18, floorLight: -0.04, floorDark: -0.12 });
    let speck = "";
    let seed = 7;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < 40; i++) speck += `<circle cx="${338 + rnd() * 124}" cy="${330 + rnd() * 250}" r="${0.8 + rnd() * 1.3}" fill="${shade(c, -0.45)}" opacity="0.3"/>`;
    const defs = sh.defs + tray.defs + cylGrad(g, c) + steelGrad(st);
    const body = sh.body + tray.body + `
      <path d="M330,584 L330,364 Q330,320 372,316 L428,316 Q470,320 470,364 L470,584 Q470,596 456,596 L344,596 Q330,596 330,584 Z" fill="url(#${g})"/>
      ${speck}
      <rect x="380" y="290" width="40" height="30" fill="url(#${g})"/>
      <rect x="372" y="276" width="56" height="20" rx="3" fill="url(#${st})"/>
      <rect x="393" y="238" width="14" height="40" fill="url(#${st})"/>
      <rect x="378" y="222" width="44" height="22" rx="4" fill="url(#${st})"/>
      <path d="M420,228 L478,228 Q486,228 486,236 L486,240 L420,240 Z" fill="url(#${st})"/>`;
    return { defs, body };
  }

  // framing per product type for the main view: [centre x, centre y, square side]
  const FIT = {
    tray: [400, 470, 660], boxes: [400, 460, 660], mug: [430, 440, 520], tumbler: [400, 345, 620],
    lights: [400, 450, 680], lamp: [420, 430, 560], caddy: [400, 430, 720], massager: [400, 410, 440], dispenser: [400, 420, 480]
  };
  const DRAW = { tray: trayMain, boxes, mug, tumbler, lights, lamp, caddy, massager, dispenser };

  function wrap(inner, { viewBox, label, cls }) {
    return `<svg class="${cls || "ph-img"}" viewBox="${viewBox}" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs>${inner.defs}</defs>${inner.body}</svg>`;
  }

  /*
    HEImg.product(product, variant, { view, theme, crop })
    view: main | top | detail | dims   theme: warm | clean   crop: "square" | "wide" | "tall"
  */
  function product(p, v, opts) {
    opts = opts || {};
    const theme = opts.theme || "clean";
    const view = opts.view || "main";
    const c = v ? v.color : p.variants[0].color;
    const bd = backdrop(theme, 800, 800, view === "top" || view === "dims" || view === "detail" ? 0.0 : 0.6);
    let art;
    let viewBox = "0 0 800 800";
    if (p.type === "tray" && view === "top") art = trayTop(c);
    else if (p.type === "tray" && view === "detail") { art = trayTop(c); viewBox = "392 236 300 300"; }
    else if (p.type === "tray" && view === "dims") art = trayDims(c, { w: "24 cm", d: "16 cm", h: "4 cm" }, opts.ink);
    else art = DRAW[p.type](c, v ? v.id : null);
    const fit = view === "main" && FIT[p.type];
    if (fit) {
      const [cx, cy, side] = fit;
      viewBox = opts.crop === "wide"
        ? `${cx - side * 0.6} ${cy - side * 0.45} ${side * 1.2} ${side * 0.9}`
        : `${cx - side / 2} ${cy - side / 2} ${side} ${side}`;
    } else if (opts.crop === "wide") viewBox = "0 130 800 600";
    const viewLabel = (p.views || []).find((x) => x.id === view);
    const label = `${p.name}${v ? ", " + v.name : ""} — ${viewLabel ? viewLabel.label.toLowerCase() : "product view"} (sample render)`;
    // flat background when top-down views use "no horizon"
    const bdBody = view === "main" ? bd.body : bd.body;
    return wrap({ defs: bd.defs + art.defs, body: bdBody + art.body }, { viewBox, label, cls: opts.cls });
  }

  /* Scenes for editorial sections, composed from the same renders. */
  function scene(name, theme, catalog) {
    const find = (h) => catalog.products.find((x) => x.handle === h);
    const g = (p, vi, tx, ty, s) => {
      const v = p.variants[vi];
      const art = DRAW[p.type](v.color, v.id);
      return { defs: art.defs, body: `<g transform="translate(${tx} ${ty}) scale(${s})">${art.body}</g>` };
    };
    if (name === "desk") {
      const W = 1200, H = 675;
      const wall = nid("wl"), lampGlow = nid("lg");
      const parts = [
        g(find("adjustable-desk-lamp-usb"), 0, -40, 40, 0.92),
        g(find("insulated-steel-mug-350ml"), 1, 470, 210, 0.62),
        g(find("stackable-drawer-organiser-set"), 0, 690, 230, 0.6)
      ];
      const defs = `<linearGradient id="${wall}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${theme === "warm" ? "#E7DCCD" : "#EEF0ED"}"/><stop offset="0.66" stop-color="${theme === "warm" ? "#E1D4C2" : "#E8EAE6"}"/>
          <stop offset="0.662" stop-color="${theme === "warm" ? "#CDB79B" : "#DADDD8"}"/><stop offset="1" stop-color="${theme === "warm" ? "#C2A989" : "#D2D5CF"}"/></linearGradient>
        <radialGradient id="${lampGlow}" cx="0.36" cy="0.72" r="0.5"><stop offset="0" stop-color="#FFE6A6" stop-opacity="0.45"/><stop offset="1" stop-color="#FFE6A6" stop-opacity="0"/></radialGradient>` + parts.map((x) => x.defs).join("");
      const body = `<rect width="${W}" height="${H}" fill="url(#${wall})"/><rect width="${W}" height="${H}" fill="url(#${lampGlow})"/>` + parts.map((x) => x.body).join("");
      return `<svg class="ph-img" viewBox="0 0 ${W} ${H}" role="img" aria-label="Desk scene with the adjustable desk lamp, insulated mug in Forest and drawer organiser set (sample render)" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${body}</svg>`;
    }
    return "";
  }

  window.HEImg = { product, scene, shade };
})();
