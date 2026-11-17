---
name: Food Diary
description: A warm paper diary of two pork dishes, built on a market-fruit colour sheet.
colors:
  paper: "#efe1c7"
  bone: "#ebece7"
  ink: "#100b08"
  ink-muted: "#5f5340"
  red: "#ff303a"
  orange: "#fb642b"
  coral: "#fe8c6a"
  yellow: "#f4c700"
  green: "#9cb069"
  rule: "#d8c8ac"
typography:
  display:
    fontFamily: "\"Fraunces\", Georgia, \"Times New Roman\", serif"
    fontSize: "clamp(2.6rem, 7vw, 5rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  title:
    fontFamily: "\"Fraunces\", Georgia, \"Times New Roman\", serif"
    fontSize: "1.35rem"
    fontWeight: 400
    lineHeight: 1.15
  body:
    fontFamily: "system-ui, \"Segoe UI\", sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "system-ui, \"Segoe UI\", sans-serif"
    fontSize: "0.72rem"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  chip: "0px"
spacing:
  sm: "8px"
  md: "14px"
  lg: "20px"
  xl: "28px"
  gutter: "80px"
components:
  button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    padding: "10px 18px"
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    padding: "10px 18px"
  chip-braise:
    backgroundColor: "{colors.red}"
    textColor: "{colors.ink}"
    padding: "3px 9px"
  chip-crisp:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    padding: "3px 9px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "14px 0 0"
  map-surface:
    backgroundColor: "{colors.bone}"
---

# Design System: Food Diary

## Overview

**Creative North Star: "The Market Table"**

The diary moved off a dark screen and onto paper. The ground is cream, the ink is the plate's black, and the only colour in the room comes from produce: the red of braised pork, the gold of crisp skin, the green of the cucumber alongside it. It reads like a page torn from a food magazine — a photograph, a rule, a name, a note.

Colour here is material, not decoration. Every accent in this sheet came out of the same photograph, so they already belong together; the discipline is in what each one is allowed to do. Because the accents are vivid and the ground is mid-light, **an accent can never carry small text or a hairline** — red on paper measures 2.84:1 and yellow measures 1.25:1. Accents are fills with ink inside them (red 5.3:1, yellow 12.1:1), and anything that must be read is ink on paper (15.2:1). That single constraint shapes the whole interface.

The frame stays quiet so the photography can be loud. Cards are not filled panels; they are separated by a single ink rule, the way a magazine separates a story.

