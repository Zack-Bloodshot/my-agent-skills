# Deep Indigo — PPT Style Kit

Reusable style extracted from `~/Downloads/ppt final.pptx` (Solar PV‑Battery final year project, 29 slides).
Two ways to make a new deck in this style:

| You want to… | Use |
|---|---|
| Click through PowerPoint / Google Slides and reuse layouts | **`Deep-Indigo-Template.potx`** — open it, delete the sample slides, duplicate layouts as needed |
| Generate the deck from code (repeatable, re-runnable) | **`theme.js` + a script like `example.js`** |

---

## 1. The style in one page

**Canvas** — 20" × 11.25" (16:9 at 1.5× scale). All coordinates below assume this. Don't resize the slide.

**Colours**

| Token | Hex | Where it's used |
|---|---|---|
| ink | `1A1B26` | dark panels, winner stat card, motif circles, takeaway bar |
| indigo | `151288` | slide titles, numbers on light cards |
| periwinkle | `99ACFF` | inline labels in commentary, table header fill + borders |
| ice | `ECF0FF` | body copy on dark panels |
| pale | `CDD6FF` | secondary label on dark cards |
| mist | `EEF1FF` | light stat card fill |
| card | `E8EBFA` | light phase-card fill |
| slate | `555577` | muted labels on light |
| coral | `FF7A85` | "WHAT THE PLOTS SHOW" eyebrow |
| gold | `FFD479` | closing takeaway line inside a commentary panel |
| cream | `FFF0C2` | table highlight cell |
| amber / kicker | `FFC000` / `FFF510` | title-slide eyebrow, accent |

**Fonts** — Montserrat, as *separate families*, not weights. Install `fonts/*.ttf` first (see §4).

| Role | Typeface | Size |
|---|---|---|
| Slide title | Montserrat Bold | 48.87pt |
| Card heading | Montserrat Ultra-Bold | 38.49pt |
| Body copy | Montserrat Semi-Bold | 22.5–24pt |
| Big stat number | Montserrat Bold | 34pt |
| Small label | Montserrat Semi-Bold | 14–20pt |

**Motif** — one 3.375" ink circle bleeding off the top-right corner on every content slide
(`x 17.813, y -1.688`); the title and closing slides add a second one bottom-left
(`x -1.499, y 9.352`). This is the deck's signature. Keep it.

**Grid** — left margin 1.125", content width 17.75". Title baseline at y 0.683". Content starts at y ≈ 2".

**Layout archetypes** (all present in the `.potx` as sample slides)

1. Title slide — black, yellow eyebrow, huge white title, name list, translucent blue circle
2. Dark panel — one or two full-width `1A1B26` panels with headings + paragraphs
3. Figure + commentary — pale-blue framed image left, dark commentary panel right
4. Stat row + commentary — three stat cards on top, commentary below
5. Plot + compare stack — your own plot image left, three comparison cards right
6. Phase card grid — four light cards, dark takeaway bar below
7. Data table — periwinkle header, 3pt periwinkle borders, cream highlight cell
8. Closing — ink panel, 80pt "THANK YOU"

---

## 2. Code workflow (recommended)

```js
const { build, C } = require('./theme');
const K = build();
const { deck } = K;

K.titleSlide({ kicker, title, people: [...], mentor, logo: 'logo.png' });

K.slide();
K.title('Daily Dispatch - Sunny Day');
K.figure('assets/dispatch.png', 1.125, 1.914, 7.571, 8.3);
K.commentary([
  { label: 'Baseline:  ', text: 'No battery. Surplus is exported at the solar-slot rate.' },
  { label: 'LP:  ', text: 'Charges in short midday pulses, then discharges from ~17 h.' },
], { closing: 'LP is 55% cheaper than the baseline.' });

K.takeaway('Goal: lower bills while keeping the battery healthy.');
K.closing();

await deck.writeFile({ fileName: 'my-deck.pptx' });
```

Every helper takes an options object with `x / y / w / h` overrides, so nothing is locked in.
`example.js` builds all eight archetypes end to end — copy it, replace the content, run `node your-script.js`.

### Helper reference

