# Food Diary — redesign proposal

Planning only. No source files were changed. Stack stays HTML + CSS + vanilla JS + Leaflet + GitHub Pages. No new dependencies.

## 1. What the audit found

Full technical audit: [.impeccable/audit/2026-11-19__index-html.md](.impeccable/audit/2026-11-19__index-html.md) — 15/20. Contrast, layout, and the phone sheet are sound. The design is the problem.

## 2. Root UX/UI problems

1. **It reads as a database.** A featured card, then a uniform 3-column grid; a sidebar list, then a map. Every entry is the same shape, so nothing says "one person was here".
2. **The accent does all the work.** Orange sits on tabs, chips, rules, buttons, pins, and focus rings. With one sample photo, the UI colour becomes the identity instead of the food.
3. **Photography is a thumbnail.** The feature image is large, then everything collapses into small cards. Photos are content in a layout, not the layout itself.
4. **Navigation is generic.** Tabs and filters are correct mechanics, but they carry no sense of a personal record or a place in it.
5. **No signature.** Nothing in the first viewport would be remembered an hour later.
6. **Technical debt to carry into the rebuild:** pins do not respond to Enter, focus returns to the pin instead of the list row, desktop popups never take focus, tab/filter hit widths are under 44px, and `<time>` has no `datetime`.

## 3. Two directions

Both are dark, restrained, photography-first, and built from the same real content. Example photos are labelled as examples; no shops, prices, or claims are invented. The site name stays "Food Diary" until you replace it.

### Direction A — The Night Ledger *(recommended)*

A private record of real visits, kept like a ledger and shown like tipped-in prints.

- **World:** cloth-bound visitor's book, ink date stamps, dish stamps, off-white photo mats, a strip of numbered prints.
- **First viewport:** a narrow binding spine; masthead with `Food Diary`; a large matted photograph; an ink-stamped date and dish; the shop name in a display serif; a short typed note; a numbered print strip along the foot.
- **Visitor path:** arrived from a link → sees the newest visit as a plate → reads the note beside it → taps a print number or a stamp to move → opens the entry → follows the map link.
- **Signature interaction:** selecting a dish re-stamps every matching entry across the diary at once; a folded tape flag remembers the last entry you opened.
- **Colour strategy:** restrained. Ground and binding are near-black; the photo mat is warm off-white; brass is the only UI accent; oxblood and sage are reserved for the two dish stamps. Dish identity tints a whole region, not scattered buttons.
- **Palette:** `#111316` ground · `#0b0c0e` binding · `#d8d2c4` mat · `#ded8cc` ink · `#9a8768` brass · `#7a4a46` Zhujiaofan stamp · `#6f7a5c` Shaorou stamp.
- **Typography:** Spectral 400 for display and the reading column; Courier Prime for dates, stamps, folios, and labels. Two voices, clearly separate jobs.
- **Spacing:** 8px base. Page gutter `clamp(20px, 4vw, 56px)`; 66px binding rail; 40px between related blocks, 72px between sections. More space above a heading than below.
- **Layout rules:** Diary = spine + masthead + stamped newest plate + numbered print strip. Map = a folded endpaper list with search on desktop; on phone the list becomes a collapsible strip above the map and the sheet is a lifted ledger page. Entry = one page: full-width print, stamped metadata, typed note, map link.
- **Component rules:** stamps appear only on entries, never on navigation; buttons are ink rules, not filled blocks; one 1:1 detail call-out per entry; no cards, shadows, gradients, or glow.
- **Raised by the hand it beat:** 1:1 detail call-out (from Build Instructions) · one dish control re-marks the whole sheet (from Folded Sheet) · one hand-ink annotation (from Drawn Zine) · persistent "you were here" tape flag (from Select Rail) · colour as the sheet, not the mark (from Copy-Shop Stock) · monumental counts and dish labels (from Wayfinding Bands).
- **Honest risk:** the stamp motif can turn into decoration if it repeats on every element. Stamps stay on entries only.

### Direction B — The Light Table

The photograph is the entry; the interface is only the frame number beside it.

- **World:** a photographer's contact sheet laid on a matte light table.
- **First viewport:** a masthead with frame count; one hero frame with a grease-pencil circle; a quiet caption column with shop, date, and note; a numbered contact strip along the foot.
- **Visitor path:** newest frame first → read the caption → scrub the contact strip → open the frame.
- **Signature interaction:** a single grease-pencil circle marks the chosen frame; frame numbers are the wayfinding.
- **Colour strategy:** near-black board, warm white ink, one grease-pencil red. No dish colours in the UI at all.
- **Palette:** `#0e1012` board · `#e6e2d8` ink · `#c8c2b4` frame rule · `#9c4a42` grease pencil.
- **Typography:** Archivo for UI and captions; Instrument Serif italic for the owner's one handwritten line.
- **Spacing:** 8px base. 46px outer gutters, 34px work padding, 44px contact strip.
- **Layout rules:** Diary = hero frame + caption column + contact strip. Map = the same sheet with a pin over the frame index. Entry = one framed plate at full size.
- **Component rules:** frame number on every photo; one annotation maximum; no colour chips, no filled buttons.
- **Honest risk:** this is where most photography-led redesigns land. Familiar and effective, but less distinct than A.

## 4. Recommendation

**Take Direction A, The Night Ledger.** It is the one neither this site nor the category already ships. It gives you a personal record instead of a gallery: real visits, stamped and kept. Direction B is the safe, strong alternative if you want pure photography with almost no identity layer.

Both first-viewport sketches are on the decision page: **http://127.0.0.1:52461/**

## 5. Boundaries for the build

- Keep: all real entry data, the two dish names, the `#/e/` links, Leaflet, GitHub Pages, no build step, no new dependencies.
- Keep: contrast AA or better, 44px touch targets, keyboard paths, reduced motion, the working phone sheet.
- Change: visual world, layout, navigation treatment, content hierarchy.
- Do not invent: shops, photos, ratings, prices, quotes, or claims.

## 6. Next

Stop here for your choice. After you pick, the next pass writes the direction contract and builds the chosen world — still no dependency changes.
