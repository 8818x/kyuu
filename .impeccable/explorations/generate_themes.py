from pathlib import Path

OUT = Path(r"C:\Users\Amane\Downloads\2026\zhu-jiao-fan\.impeccable\explorations\themes.html")
IMG = "images/"

themes = [
 dict(rank=1, name="Silver Halide", mood="A premium gallery at closing time. Near-black with a silver thread, quiet and expensive. The photograph is the only bright thing in the room.",
  bg="#0f1012", surface="#1c1e21", text="#f2f3f5", sec="#a9adb5", acc="#c8ccd4", bd="#33363c",
  disp="'Bodoni Moda', Georgia, serif", body="'Archivo', sans-serif", lab="'DM Mono', monospace",
  ui="No cards. The photo sits on a 12px silver-grey mat; buttons are underlined serif text; navigation is a single hairline row; spacing is generous (40–72px).",
  good="Photographs dominate completely; feels refined and editorial; ages well.",
  bad="Low colour interest; silver accent can read as plain grey without real photos."),
 dict(rank=2, name="Mineral Slate", mood="Cool, calm, almost clinical. Graphite surfaces and a single muted teal signal. Modern without being cold.",
  bg="#101416", surface="#1a2124", text="#e8eef0", sec="#9fb0b6", acc="#55b8ad", bd="#2a373b",
  disp="'Manrope', sans-serif", body="'Manrope', sans-serif", lab="'JetBrains Mono', monospace",
  ui="Flat surfaces, one-pixel rules, square controls; navigation is a quiet top row; spacing is even and breathable.",
  good="Very readable; teal is distinctive but restrained; scales well from one entry to many.",
  bad="Safe choice; teal may feel clinical for a personal diary."),
 dict(rank=3, name="Cobalt Studio", mood="Confident and contemporary. Midnight navy with a clean cobalt signal. Design-studio energy, but not a dashboard.",
  bg="#0a0d1a", surface="#141a2e", text="#eef1ff", sec="#a3acc9", acc="#5b7cfa", bd="#273151",
  disp="'Archivo', sans-serif", body="'Archivo', sans-serif", lab="'DM Mono', monospace",
  ui="Square buttons with a cobalt underline; tight photo-led grid; navigation tabs sit under the wordmark; spacing is crisp.",
  good="Strong identity that is not food-coloured; excellent dark contrast; photographs pop against navy.",
  bad="Cobalt is close to blue-tech default; needs careful spacing to avoid SaaS feel."),
 dict(rank=4, name="Violet Static", mood="Experimental and art-book like. Deep aubergine with an electric lilac signal and slightly off-kilter type.",
  bg="#0c0812", surface="#1a1226", text="#f0e9ff", sec="#ad9fc2", acc="#a06bff", bd="#302143",
  disp="'Bricolage Grotesque', sans-serif", body="'Spectral', Georgia, serif", lab="'DM Mono', monospace",
  ui="Dashed hairlines, offset labels, square controls with lilac borders; navigation is sparse; spacing is asymmetric.",
  good="Memorable and clearly not a template; pairs well with bold food photography.",
  bad="Lilac is vivid; the experimental edge can fight the reading task if overused."),
 dict(rank=5, name="Magenta Hour", mood="Late-night, elegant, a little theatrical. Black-plum with a muted magenta signal and an italic display voice.",
  bg="#0d0910", surface="#1c1420", text="#f7eef6", sec="#bda6bb", acc="#d96bb8", bd="#38273a",
  disp="'Instrument Serif', Georgia, serif", body="'Archivo', sans-serif", lab="'DM Mono', monospace",
  ui="Hairline borders, italic display headings, underlined actions; navigation is a thin top rule; spacing is generous.",
  good="Premium and unusual for food; warm without using food colours; strong mobile presence.",
  bad="Magenta can feel nightlife-led; serif italics need careful sizing."),
 dict(rank=6, name="Bauhaus Noir", mood="Bold poster logic. True black, chalk white, and one vermilion signal. Structural, graphic, unapologetic.",
  bg="#0b0b0b", surface="#1a1a1a", text="#f5f3ed", sec="#a5a29b", acc="#e5484d", bd="#353532",
  disp="'Archivo', sans-serif", body="'Archivo', sans-serif", lab="'DM Mono', monospace",
  ui="Thick 3px rules, blocky uppercase labels, square buttons with solid accent; navigation is a heavy bar; spacing is tight and rhythmic.",
  good="Extremely distinctive; great at small sizes; red is used as structure, not decoration.",
  bad="High contrast graphics can overpower photographs; less calm for long notes."),
 dict(rank=7, name="Obsidian Signal", mood="Minimal and technical, like a well-made instrument panel for looking at food. Sharp mono labels, one acid-lime signal.",
  bg="#050505", surface="#101012", text="#f2f2f0", sec="#9a9a96", acc="#b7d36a", bd="#2a2a2a",
  disp="'JetBrains Mono', monospace", body="'Archivo', sans-serif", lab="'JetBrains Mono', monospace",
  ui="Mono labels, thin rules, square controls with lime underlines; navigation is compact; spacing is efficient.",
  good="Very legible; informations reads fast; lime is unexpected and not food-like.",
  bad="Can drift toward a developer-tool costume; lime needs strict restraint."),
 dict(rank=8, name="Mint Ledger", mood="Fresh and clean without being bright. Deep green-black with a mint signal; more contemporary than earthy.",
  bg="#07100f", surface="#0f1b19", text="#e9f5f1", sec="#9fbbb4", acc="#4fd1b0", bd="#1d332f",
  disp="'Manrope', sans-serif", body="'Spectral', Georgia, serif", lab="'DM Mono', monospace",
  ui="Soft square corners (2px), mint tab underlines, light rules; navigation is minimal; spacing is airy.",
  good="Calm and modern; mint gives instant identity; readable at phone size.",
  bad="Green family may still read as food-adjacent; less premium than silver or plum."),
 dict(rank=9, name="Acid Paper", mood="Experimental and sharp. Charcoal black with an acid-yellow signal used only on labels and marks.",
  bg="#0e0e0c", surface="#1b1b17", text="#f2f2e8", sec="#a8a89a", acc="#d8ff4f", bd="#30302a",
  disp="'Bricolage Grotesque', sans-serif", body="'Archivo', sans-serif", lab="'DM Mono', monospace",
  ui="Hard black fields, acid labels, square buttons; navigation is a stark strip; spacing is dense and intentional.",
  good="Unmistakable; excellent for a small set of entries; very modern.",
  bad="Acid yellow is loud; weak with long text and many entries."),
 dict(rank=10, name="Rose Quartz Noir", mood="Soft and premium. Black-plum with a dusty rose signal and an editorial serif. Quietly personal.",
  bg="#120d0f", surface="#20161a", text="#f7ecef", sec="#bfa6ad", acc="#e08fa3", bd="#3a2a2f",
  disp="'Instrument Serif', Georgia, serif", body="'Manrope', sans-serif", lab="'DM Mono', monospace",
  ui="Thin rose rules, italic headings, underlined actions; navigation is light; spacing is relaxed.",
  good="Warm personality without brown or orange; flattering to food photographs.",
  bad="Closest to a café-romantic mood; rose may feel over-familiar."),
]

