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
