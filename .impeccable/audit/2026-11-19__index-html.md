# Impeccable Technical Audit — index.html

Date: 2026-11-19 · Target: `index.html` (live at `https://8818x.github.io/zhu-jiao-fan/`) · Mode: Read · Web

Scope: technical quality only. No files were changed. Evidence came from source reading, the bundled Impeccable detector, and live Playwright DOM/computed-style and interaction checks at 1280×800 and 390×844. Screenshots were captured by the browser tool but could not be visually inspected in this session; all visual claims below rest on measured DOM/CSS values, not pixel review.

## Audit Health Score

| # | Dimension | Score | Key finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 3/4 | Contrast passes AA everywhere; pins are focusable but do not open on keyboard activation, and focus return / popup focus are wrong |
| 2 | Performance | 3/4 | Lazy images, small CSS, no heavy animation; `fitBounds` ignores reduced motion, CDN scripts have no SRI |
| 3 | Theming | 3/4 | Tokens used via `@apply`/`theme()`; a few literal colors and pin hex values bypass tokens; `design.json` sidecar is stale |
| 4 | Responsive Design | 3/4 | No overflow at 390 or 1280, correct 1/2/3-column grid, sheet works; tab and "All" filter widths are under the 44px floor |
| 5 | Implementation Integrity | 3/4 | Coherent, product-specific; detector output is mostly advisory drift from the stale sidecar |
| **Total** | | **15/20** | **Good — address weak dimensions** |

## Implementation Integrity Verdict

**Pass.** The implementation expresses a coherent, product-specific system: one dark reading room for two named dishes, a map with two pin shapes, tokens driven from `tailwind.config.js`, and a phone sheet that follows the pinned surface brief. The detector's "overused font" warning on Fraunces is a **false positive for this project** — the font is pinned in the user's direction contract, and the brief wins. The `cramped-padding` warning on `.map-layout` is also a false positive: the map canvas and shop list are meant to fill their bordered frame, and both carry internal padding. No generic AI-template structure was found.

## Executive Summary

- Score: **15/20 (Good)**.
- Issues: **1 P1, 4 P2, 5 P3**. No P0.
- Top issues: keyboard-inactive map pins; focus returns to the pin instead of the originating list row; desktop popups never take focus; narrow tab/filter hit widths; reduced-motion not applied to `fitBounds`.
- Next: fix the keyboard/focus cluster (`/impeccable harden`), then `/impeccable polish`.

## Detailed Findings

### [P1] Map pins are focusable but cannot be activated by keyboard
- **Location**: `app.js` — `ensureMap()` marker setup (lines 529–546); Leaflet gives marker icons `tabindex="0"`
- **Category**: Accessibility
- **Impact**: A keyboard user can Tab to a pin, hears its label, but Enter/Space does nothing. Clicking the same pin works. The shop-list buttons provide an equivalent path, so the task is not blocked, but the primary map action is a dead control for keyboard users.
- **Standard**: WCAG 2.1.1 Keyboard (equivalent control exists, so not a hard A failure, but a real defect)
- **Evidence**: live at 390px — marker had `tabindex=0` and `aria-label="Sample Shop, Zhujiaofan"`; Playwright click opened the sheet; `Enter` twice left `sheet.dataset.open === "false"`.
- **Recommendation**: add a `keydown` handler on the marker element for Enter and Space that calls `activateShop(id, false)` and prevents default on Space.
- **Suggested command**: `/impeccable harden`

### [P2] Closing the phone sheet returns focus to the pin, not the control that opened it
- **Location**: `app.js` — `activateShop()` passes `marker` into `openSheet()` (line 469), which sets `sheetTrigger` (line 575); `closeSheet()` restores it (lines 597–600)
- **Category**: Accessibility
- **Impact**: A keyboard or switch user who opens the sheet from a shop-list row lands on the map pin after Escape/Close, losing their place in the list.
- **Standard**: WCAG 2.4.3 Focus Order
- **Evidence**: clicked `.shop-item`, pressed Escape; `document.activeElement` was `leaflet-marker-icon`, not the `.shop-item` button.
- **Recommendation**: pass the actual trigger element (`fromList ? the row button : marker.getElement()`) into `openSheet`.
- **Suggested command**: `/impeccable harden`