def swatch(hexv, label):
    return (f'<div class="sw"><i style="background:{hexv}"></i>'
            f'<span class="sname">{label}</span><span class="shex">{hexv}</span></div>')

def preview(t):
    return f'''<div class="pv" style="--bg:{t['bg']};--sf:{t['surface']};--tx:{t['text']};--sc:{t['sec']};--ac:{t['acc']};--bd:{t['bd']};--disp:{t['disp']};--body:{t['body']};--lab:{t['lab']}">
  <div class="pv-top"><span class="pv-brand">Food Diary</span><span class="pv-tabs"><b class="on">Diary</b><span>Map</span></span></div>
  <div class="pv-filters"><span class="on">All</span><span>Zhujiaofan</span><span>Shaorou</span></div>
  <div class="pv-hero">
    <div class="pv-photo"><img src="{IMG}dish-1.jpg" alt="Example food photograph"><span class="pv-plate">PLATE 001</span></div>
    <div class="pv-copy"><div class="pv-marks"><span>17 NOV 2026</span><span class="pv-tag">Zhujiaofan</span></div>
    <h4>Sample Shop</h4><p>Rich broth, tender pork. Replace this with your own note.</p><span class="pv-cta">Read entry &rarr;</span></div>
  </div>
  <div class="pv-strip"><img src="{IMG}dish-2.jpg" alt="Example food photograph"><img src="{IMG}dish-3.jpg" alt="Example food photograph"><img src="{IMG}dish-4.jpg" alt="Example food photograph"></div>
  <div class="pv-map"><div class="pv-maplist"><span>PLACES &middot; 001</span><strong>Sample Shop</strong><small>Zhujiaofan &middot; 17 Nov 2026</small></div><div class="pv-maparea"><span class="pv-pin"></span><span class="pv-tiles"></span></div></div>
  <div class="pv-note">Example photographs, not real visits.</div>
</div>'''