| Helper | Purpose |
|---|---|
| `slide(opts)` | new slide + motif circles. `opts`: `bg`, `dots` (`false` \| `true` \| `'both'`) |
| `title(text, color?)` | Montserrat Bold 48.87pt at the fixed title position |
| `commentary(items, opts)` | dark panel; `items` = `{label, text}`; `opts`: `eyebrow`, `eyebrowColor`, `closing` |
| `stat(value, label, x, y, opts)` | stat card; `opts.dark` inverts it (use for the winner) |
| `compare(heading, vals, x, y, opts)` | comparison card; `vals` = `[{v, l, strong}]` |
| `phaseCard(kicker, heading, body, x, y)` | light phase card |
| `takeaway(text, opts)` | full-width dark bar |
| `panel(blocks, opts)` | dark text panel; `blocks` = `[{head, text}]` |
| `table(cols, rows, opts)` | styled table; `opts.highlight = {row, col}` |
| `figure(path, x, y, w, h, opts)` | your plot as an image, aspect ratio preserved + centred on a pale card |
| `caption(text, x, y, w, h?)` | small muted line under a plot |
| `titleSlide({...})` / `closing(text?)` | first / last slide |

### Dropping in your own plots

The kit does no plotting — you produce PNG or JPEG images and hand them over.
`figure()` reads the image's own pixel dimensions and **fits it inside the box
without distorting it**, so any aspect ratio works:

```js
K.figure('assets/dispatch.png', 1.125, 1.914, 7.571, 8.3);
```

| `figure` option | Default | Effect |
|---|---|---|
| `frame` | `true` | pale `CDD6FF` card behind the image |
| `pad` | `0.06` | inner padding of that frame |
| `bg` | `CDD6FF` | frame fill — set `'FFFFFF'` if your plot already has a white background, so the card disappears |
| `align` | `'center'` | `'top' \| 'bottom' \| 'left' \| 'right'` — pin a tall plot to the top instead of centring it |

For a white-background matplotlib/MATLAB export, `{ frame: false }` drops the card entirely and the image sits directly on the slide.

**Tip:** export your plots at ~2× the display size (a plot placed 12" wide should be ~2400px) and on a white background, then use `{ bg: 'FFFFFF' }` or `{ frame: false }`.

---

## 3. PowerPoint workflow

1. Open `Deep-Indigo-Template.pptx`.
2. Delete the eight sample slides (the layouts live in the master, so nothing breaks).
3. Insert new slides, then copy the shapes you need from the sample deck before deleting them — or just duplicate the closest sample slide and replace its text.

**If you hand-build slides instead**, apply this checklist:

- Title: Montserrat Bold 48.87pt, `#151288`, at x 1.125" / y 0.683", left-aligned, no underline
- Motif: 3.375" circle `#1A1B26` in the top-right corner, centred on the corner so ~half bleeds off
- Dark panels: fill `#1A1B26`, text inset 0.36", body Montserrat Semi-Bold 24pt `#ECF0FF` at 1.05 line spacing
- Inline label inside a panel: Montserrat Bold 24pt `#99ACFF`, then the sentence in white — same paragraph
- Eyebrow above a panel's content: Montserrat Bold 26pt `#FF7A85`
- Winner emphasis: invert a card to `#1A1B26` with white value and `#CDD6FF` label
- Never add accent stripes or underlines under titles — the source deck uses none

---

## 4. Fonts (do this first)

The deck embeds Montserrat, but a generated file can't. Install the three families in `fonts/`:

```bash
cp fonts/*.ttf ~/.local/share/fonts/ && fc-cache -f
```

Only three are needed — the ones the deck actually uses as family names:

- `Montserrat Bold`
- `Montserrat Semi-Bold`
- `Montserrat Ultra-Bold`

If you open a deck on a machine without them, PowerPoint substitutes and everything reflows. Install first, generate second.

---

## 5. Gotchas already handled

- **pptxgenjs `margin` is in POINTS, not inches.** `theme.js` multiplies the inch values by 72 via `PT`. Don't inline raw inch numbers for margins.
- **`lineSpacingMultiple`** for proportional line spacing; `lineSpacing` is absolute points. The source's `lnSpc spcPct` maps to `lineSpacingMultiple`.
- **One `new pptxgen()` per file** — `build()` handles it; call `build()` again for a second deck rather than reusing `deck`.
- **Don't reuse option objects across `add*` calls** — pptxgenjs mutates them in place.
- **Run the validator after generating**: `python scripts/office/validate.py out.pptx` (from the pptx skill).
- **No plotting in this kit.** There is no chart helper by design — plots arrive as PNG/JPEG and go in via `figure()`, which preserves their aspect ratio.

## 6. Files

```
theme.js                     style tokens + component helpers
example.js                   builds all 8 archetypes -> Deep-Indigo-Style-Reference.pptx
Deep-Indigo-Style-Reference.pptx   visual reference deck (all archetypes)
Deep-Indigo-Template.potx    same content, opened as a PowerPoint template
fonts/                       Montserrat Bold / Semi-Bold / Ultra-Bold
assets/dispatch.png          placeholder figure
assets/cost.png              placeholder plot (drop your own here)
```