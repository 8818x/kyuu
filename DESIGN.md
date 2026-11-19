---
name: Food Diary
description: The Night Ledger — a private record of two dishes, kept as tipped-in prints.
colors:
  ground: "#111316"
  binding: "#0b0c0e"
  surface: "#191c1f"
  mat: "#d8d2c4"
  mat-ink: "#36342e"
  ink: "#ded8cc"
  muted: "#9a968b"
  brass: "#9a8768"
  stew: "#7a4a46"
  stew-text: "#d9a49b"
  crisp: "#6f7a5c"
  crisp-text: "#bcc9a7"
  rule: "#2a2d30"
  photo-well: "#292e2a"
  error: "#4a2a26"
typography:
  display:
    fontFamily: "Spectral, Georgia, serif"
    fontWeight: 400
    fontSize: "clamp(2.8rem, 5vw, 4.6rem)"
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Spectral, Georgia, serif"
    fontWeight: 400
    fontSize: "1rem"
    lineHeight: 1.7
  label:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontWeight: 400
    fontSize: "0.78rem"
    lineHeight: 1.5
    letterSpacing: "0.16em"
rounded:
  none: "0px"
spacing:
  tight: "8px"
  base: "16px"
  section: "40px"
  wide: "72px"
components:
  ink-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "6px 0"
  filter-stamp:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    padding: "8px 14px"
  photo-mat:
    backgroundColor: "{colors.mat}"
    textColor: "{colors.mat-ink}"
    padding: "16px"
---

# Design System: Food Diary

## Overview

**Creative North Star: "The Night Ledger"**

A private record of real visits, kept like a bound book and shown as tipped-in prints. The visitor arrives on a dark page and meets one large photograph on a warm paper mat, an ink date stamp, a dish stamp, and the owner's line beside it. The interface behaves like bookbinding: a rail down the left edge, folio numbers, a strip of numbered prints, a tape flag marking the last entry opened. Nothing here is a dashboard.

Colour belongs to the food. The UI holds a near-black cloth ground, one warm paper mat, and a single brass accent; oxblood and sage exist only as the two dish stamps. There are no filled buttons, no cards, no gradients, no glow, no glass. Depth comes from a paper mat and one soft, offset shadow, not from stacked panels.

**Key Characteristics:**
- Ground `#111316`, surface `#191c1f`, ink `#ded8cc` (13.1:1 on ground), muted `#9a968b` (6.3:1), brass `#9a8768` (5.35:1).
- Paper mat `#d8d2c4` with `#36342e` ink (8.26:1) is the only light field; every photograph sits on it.
- Two dish stamps: oxblood `#7a4a46` for Zhujiaofan, sage `#6f7a5c` for Shaorou. Each has a lighter text tint for dark ground.
- Spectral for display and reading, Courier Prime for stamps, dates, folios, and labels.
- Square throughout. 44px minimum controls, 2px brass focus ring.

## Colors

A dark, quiet palette where one paper field carries the images and one metal accent carries the few actions.

### Primary
- **Brass** (`#9a8768`): the only UI accent. Active tab, selected filter, faint rules, folio numbers, the tape flag, the focus ring. Never a large fill.

### Secondary
- **Oxblood** (`#7a4a46`) and **Sage** (`#6f7a5c`): the two dish stamps and their map pins. They identify the dish; they are not decoration and never appear on navigation.

### Neutral
- **Cloth Ground** (`#111316`): the page.
- **Binding** (`#0b0c0e`): the left rail.
- **Raised Surface** (`#191c1f`): the map list and phone sheet.
- **Paper Mat** (`#d8d2c4`): every photograph's mount, with `#36342e` ink.
- **Ink** (`#ded8cc`) and **Muted** (`#9a968b`): text and secondary text.
- **Rule** (`#2a2d30`): one-pixel separators.

### Named Rules
**The Mat Rule.** Every photograph sits on paper. No photo is placed directly on the dark ground.
**The Two-Stamp Rule.** Oxblood and sage belong to dishes only. Brass belongs to actions only. They never swap jobs.

## Typography

**Display and Body Font:** Spectral (Georgia fallback). Self-hosted as `fonts/spectral-400.woff2` and `fonts/spectral-600.woff2`.
**Label Font:** Courier Prime (Courier New fallback). Self-hosted as `fonts/courier-prime-400.woff2` and `fonts/courier-prime-700.woff2`.