cards = []
for t in themes:
    cards.append(f'''<section class="theme" id="t{t['rank']}">
 <div class="head"><span class="rank">{t['rank']:02d}</span><h2>{t['name']}</h2></div>
 <p class="mood">{t['mood']}</p>
 <div class="swatches">{''.join(swatch(t[k], lab) for k, lab in [('bg','Background'),('surface','Surface'),('text','Primary text'),('sec','Secondary'),('acc','Accent'),('bd','Border')])}</div>
 <div class="meta"><p><b>Type</b> {t['disp']} / {t['body']} / {t['lab']}</p><p><b>UI</b> {t['ui']}</p></div>
 <div class="twocol"><div class="pvwrap">{preview(t)}</div><div class="verdict"><h3>Fit for a personal Food Diary</h3><p><b class="good">Strengths</b> {t['good']}</p><p><b class="bad">Weaknesses</b> {t['bad']}</p></div></div>
</section>''')

html = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>10 new identities — Food Diary</title><link rel="icon" href="data:,">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600&family=Barlow+Condensed:wght@500;600&family=Bodoni+Moda:wght@400;500&family=Bricolage+Grotesque:wght@400;600&family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;600&family=Manrope:wght@400;600&family=Spectral:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
<style>
*{{box-sizing:border-box}}body{{margin:0;background:#08080b;color:#e9e9ef;font-family:Archivo,sans-serif;padding:36px 28px 80px}}
.page{{max-width:1280px;margin:0 auto}}h1{{font-size:30px;margin:0 0 8px}}.lead{{color:#9b9ba8;max-width:900px;line-height:1.6;margin:0 0 12px}}
.warn{{color:#c9c9d2;font-size:13px;border:1px solid #2b2b36;padding:10px 14px;margin:0 0 34px}}
.theme{{border-top:1px solid #24242e;padding:26px 0 36px}}.head{{display:flex;align-items:baseline;gap:14px}}
.rank{{font:600 12px 'DM Mono',monospace;color:#7f9cc0;border:1px solid #2b3646;padding:4px 8px}}
h2{{font-size:25px;margin:0;font-weight:600}}.mood{{color:#a6a6b2;max-width:900px;line-height:1.6;margin:10px 0 16px}}
.swatches{{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}}
.sw{{width:132px;border:1px solid #2b2b36;padding:7px;background:#101014}}
.sw i{{display:block;height:34px;border:1px solid rgba(255,255,255,.15);margin-bottom:6px}}
.sname,.shex{{display:block;font:10px 'DM Mono',monospace;color:#9b9ba8;letter-spacing:.04em}}
.shex{{color:#d6d6df}}
.meta{{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:18px}}
.meta p{{font-size:13px;line-height:1.55;color:#b9b9c4;margin:0}}.meta b{{color:#e9e9ef;margin-right:6px}}
.twocol{{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,.65fr);gap:22px;align-items:start}}
.pvwrap{{border:1px solid #2b2b36;padding:14px;background:#0d0d12}}
.pv{{background:var(--bg);color:var(--tx);border:1px solid var(--bd);padding:16px;font-family:var(--body);min-height:330px}}
.pv-top{{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid var(--bd);padding-bottom:10px}}
.pv-brand{{font:600 17px var(--disp);letter-spacing:-.01em}}
.pv-tabs{{display:flex;gap:14px;font:11px var(--lab);letter-spacing:.1em;text-transform:uppercase;color:var(--sc)}}
.pv-tabs .on{{color:var(--ac);border-bottom:2px solid var(--ac);padding-bottom:3px}}
.pv-filters{{display:flex;gap:12px;padding:10px 0;font:10px var(--lab);letter-spacing:.1em;text-transform:uppercase;color:var(--sc)}}
.pv-filters .on{{color:var(--ac)}}
.pv-hero{{display:grid;grid-template-columns:1.05fr .95fr;gap:16px;align-items:start}}
.pv-photo{{position:relative;background:var(--sf);padding:7px;border:1px solid var(--bd)}}
.pv-photo img{{display:block;width:100%;height:150px;object-fit:cover;background:#222}}
.pv-plate{{position:absolute;top:-8px;left:-8px;background:var(--bg);border:1px solid var(--ac);color:var(--ac);font:9px var(--lab);letter-spacing:.12em;padding:3px 6px}}
.pv-copy h4{{font:500 27px/1.05 var(--disp);margin:12px 0 8px;letter-spacing:-.02em}}
.pv-marks{{display:flex;gap:10px;flex-wrap:wrap;font:10px var(--lab);letter-spacing:.1em;color:var(--ac)}}
.pv-tag{{border:1px solid var(--ac);padding:3px 7px}}
.pv-copy p{{font-size:12px;line-height:1.55;color:var(--sc);margin:0 0 12px;max-width:36ch}}
.pv-cta{{font:10px var(--lab);letter-spacing:.12em;text-transform:uppercase;color:var(--tx);border-bottom:1px solid var(--ac);padding-bottom:3px}}
.pv-strip{{display:flex;gap:7px;margin:14px 0 12px}}
.pv-strip img{{width:64px;height:42px;object-fit:cover;border:1px solid var(--bd);background:var(--sf)}}
.pv-map{{display:grid;grid-template-columns:38% 62%;border:1px solid var(--bd);height:78px}}
.pv-maplist{{background:var(--sf);border-right:1px solid var(--bd);padding:8px;font-family:var(--lab);display:flex;flex-direction:column;gap:3px}}
.pv-maplist span{{font-size:9px;color:var(--ac);letter-spacing:.1em}}
.pv-maplist strong{{font:600 11px var(--body);color:var(--tx)}}
.pv-maplist small{{font-size:9px;color:var(--sc)}}
.pv-maparea{{position:relative;background:var(--sf);overflow:hidden}}
.pv-tiles{{position:absolute;inset:0;background-image:linear-gradient(var(--bd) 1px,transparent 1px),linear-gradient(90deg,var(--bd) 1px,transparent 1px);background-size:28px 28px;opacity:.35}}
.pv-pin{{position:absolute;z-index:2;left:48%;top:32px;width:14px;height:14px;background:var(--ac);transform:rotate(45deg);border:2px solid var(--bg)}}
.pv-note{{font:9px 'DM Mono',monospace;letter-spacing:.08em;color:var(--sc);margin-top:9px}}
.verdict{{border:1px solid #2b2b36;padding:16px;background:#101014}}
.verdict h3{{font-size:14px;margin:0 0 12px}}.verdict p{{font-size:13px;line-height:1.6;color:#b9b9c4;margin:0 0 12px}}
.good{{color:#8fd6b4}}.bad{{color:#e0a5a5}}
@media(max-width:900px){{.twocol,.meta{{grid-template-columns:1fr}}}}
</style></head><body><div class="page">
<h1>10 new visual identities for Food Diary</h1>
<p class="lead">All ten use the same layout and the same example photographs, so only the visual system changes. Ranked by fit for a personal, photograph-first food diary — this is a shortlist, not a selection.</p>
<p class="warn">Visual exploration only. No production file, stack, or dependency was changed. Photographs are labelled examples, not real visits.</p>
{''.join(cards)}
</div></body></html>'''

OUT.write_text(html, encoding="utf-8")
print(OUT)
print(len(html), "bytes")
