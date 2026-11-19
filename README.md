# Food Diary

A personal food diary of two dishes: Zhujiaofan and Shaorou. Built as a static site — HTML, one CSS file, vanilla JavaScript, Leaflet, GitHub Pages. No build step, no packages.

## Add a plate

1. Copy a block in `data/entries.js`.
   - `date`: `YYYY-MM-DD`
   - `shop`: shop name
   - `type`: `Zhujiaofan` or `Shaorou`
   - `image`: path under `images/`
   - `maps`: the **full** Google Maps link from your browser bar, containing `@lat,lng` (short `maps.app.goo.gl` links will not make a pin)
   - `note`: a short note
   - Optional: `id` for a stable `#/e/…` link, `photos` for more than one photo, `rating`, `price`.
2. Put the photograph in `images/`.
3. Publish:

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
- `data/entries.js` — the only file the owner edits
- `fonts/` — self-hosted Taviraj and Noto Sans Thai, each with Latin and Thai subsets

## Look and behaviour

Paper Editorial: a newsprint ground, white photo mounts, black ink and one vermilion rule. Diary is the front door, with its own search field for large archives; Map has a searchable list on desktop and a collapsible sheet on phones; an entry opens one large plate with its note. The last entry you opened gets a red tape flag.

Keyboard works throughout: pins respond to Enter and Space, the sheet closes with Escape and returns focus, and all controls show a red focus ring. Reduced-motion is respected.

## Basemap

Esri World Light Gray Canvas keyless raster tiles. Attribution is required in the map: "Tiles © Esri — Esri, HERE, Garmin, © OpenStreetMap contributors". The URL and attribution live in `app.js`. If the provider starts requiring an API key, swap both and confirm a real tile loads — a dead basemap shows a visible warning line.
