# Beauty. — Design System

**Beauty.** is a direct-to-consumer skin-care brand: botanical products (moisturizers, serums,
exfoliating powders, masques) sold through a single-page storefront. The product surface is a
marketing-plus-commerce website — hero, science claims, a four-step routine, an ingredients
story, and a best-sellers rail that sells straight from the home page.

Everything in this system was derived from **one artifact**, reproduced at
`assets/reference/source-landing-page.jpg`: a full-page desktop mockup of the Beauty. home page
(736 × 1622 JPEG, dated "© 2022 Beauty." in its own footer).

## Sources given

| Source | What it was | Status |
| --- | --- | --- |
| `uploads/5f873ddaeb9fe2ad7d730cdfd7e4a9ce.jpg` | Flat JPEG of the Beauty. home page, desktop, full scroll | Read. Copied to `assets/reference/source-landing-page.jpg` |
| Company description | "design 8/24" | No usable brand information |

No codebase, no Figma file, no font binaries, no logo file, no icon set, no copy deck, no
second product surface. **Every value here was measured or sampled from that single JPEG**, so
this system is a faithful reconstruction, not a transcription — see "Gaps & what to send next".

### Font substitutions — please confirm

The artwork shipped no font files. The two families are eyeballed matches at the resolution
available (the source page renders about 585 px wide, roughly 0.4× a 1440 design):

| Role | Substituted with | Confidence |
| --- | --- | --- |
| Display serif (all headings, stat numerals, step labels) | **Playfair Display** 700 (Google Fonts) | High — the high-contrast didone-ish shapes, the ball terminal on the `y`, and the `%` glyph all line up |
| UI sans (wordmark, nav, body, buttons, prices) | **DM Sans** 400/500/700 (Google Fonts) | Medium — a geometric sans with a tall x-height and a double-storey `a`; Poppins, Jost and Nunito Sans were the other candidates |

Both load from the Google Fonts CDN via `tokens/fonts.css`. **If you have the real fonts, send
them and this becomes a two-line change.**

### No logo mark exists

The source contains no logo glyph — the mark is the word "Beauty." set in bold sans with a full
stop. No mark was invented. `Wordmark` renders it as type, and `thumbnail.html` uses the same
word. If a real logo exists, drop the SVG into `assets/` and swap it into `Wordmark.jsx`.

---

## CONTENT FUNDAMENTALS

**Caveat first:** every paragraph in the source is Latin placeholder ("Lorem ipsum…",
"Excepteur sint occaecat…"). Tone below is inferred from the strings that *are* real — headings,
eyebrows, buttons, product names, footer — and from what the placeholder blocks tell us about
*length*. Real copy will confirm or correct it.

**Voice — you, never we.** Every headline is addressed to the reader and puts them in the
sentence: "Bringing Out The Beauty In You", "Beauty Service for You", "4 Steps for Your Skin
Care". The brand never says "I", almost never says "we", and never talks about itself in the
third person.

