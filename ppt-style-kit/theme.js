/**
 * theme.js — "Deep Indigo" deck style kit
 * Extracted from `ppt final.pptx` (Solar PV-Battery final year project).
 *
 * Canvas is 20" x 11.25" (18288000 x 10287000 EMU) — the source deck's odd
 * large-canvas size. Keep it: every measurement below assumes it.
 *
 * Usage:  const { deck, S, slide } = require('./theme');
 *         const s = slide(); s.title('Daily Dispatch — Sunny Day');
 *         s.commentary([...]);  ...  await deck.writeFile({ fileName: 'out.pptx' });
 */

/* ------------------------------------------------------------------ palette */
const C = {
  ink: '1A1B26', // near-black navy — dark panels, "winner" stat cards
  indigo: '151288', // deep indigo — titles, emphasis numbers
  periwinkle: '99ACFF', // primary light accent — inline labels, table borders
  ice: 'ECF0FF', // body text on dark panels
  pale: 'CDD6FF', // secondary label on dark
  mist: 'EEF1FF', // light stat-card fill
  card: 'E8EBFA', // light phase-card fill
  slate: '555577', // muted label on light
  white: 'FFFFFF',
  black: '000000',
  coral: 'FF7A85', // "WHAT THE PLOTS SHOW" eyebrow
  amber: 'FFC000', // eyebrow alt / accent numbers
  gold: 'FFD479', // closing line of a commentary panel
  cream: 'FFF0C2', // table highlight cell
  sky: '709BBF', // title-slide decorative circle (51% alpha)
  kicker: 'FFF510', // title-slide eyebrow
};

/* --------------------------------------------------------------- typography */
// These are SEPARATE family names, not weights. They must be installed as-is.
const F = {
  heavy: 'Montserrat Ultra-Bold', // big card headings
  bold: 'Montserrat Bold', // slide titles, big numbers
  semi: 'Montserrat Semi-Bold', // all body copy
  plain: 'Montserrat', // rare
};

/* ------------------------------------------------------------------ canvas */
const W = 20;
const H = 11.25;
const M = 1.125; // left/right content margin
const CW = W - M * 2; // 17.75" content width

// recurring geometry, in inches, lifted from the source slides
const PT = 72; // pptxgenjs margin/inset options are POINTS, not inches
const G = {
  title: { x: M, y: 0.683, w: 14.768, h: 0.906 },
  titleTop: 0.683,
  bodyTop: 2.0, // where content normally starts
  bodyBottom: 10.2,
  dotTR: { x: 17.813, y: -1.688, d: 3.375 }, // motif circle, top-right
  dotBL: { x: -1.499, y: 9.352, d: 3.375 }, // motif circle, bottom-left
  panelInset: 0.361 * PT, // dark commentary panel text inset (330000 EMU)
  statW: 2.953,
  statH: 1.914,
  statInset: 0.131 * PT, // 120000 EMU
  cmpW: 4.659,
  cmpH: 2.515,
  cardW: 4.142,
  cardH: 5.906,
  cardInset: 0.328 * PT, // 300000 EMU
};

/* --------------------------------------------------------------- components */

/* ------------------------------------------------------- image size probe */
// Reads pixel dimensions straight from the file header so `figure` can preserve
// aspect ratio. Supports PNG and JPEG — no dependencies.
const fs = require('fs');

function imageSize(p) {
  const b = fs.readFileSync(p);
  // PNG: 8-byte signature, then an IHDR chunk with width/height at offset 16
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) {
    return { pw: b.readUInt32BE(16), ph: b.readUInt32BE(20) };
  }
  // JPEG: walk the marker segments to the first SOF frame header
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length - 9) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      // SOF0..SOF15, excluding DHT (c4), JPG (c8) and DAC (cc)
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { ph: b.readUInt16BE(i + 5), pw: b.readUInt16BE(i + 7) };
      }
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  throw new Error(`figure(): cannot read dimensions of ${p} (need PNG or JPEG)`);
}