### [P2] Desktop popups open without moving focus into them
- **Location**: `app.js` — `activateShop()` desktop branch (lines 470–475)
- **Category**: Accessibility
- **Impact**: Keyboard activation of a shop row opens a Leaflet popup, but focus stays on the row. The popup's "Open in Google Maps" and "Open entry" controls sit later in the tab order, after the rest of the list and all pins.
- **Standard**: WCAG 2.4.3 Focus Order
- **Evidence**: focused `.shop-item`, pressed Enter — popup present, `document.activeElement` still `.shop-item`.
- **Recommendation**: after `openOn(map)`, focus the popup's primary button (or its close button) and return focus to the invoking row on popupclose.
- **Suggested command**: `/impeccable harden`

### [P2] Tab and "All" filter hit widths are below the 44px craft floor
- **Location**: `src/input.css` — `.tab` (lines 68–75), `.filter` (lines 85–91)
- **Category**: Responsive Design
- **Impact**: Small horizontal hit area on touch. WCAG 2.5.8 AA still passes via the 24×24 minimum plus the spacing exception (gaps are 28px and 22px), but this breaks the project's own "all controls are 44px tall / 44px touch targets" rule.
- **Evidence**: at 390px, `.tab` boxes measured 39×46 and 34×46; `.filter` "All" measured 16×44, "Zhujiaofan" 66×44, "Shaorou" 52×44.
- **Recommendation**: add horizontal padding (e.g. `padding: 12px 12px`) so every tab and filter reaches 44px width, and reduce the gap to keep the row within 390px.
- **Suggested command**: `/impeccable adapt`

### [P2] `time` elements have no `datetime` attribute
- **Location**: `app.js` — `makeMeta()` line 91, `makeFeatured()` line 187, `makeCard()` line 236
- **Category**: Accessibility
- **Impact**: Screen readers and future tooling get only the formatted label ("Nov 17, 2026"), not a machine-readable date. Low user impact today with one entry.
- **Standard**: Semantic HTML / WCAG 1.3.1
- **Evidence**: 1 of 1 `<time>` elements on the live page had no `datetime`.
- **Recommendation**: set `date.setAttribute("datetime", entry.date)` wherever a `<time>` is built.
- **Suggested command**: `/impeccable harden`

### [P3] `map.fitBounds()` ignores reduced-motion
- **Location**: `app.js` — `updateMapMarkers()` line 495
- **Category**: Accessibility / Performance
- **Impact**: Users who ask for reduced motion still get an animated map fly-to when filters change.
- **Evidence**: reduced-motion is respected for the sheet transition (`input.css` line 323) and `panTo` (line 465), but not `fitBounds`.
- **Recommendation**: pass `{ animate: !prefersReducedMotion() }` to `fitBounds`.
- **Suggested command**: `/impeccable harden`

### [P3] Hard-coded colors and font sizes outside the design system
- **Location**: `src/input.css` — `.map-error` `#6a2f22` (line 256), rgba literals (lines 247–248, 260, 283); `app.js` — pin SVG hexes `#ff6129`, `#99af67`, `#171a20` (lines 352–361)
- **Category**: Theming
- **Impact**: Token changes will not reach these values; drift accumulates silently. The detector also flagged ~16 literal font sizes as off the DESIGN.md ramp.
- **Note**: many font-size advisories are unreliable because `.impeccable/design.json` is stale relative to `DESIGN.md`.
- **Recommendation**: move the error background and rgba values into tokens; have pin SVGs read tokens from CSS. Refresh the sidecar with `/impeccable document` before acting on font-size advisories.
- **Suggested command**: `/impeccable document`

### [P3] Third-party CDN scripts load without SRI
- **Location**: `index.html` — Leaflet CSS/JS from unpkg (lines 11, 85)
- **Category**: Implementation Integrity
- **Impact**: A compromised CDN could alter the map code. Version is pinned to 1.9.4, which limits but does not remove the risk.
- **Recommendation**: add `integrity` and `crossorigin` attributes with the published hashes.
- **Suggested command**: `/impeccable harden`