**Casing is two-tier.**
- Headings and actions are **Title Case**: "Our Best Sellers", "Shop Now", "Try It Free".
  (One deliberate exception in the source: "Product information" is sentence case — treat Title
  Case as the rule and don't propagate the exception.)
- Product names and everyday UI text are **sentence case**: "Clear Cell mattifying moisturizer
  for oily skin", "Intense brightening exfoliating powder", "Delivery and payment",
  "Select options", "Add to cart".

**Eyebrows are one to three words, Title Case, no punctuation**: `Skin Care Product`,
`Introducing`, `How Does It Work`, `Ingredients`, `Order Now`, `Useful Links`, `Follow Us`. They
name the section's *job*, not its content — the serif title carries the content.

**Step labels are single words in caps**: WASH · MAKE · TREAT · NATURAL. Verbs, not nouns; one
word each, no exceptions.

**Numbers are the proof.** Claims are digits with a percent sign plus a two-word label:
"97% Elasticity Increase", "85% Moisture Increase", "83% Wrinkle Decrease". Never spelled out,
never rounded to a marketing-friendly 100, never with a footnote in the same block. Prices are
plain (`$199.99`) or an en-dash range (`$74.52 – $903.20`). Ratings show one decimal ("5.0").

**Length discipline.** Hero lede ≈ 20 words on two lines. Section ledes ≈ 15–25 words, centred,
never wider than ~52 characters. Card body copy ≈ 12 words. The panel is the only place a
four-line paragraph is allowed. When in doubt, cut — the layout is built on white space.

**No emoji. Ever.** Not in headings, not in labels, not in the footer. There are none in the
source and they would fight the serif.

**No exclamation marks, no urgency, no ALL-CAPS shouting** (caps are used only for the four step
labels, as a typographic device). No "Limited time", no countdowns, no "Buy now!!". The tone is
calm, clinical-but-warm: a spa that shows you a lab result.

**Vibe in one line:** *a botanical apothecary with a dermatologist's numbers.*

---

## VISUAL FOUNDATIONS

### Colour
One hue carries the brand: a saturated **leaf green, `#2C9D2F`** (`--green-600`), sampled from
the "Shop Now" button. It appears on every action, every eyebrow, every price, the active nav
link, the step badges, the footer phone number and the social circles — and nowhere else.
Everything not green is **white, near-white, or warm grey**. The only other accent in the whole
page is **rating gold `#E8A33C`**, used exclusively on stars.

- Tints (`--green-100 #DCEEDC`, `--green-50 #F1F8F1`) do structural work: the 8 px ring around
  step photos, the soft blob behind the ingredients still-life, hover washes.
- Neutrals are warm and very slightly green-leaning — `--ink-900 #101413` for headings,
  `--ink-600 #6E7671` for body. Never a blue-grey.
- Backgrounds: `#FFFFFF` for the page and every card; `#F8FAF7` for exactly one band (the
  footer). **Two background colours in the entire system.**
- No dark mode exists in the source. Don't invent one.

### Type
Display serif over quiet sans, with a large jump between them: 54/40/28 px serif headings
against 15/14/12 px sans body. The serif is always 700 — there is no light or italic display
usage anywhere. Body copy runs at a generous **1.85 line-height**, which is what makes the page
feel airy rather than dense. Eyebrows are 12 px bold sans letterspaced 0.10em; step labels are
serif caps letterspaced 0.16em. Headings track slightly tight (−0.01em); nothing else is tracked.

### Layout
1200 px content column inside a 1440 design, 40 px gutters, 88 px header. Vertical rhythm is
built on **120 px section padding** with 40–48 px between a heading block and its content, and
the page reads as a stack of centred sections — heading centred, content centred — with exactly
two exceptions: the hero (left-aligned over full-bleed photography) and the service panel
(left-aligned inside a split card). Nothing is sticky or fixed in the source: the header scrolls
away. The one deliberate overlap in the layout is the service panel, which rides ~96 px up over
the hero image — that overlap is the brand's signature move; use it once per page, not twice.

### Backgrounds & imagery
Photography, never illustration; no patterns, no textures, no noise, no grain, no mesh
gradients. Two treatments only:

1. **Full-bleed photography** in the hero, faded into the page with a soft mask on the left and
   top edge rather than a scrim or dark overlay. Text sits on the bright, empty part of the
   photo — the brand never puts white text on a dark box, and there are **no protection
   gradients or capsules** anywhere.
2. **Cut-outs on white**: product bottles and botanicals float with no container, blended with
   `mix-blend-mode: multiply` so the photo's white paper disappears into the page.

The colour vibe of the imagery is consistent and worth protecting: **bright, high-key daylight,
warm** — deep leaf greens, cream and towel-white, terracotta and honey, the occasional pink or
red bloom. Nothing cool, nothing moody, nothing black-and-white, no filters. Shadows in the
photos are soft and diffuse, like a north-facing window.

Botanical accents (palm fronds, `assets/images/leaf-palm-*.png`) bleed off section corners —
one bottom-left of the hero, one behind the bottom-right of the best-sellers panel. They sit
*behind* content, are `pointer-events: none`, and never appear more than twice on a page.

### Corners, borders, cards
- **Actions are always pills** (`999px`). Nothing else is.
- Panels: 20 px (`--radius-lg`) for the service card, 28 px (`--radius-xl`) for the
  best-sellers panel; 12 px for small cards (the active timeline row, the featured product tile).
- Step photos and social buttons are perfect circles.
- **A card is a white surface with a wide soft shadow and no border.** Never both. Never a
  coloured left border, never an accent stripe.
- Borders are used in exactly three places: the 1 px hairline above each stat and above the
  footer copyright, the 1.5 px ghost-button outline, and the 8 px mint ring around step photos.

### Shadows
Wide, soft, neutral, and *quiet*: 4–8 % black at 12–90 px blur, no spread, no colour, no
inner shadows anywhere. `--shadow-card` (`0 10px 30px rgba(16,20,19,.06)`) for tiles,
`--shadow-panel` (`0 20px 60px rgba(16,20,19,.07)`) for the big panels. Buttons are flat — a
green pill never carries a shadow.

### Transparency & blur
Effectively unused. No frosted glass, no backdrop blur, no translucent nav. The only alpha in
the system is the **opacity ladder on the routine timeline** (inactive rows at 0.42, hover 0.75,
active 1.0) and the soft mask that fades hero photography into the page. If you find yourself
reaching for a blur, the answer is white space instead.

### Motion, hover, press
The source is a static image, so motion is a *rule set derived from the brand's temperament*
rather than a recording — keep it calm and short:

- Duration 160 ms for colour, 240 ms for movement, 420 ms for a panel reveal. Easing is a
  single curve, `cubic-bezier(.22,.61,.36,1)`. **No bounce, no spring, no overshoot.**
- **Hover** prefers colour over movement: the primary pill darkens `green-600 → green-700`;
  ghost buttons fill with the `green-50` wash; nav links and header icons turn green; timeline
  rows fade up in opacity.
- The one movement allowed is a **4 px lift plus a deeper shadow** on cards that are themselves
  links (product tiles, step photos).
- **Press** darkens one more step (`green-800`) and scales to `0.98`. No ripples.
- Focus is a 3 px `rgba(44,157,47,.35)` ring. Nothing else changes.
- Never animate the serif headings, never stagger-reveal a product row, never parallax the hero.

---

## ICONOGRAPHY

The source is a flat JPEG: **no vectors, no icon font, no sprite sheet, no PNG icons** were
supplied. The glyphs visible in it are (a) three thin-line UI icons in the header — magnifier,
shopping bag with a count bubble, a left-aligned "menu" rule stack, (b) four solid social marks
in the footer — Facebook, YouTube, Twitter (the old bird), Instagram, and (c) five small solid
gold stars per product.

**Substitution — flagged.** Closest CDN matches were copied into `assets/icons/` verbatim
(paths untouched, licences noted in `assets/icons/README.md`):

| Set | Licence | Used for | Why |
| --- | --- | --- | --- |
| [Lucide](https://lucide.dev) `lucide-static` | ISC | `search`, `shopping-bag`, `align-left`, `leaf`, `phone`, `map-pin`, arrows, chevrons, `plus`, `minus`, `check`, `x`, `heart`, `truck`, `sparkles`, `menu`, `user`, `star` | 2 px round-cap stroke matches the header glyphs exactly |
| [Bootstrap Icons](https://icons.getbootstrap.com) | MIT | `star-fill` | Lucide has no filled star; the ratings need a solid one |
| [Simple Icons](https://simpleicons.org) | CC0 | `brand-facebook`, `brand-youtube`, `brand-twitter`, `brand-x`, `brand-instagram` | Official brand marks, solid fill, same as the artwork |

Rules:
- Icons are **inline SVG**, rendered by `<Icon />` from a registry inside `Icon.jsx`. Colour
  follows tokens, and inline SVG survives screenshot and PDF export (a CSS mask or `<img>`
  does not). The standalone `.svg` files exist for hand-written HTML and production hand-off.
- Sizes: **17 px** in the header, **14 px** in footer social circles, **11 px** for rating stars.
- Line icons are stroke-only, 2 px, round caps. Brand marks and stars are fill-only. Don't mix.
- The nav "menu" is deliberately `align-left` (three rules of unequal length), not a hamburger.
- **No emoji, and no Unicode characters used as icons** (no ★, ✓, →). The en-dash in price
  ranges and the © in the footer are the only non-alphanumeric characters in the copy.
- **Never hand-draw an SVG** for a Beauty. surface. Add the real path to the registry instead.

If the true icon set exists, drop it into `assets/icons/` and replace the registry — the API
won't change.

---

## Components

Sixteen primitives, every one traceable to something in the artwork. Grouped by concern under
`components/`.

`components/core/`
- **Icon** — inline-SVG glyph from the local registry, coloured by token.
- **Button** — the pill action: `primary`, `ghost`, `quiet`; 46 px and 38 px.
- **IconButton** — header icon affordance with an optional count badge.
- **Eyebrow** — the 12 px green section kicker.
- **SectionHeading** — eyebrow + serif title + lede; the only section opener.
- **Card** — white rounded surface, shadow only, optional hover lift.
- **StatBlock** — green serif metric under a hairline.
- **LeafDecor** — decorative palm frond bleeding off a section edge.

`components/commerce/`
- **StarRating** — five gold stars plus the score.
- **ProductCard** — cut-out photo, sentence-case name, rating, green price, pill action.
- **StepCard** — numbered circular photo in a mint ring with a serif caps label.
- **TimelineItem** — a day in the routine list; one active row, neighbours faded.

`components/navigation/`
- **Wordmark** — "Beauty." as type (there is no logo glyph).
- **SocialIconButton** — 34 px green circle with a white brand mark.
- **NavBar** — wordmark, five links, account, search, bag, menu.
- **SiteFooter** — pale-green band: contact block, link columns, socials, copyright.

Each directory holds `<Name>.jsx`, `<Name>.d.ts` (props contract), `<Name>.prompt.md` (what &
when, usage, variants) and one `@dsCard` HTML showing the states.

### Intentional additions

- **Icon** — the artwork has glyphs but no icon component. A single wrapper keeps every glyph on
  one code path and stops anyone hand-drawing SVGs.
- **LeafDecor** — the botanical accents are a real brand device; wrapping them prevents
  hand-positioned absolute images drifting out of the pattern.

Nothing else was added. There is no Toast, Tooltip, Tabs, Avatar, Modal, Accordion or form
control in this system **because none exists in the source** — building them would mean
inventing a visual language nobody has approved. Ask and they can be designed properly.

---

## UI kit

`ui_kits/website/` — the Beauty. storefront, interactive: `index.html` runs the three screens
with working navigation, a live cart count, category filters and the routine timeline.

| Screen | Status |
| --- | --- |
| `Home.jsx` + `HomeSections.jsx` | **Recreation** of the supplied artwork: hero, overlapping service panel, four steps, ingredients + routine timeline, best sellers |
| `Shop.jsx` | **Composed** from home-page patterns only (heading, pill filters, product grid). No shop design was supplied. |
| `ProductDetail.jsx` | **Composed** from home-page patterns only (blob still-life, metric row, routine panel, related row). No product page was supplied. |
| Pages / Blog / Contact | **Deliberately blank**, with an on-screen disclaimer. Not invented. |

`index.html` prefers the compiled bundle and falls back to transpiling the sources in-browser,
so it also renders when opened straight from disk.

---

## Index

| Path | What's in it |
| --- | --- |
| `styles.css` | The single entry point consumers link — `@import`s only |
| `tokens/colors.css` | Green scale, tints, ink neutrals, paper, gold + semantic aliases |
| `tokens/typography.css` | Families, sizes, line-heights, weights, tracking + type roles |
| `tokens/spacing.css` | 4 px space scale, radii, borders, layout and component metrics |
| `tokens/elevation.css` | Shadow scale, focus ring |
| `tokens/motion.css` | Durations, easing, lift and press transforms |
| `tokens/fonts.css` | Google Fonts import for Playfair Display + DM Sans |
| `tokens/base.css` | Element defaults (body, headings, links, selection, focus) |
| `guidelines/*.card.html` | 24 foundation specimens — Type, Colors, Spacing, Brand |
| `components/core/…` | Icon, Button, IconButton, Eyebrow, SectionHeading, Card, StatBlock, LeafDecor |
| `components/commerce/…` | StarRating, ProductCard, StepCard, TimelineItem |
| `components/navigation/…` | Wordmark, SocialIconButton, NavBar, SiteFooter |
| `ui_kits/website/` | Storefront kit — `index.html`, `Home`, `Shop`, `ProductDetail`, `content.jsx`, `README.md` |
| `assets/images/` | 12 photographic assets cropped from the source artwork |
| `assets/icons/` | 26 SVG glyphs (Lucide / Bootstrap Icons / Simple Icons) + licence notes |
| `assets/reference/` | The original source mockup, kept for provenance |
| `thumbnail.html` | Homepage tile |
| `SKILL.md` | Agent-Skills front matter so this folder works in Claude Code |

---

## Gaps & what to send next

1. **Font files** (or confirmation of Playfair Display + DM Sans).
2. **The logo**, if one exists beyond the wordmark.
3. **The real icon set**, if the header/footer glyphs came from somewhere specific.
4. **Higher-resolution imagery.** Every photo here was cropped out of a 736 px-wide JPEG and
   upscaled 2.5–5×, so it is soft. The photography is *right* but not press-ready — send the
   originals and `assets/images/` can be replaced file-for-file.
5. **Real copy** for one section, so the tone notes above can be verified rather than inferred.
6. **Any other surface** — shop, product page, cart, checkout, blog, mobile — because Shop and
   ProductDetail are currently composed, not recreated, and mobile behaviour is unknown (the
   artwork is desktop-only; no breakpoints were supplied).