function build(PptxGenJS) {
  const mod = PptxGenJS || require('pptxgenjs');
  const P = typeof mod === 'function' ? mod : mod.default;
  const deck = new P();
  deck.defineLayout({ name: 'BIG169', width: W, height: H });
  deck.layout = 'BIG169';
  deck.author = 'Deck Style Kit';
  deck.company = 'Deep Indigo';
  deck.theme = {
    headFontFace: F.bold,
    bodyFontFace: F.semi,
  };

  /** New content slide with the corner-dot motif. */
  function slide(opts = {}) {
    const s = deck.addSlide();
    if (opts.bg) s.background = { color: opts.bg };
    if (opts.dots !== false) {
      s.addShape(deck.ShapeType.ellipse, {
        ...G.dotTR, w: G.dotTR.d, h: G.dotTR.d, fill: { color: C.ink },
      });
      if (opts.dots === 'both' || opts.dots === true) {
        s.addShape(deck.ShapeType.ellipse, {
          ...G.dotBL, w: G.dotBL.d, h: G.dotBL.d, fill: { color: C.ink },
        });
      }
    }
    return s;
  }

  const api = { deck, slide, s: slide };

  /* ---- slide title (left-aligned, Montserrat Bold ~48.87pt) -------------- */
  api.title = (text, color = C.indigo) => {
    const s = slide._current;
    s.addText(text, {
      ...G.title, margin: 0, valign: 'top', align: 'left',
      fontFace: F.bold, fontSize: 48.87, color, lineSpacing: 68.42,
    });
    return s;
  };

  /* ---- small caption under a graphic ------------------------------------ */
  api.caption = (text, x, y, w, h = 0.55, color = C.slate) => {
    slide._current.addText(text, {
      x, y, w, h, margin: 0, valign: 'top', fontFace: F.semi,
      fontSize: 14, color, lineSpacing: 18,
    });
  };

  /* ---- dark commentary panel (the deck's signature component) ----------- */
  // items: [{label:'Baseline:', text:'...'}, ...]  closing: 'gold takeaway line'
  api.commentary = (items, o = {}) => {
    const s = slide._current;
    const x = o.x ?? 9.569;
    const y = o.y ?? 4.046;
    const w = o.w ?? 9.307;
    const h = o.h ?? 6.726;
    const body = [];
    body.push({
      text: o.eyebrow || 'WHAT THE PLOTS SHOW',
      options: {
        fontFace: F.bold, fontSize: 26, color: o.eyebrowColor || C.coral,
        spcAft: 9, breakLine: true,
      },
    });
    for (const it of items) {
      body.push({
        text: it.label,
        options: {
          fontFace: F.bold, fontSize: o.labelSize || 24, color: o.labelColor || C.periwinkle,
          breakLine: false,
        },
      });
      body.push({
        text: it.text,
        options: {
          fontFace: F.semi, fontSize: o.textSize || 24, color: C.white,
          lineSpacingMultiple: 1.05, spcAft: 10, breakLine: true,
        },
      });
    }
    if (o.closing) {
      body.push({
        text: o.closing,
        options: {
          fontFace: F.bold, fontSize: o.textSize || 24, color: C.gold,
          lineSpacingMultiple: 1.05,
        },
      });
    }
    s.addText(body, {
      x, y, w, h, fill: { color: C.ink },
      margin: G.panelInset, valign: 'top', align: 'left',
    });
    return s;
  };

  /* ---- stat card: big number + label ------------------------------------ */
  // dark:true inverts it (winner treatment)
  api.stat = (value, label, x, y, o = {}) => {
    const s = slide._current;
    const dark = !!o.dark;
    s.addShape(deck.ShapeType.roundRect, {
      x, y, w: o.w || G.statW, h: o.h || G.statH,
      rectRadius: 0.12,
      fill: { color: dark ? C.ink : C.mist },
    });
    s.addText(
      [
        {
          text: value,
          options: {
            fontFace: F.bold, fontSize: o.valueSize || 34,
            color: dark ? C.white : C.indigo, spcAft: 3, breakLine: true,
          },
        },
        {
          text: label,
          options: {
            fontFace: F.semi, fontSize: o.labelSize || 17,
            color: dark ? C.pale : C.slate,
          },
        },
      ],
      {
        x, y, w: o.w || G.statW, h: o.h || G.statH,
        margin: G.statInset, align: 'center', valign: 'middle',
      },
    );
    return s;
  };

  /* ---- comparison card: heading + two big numbers with sub-labels -------- */
  // vals: [{v:'55%', l:'sunny'}, {v:'38%', l:'cloudy'}]
  api.compare = (heading, vals, x, y, o = {}) => {
    const s = slide._current;
    const w = o.w || G.cmpW;
    const h = o.h || G.cmpH;
    const dark = o.dark ?? vals.some((v) => v.strong);
    s.addShape(deck.ShapeType.roundRect, {
      x, y, w, h, rectRadius: 0.14,
      fill: { color: dark ? C.ink : C.mist },
    });
    const pad = 0.22;
    s.addText(heading, {
      x: x + pad, y: y + pad * 0.7, w: w - pad * 2, h: 0.42, margin: 0,
      fontFace: F.bold, fontSize: 18, color: dark ? C.white : C.slate,
      align: 'left', valign: 'top',
    });
    // two big values side by side, matching the source's "55% | 38%" row
    const innerY = y + pad * 0.7 + 0.52;
    const innerH = h - (innerY - y) - pad * 0.7;
    const colW = (w - pad * 2) / vals.length;
    vals.forEach((v, i) => {
      const cx = x + pad + colW * i;
      s.addText(v.v, {
        x: cx, y: innerY, w: colW, h: innerH * 0.62, margin: 0,
        fontFace: F.bold, fontSize: 34,
        color: v.strong ? (dark ? C.gold : C.indigo) : dark ? C.white : C.indigo,
        align: 'center', valign: 'middle',
      });
      s.addText(v.l, {
        x: cx, y: innerY + innerH * 0.62, w: colW, h: innerH * 0.38, margin: 0,
        fontFace: F.semi, fontSize: 16, color: dark ? C.pale : C.slate,
        align: 'center', valign: 'top',
      });
    });
    return s;
  };

  /* ---- light phase card: kicker / heading / body ------------------------ */
  api.phaseCard = (kicker, heading, body, x, y, o = {}) => {
    const s = slide._current;
    const w = o.w || G.cardW;
    const h = o.h || G.cardH;
    s.addShape(deck.ShapeType.rect, {
      x, y, w, h, fill: { color: o.fill || C.card },
    });
    const runs = [
      { text: kicker, options: { fontFace: F.semi, fontSize: 20, color: C.slate, spcAft: 14, breakLine: true } },
      { text: heading, options: { fontFace: F.bold, fontSize: 28, color: C.indigo, spcAft: 18, breakLine: true, lineSpacingMultiple: 1.1 } },
      { text: body, options: { fontFace: F.semi, fontSize: 22, color: C.ink, lineSpacingMultiple: 1.1 } },
    ];
    s.addText(runs, {
      x, y, w, h, margin: G.cardInset, valign: 'top', align: 'left',
    });
    return s;
  };

  /* ---- dark full-width takeaway bar ------------------------------------- */
  api.takeaway = (text, o = {}) => {
    const s = slide._current;
    const y = o.y ?? 8.64;
    const h = o.h ?? 1.531;
    s.addShape(deck.ShapeType.rect, {
      x: M, y, w: CW, h, fill: { color: C.ink },
    });
    s.addText(text, {
      x: M, y, w: CW, h, margin: G.cardInset,
      fontFace: F.bold, fontSize: o.size || 26, color: C.white,
      align: 'left', valign: 'middle',
    });
    return s;
  };

  /* ---- dark body panel (for text-only slides like slide 2/3) ------------ */
  // blocks: [{head:'GOALS', text:'...'}, ...]
  api.panel = (blocks, o = {}) => {
    const s = slide._current;
    const x = o.x ?? M;
    const y = o.y ?? 1.985;
    const w = o.w ?? CW;
    const h = o.h ?? 3.494;
    s.addShape(deck.ShapeType.roundRect, {
      x, y, w, h, rectRadius: 0.18, fill: { color: C.ink },
    });
    const runs = [];
    blocks.forEach((b, i) => {
      if (b.head) {
        runs.push({
          text: b.head,
          options: {
            fontFace: F.heavy, fontSize: 38.49, color: C.white,
            spcAft: 12, breakLine: true,
          },
        });
      }
      runs.push({
        text: b.text,
        options: {
          fontFace: F.semi, fontSize: 22.5, color: C.ice,
          lineSpacingMultiple: 1.45, spcAft: i === blocks.length - 1 ? 0 : 16,
          breakLine: true,
        },
      });
    });
    s.addText(runs, {
      x, y, w, h, margin: 0.4 * PT, valign: 'top', align: 'left',
    });
    return s;
  };

  /* ---- data table (periwinkle header, 3pt borders, cream highlight) ----- */
  // cols: [{w, head, key}]  rows: [[...]]  highlight: {row, col}
  api.table = (cols, rows, o = {}) => {
    const s = slide._current;
    const head = cols.map((c) => ({
      text: c.head,
      options: {
        fill: { color: C.periwinkle }, color: C.black, bold: false,
        fontFace: F.bold, fontSize: 20, align: 'center', valign: 'middle',
      },
    }));
    const body = rows.map((r, ri) =>
      r.map((cell, ci) => {
        const hot = o.highlight && o.highlight.row === ri && o.highlight.col === ci;
        return {
          text: cell,
          options: {
            fill: { color: hot ? C.cream : C.white },
            color: C.black, fontFace: F.semi, fontSize: 22,
            align: ci === 0 ? 'left' : 'center', valign: 'middle',
          },
        };
      }),
    );
    s.addTable([head, ...body], {
      x: o.x ?? M, y: o.y ?? 2.0, w: o.w,
      colW: cols.map((c) => c.w),
      rowH: o.rowH || 0.91,
      border: { type: 'solid', pt: 3, color: C.periwinkle },
      margin: 0.12 * PT,
    });
    return s;
  };

  /* ---- your own plot, dropped in as an image ---------------------------- */
  // Fits the image inside (x,y,w,h) PRESERVING its aspect ratio and centres it,
  // so plots of any shape (matplotlib, MATLAB, Excel) land undistorted.
  // opts: { frame: true }  pale CDD6FF card behind the image (default)
  //       { pad: 0.06 }     inner padding of that frame
  //       { bg: 'FFFFFF' }  frame fill — set to the image's own background to blend
  //       { align: 'center' }  'center' | 'top' | 'bottom' | 'left' | 'right'
  api.figure = (imgPath, x, y, w, h, opts = {}) => {
    const s = slide._current;
    const pad = opts.frame === false ? 0 : (opts.pad ?? 0.06);
    if (opts.frame !== false) {
      s.addShape(deck.ShapeType.rect, {
        x, y, w, h, fill: { color: opts.bg || C.pale },
      });
    }
    const bw = w - pad * 2;
    const bh = h - pad * 2;
    const { pw, ph } = imageSize(imgPath);
    // contain: largest size that fits, same aspect ratio
    const scale = Math.min(bw / pw, bh / ph);
    const iw = pw * scale;
    const ih = ph * scale;
    const a = opts.align || 'center';
    const ix = x + pad + (a === 'left' ? 0 : a === 'right' ? bw - iw : (bw - iw) / 2);
    const iy = y + pad + (a === 'top' ? 0 : a === 'bottom' ? bh - ih : (bh - ih) / 2);
    s.addImage({ path: imgPath, x: ix, y: iy, w: iw, h: ih });
    return s;
  };

  /* ---- title slide ------------------------------------------------------- */
  api.titleSlide = ({ kicker, title, people, mentor, logo }) => {
    const s = slide({ bg: C.black });
    s.addShape(deck.ShapeType.ellipse, {
      x: 17.095, y: 8.34, w: 5.285, h: 5.285,
      fill: { color: C.sky, transparency: 49 },
    });
    s.addText(kicker, {
      x: M, y: 1.423, w: CW, h: 0.581, margin: 0,
      fontFace: F.bold, fontSize: 30.75, color: C.kicker, align: 'left',
    });
    s.addText(title, {
      x: M, y: 3.343, w: 14.768, h: 2.281, margin: 0,
      fontFace: F.bold, fontSize: 59.65, color: C.white,
      lineSpacing: 83.51, valign: 'top',
    });
    if (logo) s.addImage({ path: logo, x: 17.306, y: 0.451, w: 1.929, h: 1.944 });
    const lines = [...people, mentor];
    s.addText(
      lines.map((t, i) => ({
        text: t,
        options: {
          fontFace: F.semi, fontSize: 22.5, color: C.white,
          lineSpacing: 33.75, breakLine: i < lines.length - 1,
        },
      })),
      { x: M, y: 6.638, w: 14, h: 3.26, margin: 0, valign: 'top' },
    );
    return s;
  };

  /* ---- closing slide ----------------------------------------------------- */
  api.closing = (text = 'THANK YOU') => {
    const s = slide({ dots: 'both' });
    s.addShape(deck.ShapeType.roundRect, {
      x: 2.125, y: 2.292, w: 16.208, h: 6.583,
      rectRadius: 0.22, fill: { color: C.ink },
    });
    s.addText(text, {
      x: 2.125, y: 2.292, w: 16.208, h: 6.583, margin: 0.4 * PT,
      fontFace: F.semi, fontSize: 80, color: C.white,
      align: 'center', valign: 'middle',
    });
    return s;
  };

  // `slide()` returns the slide; stash it so the component helpers can attach
  const rawAdd = deck.addSlide.bind(deck);
  deck.addSlide = function patched(...args) {
    const s = rawAdd(...args);
    slide._current = s;
    return s;
  };

  return api;
}

module.exports = { build, C, F, G, W, H, M, CW };