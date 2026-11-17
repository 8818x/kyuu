---
name: Food Diary
description: A field guide to two pork dishes, one map and one diary at a time.
colors:
  braise-brown: "#8a4b2a"
  soy-ink: "#3d2b1f"
  clay-muted: "#7a5a42"
  paper-cream: "#faf5ec"
  card-white: "#ffffff"
  hairline: "#ebddc8"
  control-line: "#d9c4ab"
  pill-label: "#6b4a32"
  tag-braise: "#f3e0cc"
  tag-crisp: "#f7e9b8"
  tag-crisp-ink: "#6b4a08"
  crisp-gold: "#a8761a"
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
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.pill-label}"
    rounded: "{rounded.pill}"
    padding: "8px 18px"
  button-pill-active:
    backgroundColor: "{colors.braise-brown}"
    textColor: "{colors.card-white}"
    rounded: "{rounded.pill}"
    padding: "8px 18px"
  tag-braise:
    backgroundColor: "{colors.tag-braise}"
    textColor: "{colors.braise-brown}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  tag-crisp:
    backgroundColor: "{colors.tag-crisp}"
    textColor: "{colors.tag-crisp-ink}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  card:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.soy-ink}"
    rounded: "{rounded.surface}"
    padding: "18px 20px"
  map-surface:
    backgroundColor: "{colors.card-white}"
    rounded: "{rounded.surface}"
---

# Design System: Food Diary

## Overview

**Creative North Star: "The Field Guide"**

This is a small, careful record kept by one person who went to these places and ate these things. It reads like a field guide rather than a review site: a cream page like uncoated stock, one accent the colour of a braise, and specimens laid out plainly with their details attached. Nothing competes with the record. The restraint is the point; the warmth keeps it human.

Surfaces are soft and tactile — pill controls you could press with a thumb, cards with gently rounded corners, borders that are barely there. Depth is almost entirely absent: a whisper shadow separates a card from the page and nothing more. The system never dramatises itself, because the subject (a plate of pork, a shop on a street) is the thing worth looking at.

Two dishes have to be told apart instantly, so the system carries a second, quieter signal: a shape. Zhujiaofan is round and brown, Shaorou is a gold diamond. Colour and shape always travel together, never colour alone.

