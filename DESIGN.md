---
name: Food Diary
description: A dark reading room for two pork dishes, one map and one diary at a time.
colors:
  ink-ground: "#171a20"
  slate-surface: "#292b35"
  candle-cream: "#d8cec4"
  clay-muted: "#a09a94"
  wine: "#644047"
  wine-deep: "#4f3238"
  wine-lift: "#8b5c66"
  brass-gold: "#878b64"
  hairline: "#383b45"
  control-line: "#6e7381"
typography:
  display:
    fontFamily: "system-ui, \"Segoe UI\", sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "system-ui, \"Segoe UI\", sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.6
  body:
    fontFamily: "system-ui, \"Segoe UI\", sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "system-ui, \"Segoe UI\", sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  pill: "999px"
  surface: "14px"
spacing:
  xxs: "8px"
  xs: "12px"
  sm: "18px"
  md: "20px"
  lg: "28px"
  xl: "40px"
  gutter: "48px"
components:
  button-pill:
    backgroundColor: "{colors.slate-surface}"
    textColor: "{colors.candle-cream}"
    rounded: "{rounded.pill}"
    padding: "8px 18px"
  button-pill-selected:
    backgroundColor: "{colors.wine}"
    textColor: "{colors.candle-cream}"
    rounded: "{rounded.pill}"
    padding: "8px 18px"
  chip-braise:
    backgroundColor: "{colors.wine}"
    textColor: "{colors.candle-cream}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  chip-crisp:
    backgroundColor: "{colors.brass-gold}"
    textColor: "{colors.ink-ground}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  card:
    backgroundColor: "{colors.slate-surface}"
    textColor: "{colors.candle-cream}"
    rounded: "{rounded.surface}"
    padding: "18px 20px"
  map-surface:
    backgroundColor: "{colors.slate-surface}"
    rounded: "{rounded.surface}"
---

# Design System: Food Diary

## Overview

**Creative North Star: "The Midnight Dining Room"**

The diary is read at night, in a dim room, the way you look back at a meal after the plates are cleared. The page is an ink ground with a candle on it: warm cream light for the reading, wine for the one thing you are meant to touch, brass for the thing that catches the light. Darkness is the material, not a theme mode; warmth is what keeps it from going cold and corporate.

The frame owns the world and the reading column stays calm. The masthead, the tabs, the dish chips, the map and its pins are fully committed to the palette; the notes and dates inside a card stay plainly readable, because this is a document of where one person ate, not a poster. Elevation is carried by tone and a single hairline, never by glow — a dark interface that lights itself up is the failure mode this world refuses.

Two dishes must be told apart instantly, so the second signal stays: a shape. Zhujiaofan is a wine teardrop, Shaorou a brass diamond. Colour and shape always travel together, never colour alone.

