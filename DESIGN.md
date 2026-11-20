---
name: Kyuu
description: Paper Editorial — a white broadsheet with black ink and one red rule.
colors:
  ground: "#f7f5ef"
  paper: "#ffffff"
  surface: "#ece8de"
  ink: "#161514"
  secondary: "#6a655e"
  accent: "#bf2f1e"
  accent-deep: "#962617"
  rule: "#d5cfc4"
  rule-strong: "#bdb5a7"
  photo-well: "#e4e0d6"
  error: "#f3e0da"
typography:
  display:
    fontFamily: "Taviraj, Georgia, serif"
    fontWeight: 500
    fontSize: "clamp(2.5rem, 5vw, 4rem)"
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  body:
    fontFamily: "'Noto Sans Thai', Arial, sans-serif"
    fontWeight: 400
    fontSize: "1rem"
    lineHeight: 1.8
  label:
    fontFamily: "'Noto Sans Thai', Arial, sans-serif"
    fontWeight: 500
    fontSize: "0.75rem"
    lineHeight: 1.4
    letterSpacing: "0.10em"
  cjk:
    fontFamily: "Arial, sans-serif"
    fontWeight: 500
    fontSize: "0.75rem"
    lineHeight: 1.4
spacing:
  tight: "8px"
  base: "16px"
  section: "32px"
  wide: "64px"
components:
  ink-link:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    padding: "6px 0"
  photo-mount:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.accent}"
    padding: "14px"
  tab-active:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "10px 6px"
---

# Design System: Kyuu

## Overview

**Creative North Star: "Paper Editorial"**

A serious broadsheet that happens to be about dinner. Newsprint ground, white photo mounts, black ink, one red rule. The page is set, not decorated: hairlines divide, dates are tabular, and the only saturated colour is a single vermilion used for marks and actions. Food photography carries every bit of warmth the page has.

There are no cards, no shadows, no rounded panels, and no coloured buttons. Depth comes from paper against newsprint and from the rule that sits under the active thing. The red is deliberately scarce — it is the reader's pointer, not a landscape.

**Key Characteristics:**
- Newsprint `#f7f5ef`, white mounts `#ffffff`, ink `#161514` (16.7:1), secondary `#6a655e` (5.3:1).
- One accent: vermilion `#bf2f1e` (5.29:1 on ground, 4.71:1 on surface, 5.77:1 on white). Darkened one step from the explored `#d23b2a` to clear AA on every surface.
- Taviraj for display, Noto Sans Thai for reading, dates, folios and labels. Thai and Latin ship in every weight.
- Square corners throughout. One-pixel rules. No shadows anywhere.

## Colors

A printed page: warm-neutral paper, black ink, and one signal red.

### Primary
- **Vermilion** (`#bf2f1e`): the only accent. Active tab and filter, plate label, tape flag, underlined actions, focus ring. Never a background fill.

### Secondary
- **Ink** (`#161514`): the primary text colour.

### Neutral
- **Newsprint** (`#f7f5ef`): the page ground.
- **Paper** (`#ffffff`): photograph mounts, masthead, popup, sheet, lightbox caption.
- **Surface** (`#ece8de`): map list and binding rail.
- **Secondary** (`#6a655e`): dates, metadata, captions.
- **Rule** (`#d5cfc4`) and **Rule Strong** (`#bdb5a7`): one-pixel separators and input underlines.
- **Photo Well** (`#e4e0d6`): the fill behind a photograph before it loads.
- **Error Wash** (`#f3e0da`): map tile failure notice, with a red bottom rule.

### Named Rules
**The One Red Rule.** Red marks a state or an action. It never fills a large area and never appears twice as decoration in the same component.
**The Paper Rule.** Photographs sit on white paper. The ground is newsprint. They must never share a surface.

## Typography