**Character:** Spectral gives the record a calm, printed voice; Courier Prime reads as a typed mark on a ledger page. The two never blur together.

### Hierarchy
- **Display** (400, `clamp(2.8rem, 5vw, 4.6rem)`, 1.04, -0.03em): shop names on Diary and Entry.
- **Section** (400, `1.6rem`, 1.1): wordmark and major labels.
- **Body** (400, `1rem`, 1.7, max 68ch): notes and running text.
- **Annotation** (400, `1.12rem`, 1.75, max 62ch): the owner's note beside the newest print.
- **Label** (400, `0.62–0.82rem`, 0.14–0.22em tracking, uppercase): stamps, folios, tabs, filters, plate labels.

### Named Rules
**The Two-Voice Rule.** Courier Prime is for measurement and labels only; running text is always Spectral.

## Layout

A 44–66px binding rail runs down the left edge; the page sits to its right with a `clamp(20px, 4vw, 56px)` gutter and a 1560px cap. The Diary opens with the newest visit as a two-column spread (photo mat left, stamped record right), then a horizontal, scroll-snapping print strip of every entry. The Map is a 320px searchable list beside the map; on phones the list collapses to a strip and the sheet rises from the bottom. An Entry is a single 960px column.

Breakpoints at 900px and 600px only. Under 600px the rail narrows to 44px, the spread stacks, the map list collapses, and Leaflet zoom controls hide. Spacing rhythm: 8px inside groups, 16px base, 40px between related blocks, 72px between sections. More space above a heading than below it.

## Elevation & Depth

Depth is physical, not atmospheric: a paper mat, a one-pixel rule, and one soft offset shadow under a mounted print. No shadows on controls, no glow, no halo.

### Shadow Vocabulary
- **Mounted print** (`8px 12px 28px rgba(0,0,0,.35)`): only under a paper mat.
- **Phone sheet** (`0 -10px 30px rgba(0,0,0,.55)`): only when the sheet is open.
- **Leaflet popup** (`6px 10px 22px rgba(0,0,0,.45)`): the third-party slip.

## Shapes

Square everywhere: filters, tabs, list rows, sheet, inputs. No rounded cards. The only cuts are the folded tape flag and the two pin silhouettes: an oxblood teardrop and a sage diamond, each outlined in ground colour so they read on the dark basemap. Plate labels sit half-outside the mat edge.

## Components

### Buttons
- **Shape:** square, no radius; an ink rule under the label rather than a filled block.
- **Ink link:** transparent, `#ded8cc` text, 1px brass underline, `0.78rem` Courier Prime, 6px 0 padding.
- **Filters:** 1px `#2a2d30` border, muted label with a brass count; active gets a brass border. 44px tall.
- **Hover / Focus:** brass text or border; 2px brass focus ring with 3px offset.

### Stamps
- **Date stamp:** double brass rule, rotated -1deg, Courier Prime, tabular numerals.
- **Dish stamp:** two-pixel oxblood or sage rule with a lighter text tint, rotated -2deg or +2deg. Entries only.

### Photo mat
- **Mat:** `#d8d2c4`, 16px padding, 8px 12px 28px offset shadow.
- **Label:** brass-bordered Courier plate number overlapping the top-left corner.
- **Detail variant:** 1:1 control sits in the caption below the image and opens a full-size lightbox.

### Print strip
- Horizontally scrollable, snap-aligned paper thumbnails, 168px on desktop and 140px on phones.
- Current entry carries a 2px brass ring; last-viewed entry carries the folded tape flag.

### Map list and sheet
- **List:** muted surface, one-pixel separators, 52px thumbnails, brass underline on the selected row.
- **Sheet:** paper-toned surface with a grip that collapses details; Escape closes and returns focus to the pin.

### Navigation
- Wordmark and two page tabs in the masthead. Active tab gets a 2px brass underline. Tabs are 56px wide minimum.

## Do's and Don'ts

### Do:
- **Do** mount every photograph on the paper mat with a plate number.
- **Do** keep brass under 10% of any screen; its rarity is the point.
- **Do** keep all controls at least 44px with a 2px brass focus ring.
- **Do** let the print strip carry scale from one entry to a hundred.

### Don't:
- **Don't** use bright orange, neon accents, gradients, glass, or glow.
- **Don't** put dish stamps on navigation or UI chrome.
- **Don't** add cards, nested panels, or decorative section numbers.
- **Don't** invent shops, photographs, ratings, or prices.