**Key Characteristics:**
- Ink ground (#171a20) and slate surfaces (#292b35), never pure black.
- Warm cream text (#d8cec4), never pure white, never grey.
- One committed accent family: wine (#644047) for action, brass (#878b64) for attention and focus.
- Roundness as a language: pills for controls, 14px corners for surfaces.
- Elevation by tone and hairline; shadows deepen, they never glow.
- Dish identity carried by shape plus colour.

**Token layer.** The system is implemented as CSS custom properties at the top of `styles.css`: primitive `--color-*` values, then semantic aliases (`--surface-page`, `--surface-raised`, `--text-primary`, `--text-secondary`, `--accent`, `--accent-fill`, `--accent-alt`, `--border-subtle`, `--border-control`, `--radius-pill`, `--radius-surface`, `--space-*`, `--text-*`, `--shadow-ambient`). New work consumes the semantic aliases; primitives exist only to define them. Controls use one `.btn` pill class whose selected state is driven by `aria-pressed`, and dish labels use one `.chip` class with a `.chip--crisp` variant. `color-scheme: dark` is declared so native controls and scrollbars follow the world.

## Colors

A midnight palette: blue-black ink, a slate surface one step up from it, candle-cream light, and two metals — wine for action, brass for attention.

### Primary
- **Wine** (#644047): the one interactive accent. Selected pills, the sheet's primary action, the Zhujiaofan chip. It is a fill, not a text colour; cream text sits on it at 5.7:1.
- **Deep Wine** (#4f3238): the pressed/hover state of anything already wine. Hovering darkens the accent; it never lightens it.
- **Wine Lift** (#8b5c66): reserved for the Zhujiaofan map pin and its legend swatch, where the fill has to clear 3:1 against the dark basemap. Never used as UI chrome.

### Secondary
- **Brass Gold** (#878b64): attention, not action. The focus ring, the bowl mark, the Shaorou chip and pin, and the highlight ring on a card reached from the map. Text on brass is Ink Ground, never cream.

### Neutral
- **Ink Ground** (#171a20): the page.
- **Slate Surface** (#292b35): cards, the map shell, popups, the mobile sheet.
- **Candle Cream** (#d8cec4): all primary text — 11.2:1 on the ground, 9.1:1 on a surface.
- **Clay Muted** (#a09a94): secondary text — dates, subtitles, counts, empty states. 6.3:1 on the ground, 5.1:1 on a surface.
- **Hairline** (#383b45): header rule, card borders, sheet border. Decorative separation only.
- **Control Line** (#6e7381): the border that identifies an idle control, held at 3:1 against the ground.

### Named Rules
**The One Candle Rule.** Wine and brass never share an element. Wine means "you can press this"; brass means "look here" or "you are here" (focus). An element that is both is a bug.

**The Warm Dark Rule.** No pure black, no pure white, no neutral grey. The dark is blue-black ink and every light is tinted cream; secondary light is clay, not grey.

## Typography

**Display Font:** system-ui stack (`system-ui, "Segoe UI", sans-serif`)
**Body Font:** the same stack throughout — one family, no pairing.

**Character:** The platform's own UI face, used plainly. On a dark ground a quiet face keeps the palette and the pins carrying the identity; the only expressive move is the tight tracking on the wordmark.

### Hierarchy
- **Display** (700, clamp(2rem, 5vw, 3rem), 1.1, -0.03em): the site title only. It behaves as a wordmark, lit against the ink ground.
- **Title** (700, 1.25rem): shop names on diary cards.
- **Body** (400, 1rem, 1.6): notes, popups, sheet copy. Card measures run to roughly 72ch at 1440px, inside the 65–75ch reading range.
- **Label** (400, 0.8rem): dish chips. Secondary small text (dates, counts, subtitles) sits at 0.9rem so the two never get confused.

### Named Rules
**The One Face Rule.** No second typeface is introduced. Emphasis comes from size, weight, and tracking — never a new family, never an italic.

## Layout

A single centred column capped at 900px, with 20px page padding (12px on phones) and a 48px bottom gutter. Header, tabs, summary, map and cards all align to that column, so the page reads as one stack.

Density is comfortable: 18px between cards, 18–20px card padding, 8px between pills, more space above a heading than below it. The masthead closes on a hairline before the controls begin. On a dark ground the column is what holds the page together — the tonal steps are subtle enough that alignment, not contrast, does the separating.

The map is the tallest element and the only one that scales with the viewport: `clamp(360px, 65vh, 640px)` on desktop, a flat 50vh on phones with a 300px floor. Cards are two columns on desktop (fixed 220px image beside the text) and collapse to one column with a 180px image at the single 600px breakpoint.

## Elevation & Depth

Depth is tonal first: ink ground, slate surface, then a hairline where two surfaces meet. Shadows exist only to deepen what is already separated, and they are black, never coloured.

### Shadow Vocabulary
- **Ambient surface** (`box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45)`): cards, the map shell, open popups.
- **Highlight ring** (`box-shadow: 0 0 0 1px #878b64, 0 2px 10px rgba(0, 0, 0, 0.5)`): the confirmation flash on a card reached from the map. Brass does the announcing; the shadow only deepens.
- **Sheet lift** (`box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.55)`): the mobile detail sheet.
- **Pin drop** (`filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))`): lifts map pins off the basemap.

### Named Rules
**The No-Glow Rule.** Nothing in this world emits light. No coloured shadows, no neon edges, no halo behind an active element; on a dark ground a glow reads as a bug.

## Shapes

Roundness is the form language: controls are full pills (999px), surfaces are gently rounded (14px), chips are pills at a smaller scale. Nothing has a square corner.

Distinctive silhouettes carry meaning:
- **The bowl mark**: a hand-drawn stroke bowl with two steam lines, in Brass Gold, above the title. The only illustrative element in the chrome.
- **Zhujiaofan pin**: a wine-lift teardrop with an ink counter and a 2.2px ink outline.
- **Shaorou pin**: a brass diamond (rounded square rotated 45°) with the same ink outline.
- **Legend swatches**: the same two silhouettes at 9–12px, so the summary line teaches the pin shapes.
- **Dish chips**: pills; the two dishes differ by fill and text colour, never by shape.

Pins are outlined in Ink Ground rather than white, because on a dark basemap a dark edge reads as depth while a white edge reads as glare.

## Components

### Buttons
- **Shape:** full pill (999px), 1px Control Line border, Slate Surface fill, Candle Cream text, `8px 18px` padding (unchanged on phones).
- **Hover:** the border moves to Brass Gold; the fill and text stay.
- **Selected (`aria-pressed="true"`):** Wine fill and border, Candle Cream text — 5.7:1. The only filled control on screen.
- **Primary** (the sheet's action): Wine fill, cream text; hover darkens to Deep Wine rather than lightening.
- **Focus:** 2px Brass Gold outline at 3px offset from the shared `:focus-visible` rule.
- Every product button is 44px tall — the touch target is non-negotiable. (Leaflet's own popup close control is 24px and is the one exception: it is library chrome, not our component.)

### Chips
- **Style:** dish tags, pill-shaped, `2px 10px`, no border.
- **Zhujiaofan:** Wine fill, Candle Cream text (5.7:1).
- **Shaorou:** Brass Gold fill, Ink Ground text (4.9:1) — brass is too light for cream text, so the ink ground is the label colour.
- **State:** informational only. The filter row reuses the button pill, not the chip.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** Slate Surface on the Ink Ground.
- **Shadow Strategy:** ambient at rest; brass highlight ring during the map-to-diary flash.
- **Border:** 1px Hairline, switching to Brass Gold while highlighted.
- **Internal Padding:** `18px 20px`; the photo bleeds to the card edge and fills its 220px column.

### Navigation
Tabs ("Map" / "Diary") and the dish filters share one pill vocabulary in two rows, 18px apart, inside the 900px column. Active is the Wine pill; idle pills are Slate Surface on the ground. Rows wrap on phones rather than scroll.

### Map pins (signature)
Two silhouettes drawn as inline SVG inside Leaflet div icons: a 28×38 wine-lift teardrop anchored at its point, and a 26×26 brass diamond anchored at its centre. Both carry a 2.2px ink outline and a drop shadow. Each pin exposes shop and dish as its accessible label and opens a popup (desktop) or the bottom sheet (phone). The basemap is CARTO dark, so the map sits inside the world instead of glaring out of it.

### Summary line
One line above the map: shop count in Candle Cream at semibold, then one key per dish — a small swatch silhouette beside "Zhujiaofan N" / "Shaorou N" — separated by clay middots. It doubles as the pin legend.

### Mobile detail sheet
A bottom sheet on Slate Surface, 14px rounded on its top edge, lifted by the sheet shadow. Dish chip, shop, date, scrolling note, and the wine primary action. Close by control, by tapping the map, or Escape; focus enters the sheet and returns to the pin.

## Do's and Don'ts

### Do:
- **Do** keep exactly one accent family: Wine (#644047) for action, Brass (#878b64) for attention and focus, never both on one element.
- **Do** use warm tinted light — Candle Cream and Clay — for every text colour.
- **Do** carry depth with tone and a single hairline; deepen with black shadows only.
- **Do** pair dish colour with dish shape: wine teardrop for Zhujiaofan, brass diamond for Shaorou.
- **Do** outline map pins in Ink Ground, not white.
- **Do** keep every control at 44px tall and keep the brass `:focus-visible` ring visible.
- **Do** hold the 900px column and the single 600px breakpoint.

### Don't:
- **Don't** use pure black or pure white anywhere, or a neutral grey for text.
- **Don't** glow, halo, or colour a shadow; nothing emits light.
- **Don't** put Candle Cream text on Brass Gold, or wine on ink as small text.
- **Don't** add a third hue, a gradient, or a second typeface.
- **Don't** differentiate the two dishes by colour alone.
- **Don't** nest cards inside cards or set body text below 0.8rem.
