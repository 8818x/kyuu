---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief: Mobile map

Mode: **Read** (the visitor reads where the owner ate; the map is the way into the record).

## Job and audience

A visitor who arrives on a phone from a shared link wants to know where these shops are and what they ate there. On a phone the map is the entry point, and the primary job is: pick a shop from the pins, then read its entry.

## Outcome and proof

Tapping a pin on a phone opens the entry's details in place — dish, shop, date, note, and a way into the diary — without the Leaflet zoom buttons covering anything and without the panel sitting beyond thumb reach.

Proof: on a 390px viewport, a tapped pin shows a bottom sheet whose first line (the shop name) is fully visible, the sheet's action is reachable one-handed, and nothing is obscured by map chrome.

## Direction

The map stays the hero; the mobile map becomes thumb-first rather than a shrunken desktop map.

- Tapping a pin raises a **bottom sheet**: dish chip, shop name, date, note, and "Open in diary". It slides up under the thumb, and dismisses by its close control, by tapping the map, or by Escape on a keyboard.
- **Leaflet's zoom buttons are hidden under 600px.** Pinch is the zoom gesture on phones; removing the control is what frees the top-right corner. Desktop keeps the buttons unchanged.
- Desktop keeps its current Leaflet popup behaviour. The bottom sheet is the phone expression of the same content, not a second content model.

## Scope and boundaries

In scope: the mobile map surface only — the pin tap target, the sheet, and the zoom-control rule at the 600px breakpoint.

Untouched: the header, the tab and filter rows, the diary cards, the dish pins' shapes and colours, the summary line, the desktop popup, and all data handling. No new colours, typefaces, or radii beyond DESIGN.md's existing tokens.

Anti-goals: no map clustering, no dish filter on the map (settled separately: filters stay in Diary), no geolocation, no new map tiles or basemap, no second interaction model for desktop.

## States and ranges

- One entry or many: the sheet shows exactly one shop at a time.
- No entries: no pins exist, so no sheet; the existing map fallback applies.
- The sheet must handle a long shop name and a long note (wrap, and cap the sheet to about half the viewport with the note scrolling internally).
- Dismissed state: pin stays visible and tappable; the sheet can be reopened.

## Interaction and layout

Sheet anchors to the bottom edge, above the safe area, spanning the viewport width minus the page gutter, with corners rounded on the top edge only (DESIGN.md surface radius, 14px) and the ambient-surface shadow. It covers the lower part of the map, so the tapped pin should stay visible above it — the map pans slightly if the pin would be hidden. "Open in diary" keeps its current behaviour: switch to the Diary view, set the filter to that dish, focus the card.

## Constraints and open decisions

- Touch targets inside the sheet meet 44px; the existing global `:focus-visible` ring applies.
- The sheet must be announced to assistive tech and must not trap focus.
- Keyboard: Escape closes it; the trigger pin remains the focused element after closing.
- Open: whether the sheet gets a drag-to-dismiss handle. Default: no — a close control plus map-tap dismissal is enough, and a handle promises gesture physics this surface does not need.
