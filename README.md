# Kyuu

A personal photo diary of meals out. The mark is 九 (nine), read "Kyuu". Built as a static site — HTML, one CSS file, vanilla JavaScript, Leaflet, GitHub Pages. No build step, no packages.

## Add a plate

Put the photo anywhere, then run one command from the project root:

```
python scripts/add_entry.py <image> "<shop>" <type> <maps> [--label "A la carte"] [--note "..."] [--date YYYY-MM-DD]
```

Example:

```
python scripts/add_entry.py images/IMG_20260501_120000.jpg "ร้านตัวอย่าง" Roti "13.75,100.50" --note "อร่อย"
```

- `<image>` is copied into `images/` if needed.
- Date is read from the photo's EXIF (or its `IMG_YYYYMMDD_…` name); use `--date` to override.
- EXIF is stripped from the stored original, and a 1200px `*-display.webp` is generated.
- `<type>` can be any key (`PadThaiHoiTod`, `Roti`, `ALaCarte`, `KhaoKhaMu`, or a new one). A new key is registered in `app.js` automatically; pass `--label` for its display name.
- `<maps>` accepts either `lat,lng` or a full Google Maps URL containing `@lat,lng`.
- Add `--dry-run` to preview without writing.

Then publish:

```
git add -A
git commit -m "update diary"
git push
```

GitHub Pages updates in about a minute.

## Files

- `index.html` — the page shell
- `styles.css` — the whole visual system, hand-authored plain CSS
- `app.js` — rendering, routing, map, and interactions
- `data/entries.js` — the entry list (normally written by `scripts/add_entry.py`)
- `scripts/add_entry.py` — one-command helper: date, metadata, display image, entry, cache version
- `fonts/` — self-hosted Taviraj and Noto Sans Thai, each with Latin and Thai subsets

## Look and behaviour

Paper Editorial: a newsprint ground, white photo mounts, black ink and one vermilion rule. Diary is the front door, with a ledger strip that gains jump controls as the archive grows. Dish filters with zero entries hide themselves. Dish labels are Thai transliterations (Pad Thai / Hoi Tod, Roti, A la carte, Khao Kha Mu); the stored `type` keys are English identifiers. ผัดไทย and หอยทอด share one combined type. Photo markers read PLATE. Entries are read in place — nothing links into a separate detail page. The map groups visits by shop: one pin per restaurant, and the popup or phone sheet lists every visit with its date, dish and note. Map has a searchable list on desktop and a collapsible sheet on phones.

Keyboard works throughout: pins respond to Enter and Space, the sheet closes with Escape and returns focus, and all controls show a red focus ring. Reduced-motion is respected.

## Basemap

Esri World Street Map keyless raster tiles. Attribution is required in the map: "Tiles © Esri — Esri, HERE, Garmin, © OpenStreetMap contributors, and the GIS User Community". The URL and attribution live in `app.js`. If the provider starts requiring an API key, swap both and confirm a real tile loads — a dead basemap shows a visible warning line.
