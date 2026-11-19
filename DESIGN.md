---
name: Food Diary
description: Night Edition — a dark editorial food journal with warm produce accents.
colors:
  ground: "#171a20"
  surface: "#24272d"
  cream: "#efe1c7"
  muted: "#a9aaa5"
  orange: "#ff6129"
  olive: "#99af67"
  salmon: "#fb8c70"
  yellow: "#f5c500"
  red: "#ff3237"
  off-white: "#edeee6"
  rule: "#363941"
typography:
  display:
    fontFamily: "\"Fraunces\", Georgia, \"Times New Roman\", serif"
    fontWeight: 400
    lineHeight: 1.08
  body:
    fontFamily: "system-ui, \"Segoe UI\", sans-serif"
    fontSize: "1rem"
    lineHeight: 1.65
components:
  chip-braise:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ground}"
  chip-crisp:
    backgroundColor: "{colors.olive}"
    textColor: "{colors.ground}"
  entry-card:
    backgroundColor: "none"
    borderTop: "1px solid {colors.rule}"
  map-surface:
    backgroundColor: "{colors.surface}"
---

# Design System: Food Diary

## Overview

**Creative North Star: "Night Edition"**

A personal food journal read at night: charcoal ground, warm cream light, and the colour of the food itself. The newest memory runs as an editorial spread; everything after it sits in one even photo grid. The map is a separate room with a shop list at its side.

Photography carries the page. UI colour is a signpost, never the show: orange means the thing you can press, olive means the second dish, red is a single dot on the newest memory. Everything else stays quiet.

**Key Characteristics:**
- Ground `#171a20`, raised surface `#24272d`, text `#efe1c7` (13.5:1 on ground).
- Orange `#ff6129` is the primary action colour; olive `#99af67` is the second dish.
- Salmon, yellow and red are held back — red is one 8px dot.
- Fraunces for headings, system sans for everything else.
- No card panels inside the grid: an ink-dark rule and air separate entries.
- Two routes only: Diary and Map. Each entry gets a shareable `#/e/<id>` link.

## Colors

Contrast measured against the ground: cream 13.5:1, muted 7.5:1, orange 5.8:1, olive 7.2:1. Against the surface: cream 11.6:1, muted 6.4:1, orange 5.0:1, olive 6.2:1. All pass AA for normal text.

- **Orange** (`#ff6129`): selected tab underline, primary buttons, "Read entry", links on hover, the featured rule, marker for Zhujiaofan.
- **Olive** (`#99af67`): Shaorou chip, Shaorou marker, the rating, the selected filter underline.
- **Red** (`#ff3237`): one dot marking the newest memory. Nothing else.
- **Salmon** (`#fb8c70`) and **Yellow** (`#f5c500`): available for future highlights, unused in the current UI.

### Named Rules
**One Accent Per Component.** Orange and olive never share an element. Red appears exactly once on the page.

**Photos Beat UI.** If a coloured surface competes with a food photograph, the surface loses.

## Typography

Fraunces (400) for the site name, section title, featured and detail headings, shop names in the grid and sidebar. System sans for navigation, dates, notes, chips, buttons, and metadata. Two families, clearly different jobs.

Type scale: display `clamp(1.9rem, 3.4vw, 3rem)` on the featured title, detail `clamp(2rem, 4vw, 3.2rem)`, section `clamp(1.6rem, 3vw, 2.3rem)`, grid card `1.3rem`, body `1rem / 1.65`, meta `0.85–0.92rem`.

## Layout

A 1240px column with `clamp(16px, 4vw, 48px)` page padding.

**Diary (default).** Section title and count, then the newest memory as a spread — photo left (`1.12fr`), text right (`0.88fr`), a 3px orange rule above. Below, one grid: 3 columns above 900px, 2 columns from 601–900px, 1 column at 600px and under. Every card is the same shape: 3:2 photo, chip, name, date. No note on the grid; notes live in the entry.

**Map.** Two panes: a 310px shop list on the left and the Leaflet map on the rest. Height `clamp(500px, calc(100vh - 200px), 900px)`. Clicking a marker highlights its list row and opens a popup; clicking a row highlights its marker and pans. At phone width the list becomes a horizontal strip above the map, which still keeps `clamp(320px, 55svh, 480px)` of height.

**Entry.** A single column capped at 980px. Back link, chip, Fraunces title, metadata (date, optional rating, optional price), one large photo, optional thumbnail strip, note, Google Maps link.

**Phones.** Masthead compacts to 60px, the spread stacks, the grid goes single column, and a pin tap raises a bottom sheet instead of a popup.

## Elevation & Depth

No card shadows, no rounded panels, no gradients. The only lift is the phone sheet (`0 -8px 24px rgba(0,0,0,0.55)`) and a small drop shadow under the two pins.

## Shapes

Square throughout — chips, buttons, cards, sheet. The only curves are the two map pins: a red teardrop for Zhujiaofan and an olive diamond for Shaorou, both with a 2.2px ground-coloured outline so they read against the dark basemap. The bowl mark in the masthead is orange.

## Components

- **Tabs / filters:** text only. Active tab gets a 2px orange underline; active filter a 2px olive underline. All controls are 44px tall.
- **Chips:** square, `3px 9px`, orange or olive fill with ground-coloured text.
- **Buttons:** square, cream outline, transparent fill; hover inverts. Primary is orange with ground text, deepening on hover.
- **Grid card:** 3:2 photo, chip, Fraunces name, muted date. When reached from the map it flashes a 2px orange outline.
- **Map basemap:** Esri World Dark Gray Canvas, keyless. Leaflet popups, zoom and attribution repainted from the tokens. A failed tile load shows a warning line.
- **Sheet:** surface panel over the map on phones; chip, name, date, note, primary action. Escape closes it and returns focus to the pin.

## Data contract

`data/entries.js` stays hand-edited. Required fields: `date`, `shop`, `type`, `image`, `maps`, `note`. Optional: `id` (stable `#/e/` link), `photos` (multiple images, replaces `image` on the detail page), `rating`, `price`. Old entries with only `image` render exactly as before. No backend, no framework.

Styles are authored as Tailwind utilities in `src/input.css`; the colour and font tokens live in `tailwind.config.js`. `npm run build` compiles them into the committed `styles.css`, so adding a diary entry still needs no build step. Third-party Leaflet chrome keeps a few plain rules because it cannot be expressed as component utilities.

## Do's and Don'ts

- **Do** keep dark surfaces dominant and photos larger than any UI colour.
- **Do** keep one accent per component.
- **Do** keep 44px controls and a visible 2px orange focus ring.
- **Do** keep the single 600px and 900px breakpoints.
- **Don't** add glow, glass, gradients, nested cards, or panel shadows.
- **Don't** use red outside its single dot, or put cream text on an accent fill.
- **Don't** invent shops, photos, ratings or prices — the owner supplies them.