**Key Characteristics:**
- Cream ground (#faf5ec), never pure white as the page.
- One accent only: braise brown (#8a4b2a).
- Roundness used as a language: pills for controls, 14px corners for surfaces.
- Near-flat depth; shadows are a whisper, never a statement.
- Dish identity carried by shape plus colour.

## Colors

A braised-and-lacquered palette: warm off-white paper, deep soy-brown ink, and one caramel-brown accent standing in for the pork itself.

### Primary
- **Braise Brown** (#8a4b2a): the only accent. Selected pills, the bowl mark, the Zhujiaofan tag and pin, link-level emphasis, and the focus ring. It appears on a small fraction of any screen; its scarcity is what makes it read as the accent.

### Neutral
- **Soy Ink** (#3d2b1f): all primary text. Warm black-brown, never pure black.
- **Clay Muted** (#7a5a42): secondary text — dates, subtitles, counts, empty-state copy. A tinted brown, never gray.
- **Paper Cream** (#faf5ec): the page itself.
- **Card White** (#ffffff): cards, map surface, and idle pill interiors — the only place pure white is allowed, always as a raised object on the cream page.
- **Hairline** (#ebddc8): card and map borders, and the header rule.
- **Control Line** (#d9c4ab): the idle border on pill buttons.
- **Pill Label** (#6b4a32): idle pill text, a shade lighter than Soy Ink so the active state can win.
- **Tag Braise** (#f3e0cc): fill behind Zhujiaofan chips.
- **Tag Crisp** (#f7e9b8) with **Tag Crisp Ink** (#6b4a08): the Shaorou chip pair.
- **Crisp Gold** (#a8761a): the Shaorou map pin only.

### Named Rules
**The Braise Is the Accent Rule.** There is exactly one accent hue. Never add a second brand colour, a gradient, or a coloured shadow; Shaorou's gold exists only as a dish marker, never as UI emphasis.

**The Warm Neutral Rule.** No gray text and no pure-white page. Secondary text is Clay Muted; anything that looks like chrome is tinted brown.

## Typography

**Display Font:** system-ui stack (`system-ui, "Segoe UI", sans-serif`)
**Body Font:** the same stack throughout — one family, no pairing.

**Character:** The platform's own UI face, used plainly. It stays quiet so the food photos and the one accent carry the personality; the only expressive move is the tight tracking on the wordmark.

### Hierarchy
- **Display** (700, clamp(2rem, 5vw, 3rem), 1.1, -0.03em): the site title only. Set tight and large enough to behave as a wordmark rather than a heading.
- **Title** (700, 1.25rem): shop names on diary cards.
- **Body** (400, 1rem, 1.6): notes, popups, empty states. Keep measures short; cards top out near 60ch.
- **Label** (400, 0.8rem): dish chips. Secondary small text (dates, counts, subtitles) sits at 0.9rem, not 0.8rem, so the two never get confused.

### Named Rules
**The One Face Rule.** No second typeface is introduced. Emphasis comes from size, weight, and tracking — never a new family.

## Layout

A single centred column capped at 900px, with 20px page padding on the outside (12px on phones) and a 48px bottom gutter. Everything — header, tabs, summary, map, cards — aligns to that same column, so the page reads as one stack rather than separate regions.

Inside the column, density is comfortable rather than tight: 18px between cards, 18–20px card padding, 8px between pills, and generous separation above a heading over below it. The header sits on its own hairline rule to close the region before the controls begin.

The map is the tallest element and the only one that scales with the viewport: `clamp(360px, 65vh, 640px)` on desktop, a flat 50vh on phones with a 300px floor. Cards are two columns on desktop (a fixed 220px image beside the text) and collapse to one column with a 180px image at the 600px breakpoint — the single breakpoint in the system.

## Elevation & Depth

Flat by default. Depth is carried by tonal layering — white surfaces on the cream page plus a hairline border — not by shadow. The two shadows that exist are ambient and low-contrast: they lift a surface off the paper by a few pixels and stop. No hard offsets, no blur-as-decoration, no coloured halos.

### Shadow Vocabulary
- **Ambient surface** (`box-shadow: 0 3px 12px rgba(90, 55, 25, 0.06)`): cards and the map at rest. Its job is separation, not emphasis.
- **Highlight lift** (`box-shadow: 0 2px 10px rgba(138, 75, 42, 0.22)`): the brief confirmation flash on a card reached from the map. The only state-driven shadow in the system.
- **Pin drop** (`filter: drop-shadow(0 2px 3px rgba(61, 43, 31, 0.35))`): applies to map pins so they sit above the basemap.

### Named Rules
**The Whisper Shadow Rule.** If a shadow is visible as a shadow, it is too strong. Shadows separate; they never announce.

## Shapes

Roundness is the form language. Controls are full pills (999px); surfaces are gently rounded (14px); chips are pills at a smaller scale. Nothing in the interface has a square corner.

Distinctive silhouettes carry meaning:
- **The bowl mark**: a hand-drawn stroke bowl with two rising steam lines, sitting above the title in Braise Brown. It is the only illustrative element in the chrome.
- **Zhujiaofan pin**: a classic teardrop, brown, with a white circular counter and a white outline.
- **Shaorou pin**: a gold diamond — a rounded square rotated 45° — with the same white outline.
- **Legend swatches**: the same two silhouettes at 9–12px, so the summary line teaches the pin shapes.
- **Dish chips**: pills; the two dishes differ only by fill and ink, never by shape.

## Components

### Buttons
- **Shape:** full pill (999px), 1px Control Line border, Card White fill, Pill Label text, `8px 18px` padding (18→14px horizontal on phones).
- **Primary (selected):** Braise Brown fill and border, white text. The selected state is the only filled control on screen.
- **Hover / Focus:** no bespoke hover colour; focus is a 2px Braise Brown outline at 3px offset from the shared `:focus-visible` rule.
- Buttons are 44px tall at every size — the touch target is non-negotiable.

### Chips
- **Style:** dish tags, pill-shaped, `2px 10px`, no border. Zhujiaofan uses Tag Braise fill with Braise Brown ink; Shaorou uses Tag Crisp with Tag Crisp Ink.
- **State:** informational only; they are not clickable. The filter row reuses the button pill, not the chip.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** Card White.
- **Shadow Strategy:** Ambient surface at rest; Highlight lift during the map-to-diary flash.
- **Border:** 1px Hairline, switching to Braise Brown while highlighted.
- **Internal Padding:** `18px 20px`; the image bleeds to the card edge and fills its 220px column.

### Navigation
Tabs ("Map" / "Diary") and the dish filters share one pill vocabulary but sit in two separate rows, 18px apart, each in the 900px column. Active state is the filled Braise Brown pill; inactive pills are white on the page. On phones the rows wrap rather than scroll.

### Map Pins (signature)
Two silhouettes, one per dish, drawn as inline SVG inside Leaflet div icons: a 28×38 teardrop anchored at its point, and a 26×26 diamond anchored at its centre. Both carry a 2.2px white outline and the pin drop shadow. Each pin exposes the shop name and dish as its accessible label, and opens a popup containing the dish chip, shop, date, note, and an "Open in diary" button.

### Summary Line
A single line above the map: shop count in Soy Ink at semibold, then one key per dish — a small swatch silhouette beside "Zhujiaofan N" / "Shaorou N" — separated by middots in Clay Muted. It doubles as the pin legend.

## Do's and Don'ts

### Do:
- **Do** keep exactly one accent: Braise Brown (#8a4b2a), used sparingly.
- **Do** tint all secondary text Clay Muted (#7a5a42) and never reach for gray.
- **Do** use pills (999px) for anything interactive and 14px corners for surfaces.
- **Do** pair dish colour with dish shape: round brown for Zhujiaofan, gold diamond for Shaorou.
- **Do** keep every control at 44px tall and keep the `:focus-visible` outline visible.
- **Do** keep shadows at the ambient level (`0 3px 12px rgba(90, 55, 25, 0.06)`) or lighter.
- **Do** hold the 900px column and the single 600px breakpoint.

### Don't:
- **Don't** add a second accent hue, gradient, or coloured glow.
- **Don't** use pure white or pure black as the page background or body text.
- **Don't** introduce a second typeface or an icon font; icons are inline SVG strokes.
- **Don't** differentiate the two dishes by colour alone.
- **Don't** add hard-offset or high-opacity shadows, or nest cards inside cards.
- **Don't** set body text below 0.8rem, and don't let the dish chips grow into buttons.
