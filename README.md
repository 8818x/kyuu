# Food Diary

A small map-and-diary site for recording where the good pork is.

## Add a shop

1. Copy a block in `data/entries.js`:
   - `date`: `YYYY-MM-DD`
   - `shop`: shop name
   - `type`: `Zhujiaofan` or `Shaorou`
   - `image`: path under `images/`
   - `maps`: the **full** Google Maps link from your browser bar, containing `@lat,lng` (short `maps.app.goo.gl` links will not make a pin)
   - `note`: a short note
2. Put the photo in `images/`.
3. Change the site title in `index.html` line 6 (and the `<h1>` in the header).
4. Publish:

```
git add -A
git commit -m "update diary"
git push
```

GitHub Pages updates in about a minute.

## Basemap

The map uses **Esri World Dark Gray Canvas** keyless raster tiles:
`https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`

Attribution required in the map: "Tiles © Esri — Esri, HERE, Garmin, © OpenStreetMap contributors". The tile URL and attribution string live in `app.js` (`initMap`). If the provider ever starts requiring an API key (CARTO's tiles did exactly that), swap both the URL and the attribution, and confirm a real tile loads — a dead basemap shows a visible warning line above the map.