**Display:** Taviraj (Georgia fallback), self-hosted in `fonts/`, Latin and Thai subsets per weight.
**Body:** Noto Sans Thai (Arial fallback), self-hosted in `fonts/`, Latin and Thai subsets per weight.
**Label:** Noto Sans Thai (Arial fallback), weight 500, same files as the body face.
**Character:** Taviraj gives shop names a quiet printed authority in both scripts. Noto Sans Thai is built for long Thai reading and stays crisp on a phone; the same face at weight 500 handles dates and labels. Two voices, two jobs.

### Hierarchy
- **Display** (500, `clamp(2.5rem, 5vw, 4rem)`, 1.12, -0.015em): shop name; 40px on phones.
- **Wordmark** (400, `1.9rem`): masthead.
- **Body** (400, `1rem`, 1.8, max 68ch): notes.
- **Annotation** (400, `1.12rem`, 1.8, max 66ch): the newest note, set above a rule.
- **Label** (500, `0.75rem`, 1.4, 0.10em tracking, uppercase): tabs, filters, dates, plate numbers, counts. Micro labels such as plate numbers may drop to `0.62rem` but keep the same face and tracking.

### Named Rules
**The Two-Script Rule.** Every type role uses a face with real Thai glyphs. Latin and Thai never fall back to different families, and no role uses a system display face.

## Layout

A 66px rail down the left edge (44px on phones), a masthead on white, and a newsprint reading area with a `clamp(20px, 4vw, 56px)` gutter and a 1560px cap. The Diary opens with one large mounted photograph beside a text column, followed by a ruled strip of numbered prints. The Map is a 320px searchable list beside the map; on phones it collapses to a strip above the map and a white sheet rises from the bottom. An Entry is one 960px column.

Breakpoints only at 900px and 600px. Rhythm: 8px inside groups, 16px base, 32px between related blocks, 64px between sections. More space above a heading than below it. The first print strip sits inside the first viewport at 1440×900.

## Elevation & Depth

Flat. No shadows on mounts, controls, sheets, or popups. Depth is made from white paper on newsprint and from the red rule that marks the active element. The lightbox uses a dark surround, but that is a viewing surface, not a page surface.

## Shapes

Square everywhere. The plate label is a solid red rectangle overlapping the mount corner; the tape flag is a small folded notch. Map pins keep their two silhouettes — a red teardrop and an ink diamond — outlined in white so they read on light tiles.

## Components

### Buttons and links
- **Ink link:** transparent, vermilion text, 1px red underline, Noto Sans Thai uppercase at 500, 6px 0. Hover deepens to `#962617`.
- **Tabs:** Noto Sans Thai uppercase at 500, active gets a 2px red underline; 56px minimum width, 48px tall.
- **Filters:** text only, active gets red text and a 2px red underline with a tabular count.

### Photo mount
- **Mount:** white, 1px `#d5cfc4` border, 14px padding, no shadow.
- **Plate label:** red block, white Noto Sans Thai text at 500, overlapping the top-left corner.
- **Detail variant:** caption under the mount carries a 1:1 control that opens a full-size lightbox.

### Print strip
- Ruled top edge, numbered white thumbnails, current one marked by a 2px red bottom rule, last-viewed one by the tape flag.

### Map and sheet
- **List:** surface ground, hairline separators, active row on white with a 2px red bottom rule.
- **Popup:** white paper slip, ink text, one-pixel border, no shadow.
- **Sheet:** white paper, red grip, same content as the popup, collapsible by the grip.

### Navigation
- Wordmark and two tabs in the masthead. Focus ring is 2px vermilion with 3px offset.

## Do's and Don'ts

### Do:
- **Do** keep the red to marks and actions; one red per component.
- **Do** mount every photograph on white paper with a plate number.
- **Do** keep the print strip inside the first desktop viewport.
- **Do** keep all controls at least 44px with a visible red focus ring.

### Don't:
- **Don't** add cards, shadows, rounded panels, gradients, or glass.
- **Don't** use a second accent colour; ink is a neutral mark.
- **Don't** swap in a font without Thai glyphs for any type role.
- **Don't** invent shops, photographs, ratings, or prices.