**Key Characteristics:**
- Cream paper ground (#efe1c7) and ink text (#100b08) — 15.2:1.
- Accents as fills only: red (#ff303a) and yellow (#f4c700), always with ink on top.
- Outlines and state in ink, never in an accent.
- No card shadows, no rounded panels, no gradients except the cover scrim.
- Dish identity carried by fill plus shape.

## Colors

### Ground and text
- **Paper** (#efe1c7): the page. Warm cream from the sheet, not white.
- **Bone** (#ebece7): raised surfaces only — map popups and the phone sheet. The one cooler neutral, so a panel reads as a separate object.
- **Ink** (#100b08): all text, all rules, all focus rings. The plate's black, warmed.
- **Ink Muted** (#5f5340): dates, counts, idle controls. 5.8:1 on paper.
- **Rule** (#d8c8ac): the hairline that separates, decorative only.

### Produce accents
- **Red** (#ff303a): Zhujiaofan, and the primary action. A fill; ink sits on it at 5.3:1.
- **Yellow** (#f4c700): Shaorou. A fill; ink sits on it at 12.1:1.
- **Orange** (#fb642b): the press/hover deepen for a red control.
- **Green** (#9cb069): the quiet secondary fill — the empty state and "Show all". Ink on green is 8.2:1.
- **Coral** (#fe8c6a): warmth in the cover scrim only, never as a surface.

### Named Rules
**The Ink-on-Accent Rule.** No accent carries text or a line directly on paper. Red and yellow are fills; ink sits inside them. Anything read directly on the page is ink or ink-muted.

**The No-Fill-Card Rule.** Entries are separated by an ink rule, not by a panel. Bone is reserved for things that float over the map.

## Typography

**Display Font:** Fraunces (400) via Google Fonts.
**Body Font:** the system UI stack.

**Character:** A high-contrast old-style serif does the talking; the system face does the reading. Fraunces is warm and slightly soft-edged, which suits cream paper and food photography far better than a geometric sans. The title is the largest thing on the page and carries the identity, so the rest can stay plain.

### Hierarchy
- **Display** (Fraunces 400, clamp(2.6rem, 7vw, 5rem), 0.98, -0.02em): the site title over the cover photo, in cream.
- **Feature title** (Fraunces 400, clamp(1.8rem, 3vw, 2.6rem)): the newest shop, the lead story.
- **Title** (Fraunces 400, 1.35rem): the remaining shops.
- **Body** (system 400, 1rem, 1.7): notes, popups, sheet copy. Measures hold at 62ch.
- **Meta** (system 400, 0.88rem): dates and counts, in ink-muted.

## Layout

A 1120px column, page padding `clamp(16px, 4vw, 48px)`, 80px bottom gutter.

The cover is a full-bleed photograph, `clamp(380px, 72vh, 760px)` tall, with the wordmark and title set over a warm ink scrim at its base. Below it, one hairline carries the nav. Entries follow as a two-column magazine grid: the newest entry runs full width as a lead story (photo 1.25fr, text 1fr), everything after it sits in two equal columns. Photo is always 3:2 and always the tallest thing in its card.

On phones the lead story collapses to one column and the grid to one column, the nav's two rows stack, and the cover shortens to `clamp(300px, 52svh, 460px)`.

## Elevation & Depth

There is almost none, deliberately. No card shadow, no rounded panels. Depth is carried by the bone surface where something floats over the map, and by a soft dark shadow on the phone sheet only.

### Shadow Vocabulary
- **Sheet lift** (`0 -8px 24px rgba(16, 11, 8, 0.18)`): the phone detail sheet.
- **Pin drop** (`drop-shadow(0 1px 2px rgba(16, 11, 8, 0.35))`): lifts map pins off the pale basemap.

## Shapes

Square. The chips and controls have no radius, and the cards have no corners to round. The only curved things are the pins:

- **Bowl mark**: a stroke bowl with two steam lines, in Yellow, over the cover.
- **Zhujiaofan pin**: a red teardrop with an ink counter and a 2.2px ink outline.
- **Shaorou pin**: a yellow diamond with the same ink outline.
- **Legend swatches**: the same two silhouettes at 9–12px, inside the summary line.

Pins are outlined in ink, not white, because the basemap is now pale.

## Components

### Navigation
Text, not pills. Two groups on one 56px row: view tabs (Map / Diary) at the left, dish filters (All / Zhujiaofan / Shaorou) at the right. Idle is ink-muted; selected is ink plus a 2px ink underline. The row is a single hairline across the page.

### Dish chips
Small square tags, `3px 9px`. Zhujiaofan is red with ink text; Shaorou is yellow with ink text. Informational only — the filter row is text, not chips.

### Buttons
Square, 1px ink border, transparent fill, ink text, 44px tall. Hover inverts to ink fill and paper text. The primary (the sheet's action) is a red fill with ink text, deepening to orange on hover. Focus is a 2px ink outline at 3px offset, everywhere.

### Cards
No panel, no radius, no shadow. A 1px ink top rule, 14px of air, then an image with a 3:2 crop and the text beneath. The lead story gets a 3px rule and a side-by-side layout. Reaching a card from the map flashes a 2px ink outline at 4px offset for two seconds.

### Links
Ink text, underlined in current ink at 1px with a 4px offset; hover switches the underline to red at 2px. Inside a Leaflet popup the link is forced back to ink, because Leaflet's own anchor blue would otherwise win.

### Map
Esri World **Light** Gray Canvas, keyless raster tiles, so the map belongs to the paper rather than glaring out of it. Leaflet chrome is repainted: popups and zoom controls on Bone with ink text. If tiles fail, a line above the map says so.

### Summary line
One line above the map: entry count in ink at semibold, then one key per dish — the shape swatch beside "Zhujiaofan N" / "Shaorou N". Screen readers hear the comma separators.

### Mobile detail sheet
A Bone panel, square, over the map, lifted by the sheet shadow. Dish chip, shop, date, scrolling note, red primary action. Close by control, by tapping the map, or Escape; focus enters the sheet and returns to the pin.

## Do's and Don'ts

### Do:
- **Do** keep the ground cream and the reading colour ink.
- **Do** let accents be fills, with ink text inside them.
- **Do** carry dish identity with fill plus shape: red teardrop, yellow diamond.
- **Do** outline pins in ink.
- **Do** keep every control 44px tall with a visible 2px ink focus ring.
- **Do** hold the 1120px column and the single 600px breakpoint.

### Don't:
- **Don't** set red, yellow, orange, coral or green as small text or as a hairline on paper.
- **Don't** put paper/cream text inside a red or yellow fill.
- **Don't** add a shadow or a rounded corner to a card.
- **Don't** introduce a gradient outside the cover scrim.
- **Don't** fill a card panel; separate entries with a rule.