### [P3] Manual cache-bust query strings on local assets
- **Location**: `index.html` — `styles.css?v=14`, `entries.js?v=14`, `app.js?v=14` (lines 12, 86–87)
- **Category**: Performance
- **Impact**: Every deploy requires a manual version bump, or returning visitors keep stale CSS/JS. Easy to forget.
- **Recommendation**: use content hashes at deploy time, or a build step that rewrites these query strings.
- **Suggested command**: `/impeccable polish`

### [P3] Map has no visible fallback when there are no entries with coordinates
- **Location**: `app.js` — `coordsFromLink()` returns null for short links (lines 28–40); `updateMapMarkers()` just draws nothing (lines 479–497)
- **Category**: Implementation Integrity
- **Impact**: A short `maps.app.goo.gl` link yields no pin with no warning. Documented in PRODUCT.md as a known constraint, so this is a documented sharp edge, not a surprise.
- **Recommendation**: optional — surface a small warning in the shop list when an entry has no parseable coordinates.
- **Suggested command**: `/impeccable clarify`

## Detector Result (verified, not copied blindly)

- **Warnings**: `cramped-padding` on `.map-layout` — false positive (intentional full-bleed map frame). `overused-font` Fraunces ×2 — false positive for this project (font is pinned by the user's direction contract).
- **Advisories**: one undocumented color `#6a2f22` (real, minor — listed P3), and ~16 off-ramp font sizes (low confidence — sidecar is stale).
- **No contrast failures** were reported. Manual check confirmed all key pairs pass AA: cream/ground 13.5:1, muted/ground 7.45:1, orange/ground 5.8:1, olive/ground 7.2:1, cream/surface 11.59:1, muted/surface 6.4:1, orange/surface 4.98:1, ground-on-orange 5.8:1, ground-on-olive 7.2:1, cream/error-bg 7.96:1.

## Patterns & Systemic Issues

- Focus management is the weak spot: three separate places open a detail surface (sheet, desktop popup, entry route) and only the entry route restores focus deliberately.
- Reduced-motion handling is applied case by case rather than centrally — one path (`fitBounds`) was missed.
- The design tokens are real and mostly respected, but a handful of values live in JS/rgba literals and will not follow token changes.

## Positive Findings

- Contrast is uniformly AA or better; the dark palette is measured, not guessed.
- Skip link, landmarks, `aria-live` status, `aria-pressed` on tabs/filters, alt text, and a visible 2px orange focus ring are all present and working in the live page.
- No horizontal overflow at 390px or 1280px; the 600/900px breakpoints produce the intended 1/2/3-column layouts.
- Phone sheet: 44×44 close button, 104×44 primary action, focus moves to Close, Escape closes and returns focus, note area scrolls, sheet capped at 60vh.
- Zoom control hides under 600px; dark Esri tiles load with no error line.
- Images use lazy loading except the eager featured image; CSS is 15KB compiled; no expensive animations or `will-change` abuse.
- `/impeccable audit` and the product brief both hold: no invented shops, photos, ratings, or prices.

## Recommended Actions

1. **[P1] `/impeccable harden`** — make map pins respond to Enter/Space.
2. **[P2] `/impeccable harden`** — fix sheet focus return and move focus into desktop popups; add `datetime` to `<time>`.
3. **[P2] `/impeccable adapt`** — widen tab and filter hit areas to 44px on phones.
4. **[P3] `/impeccable document`** — refresh `design.json` from `DESIGN.md` before trusting font-size advisories; fold the error color into tokens.
5. **[P3] `/impeccable polish`** — reduced-motion on `fitBounds`, SRI for CDN scripts, automatic cache busting.
6. **[P3] `/impeccable polish`** — final pass if any fixes land.

You can ask me to run these one at a time, all at once, or in any order you prefer.

Re-run `/impeccable audit` after fixes to see your score improve.
