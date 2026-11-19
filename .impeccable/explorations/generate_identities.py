from pathlib import Path

OUT = Path(r"C:\Users\Amane\Downloads\2026\zhu-jiao-fan\.impeccable\explorations\identities.html")
IMG = "images/"

themes = [
 dict(name="Paper Editorial", mode="Light", concept="A white broadsheet with black ink and one red rule. Calm, literary, and completely un-food-coloured.",
  bg="#f7f5ef", sf="#ece8de", tx="#161514", sc="#6a655e", ac="#d23b2a", bd="#d5cfc4",
  disp="'Bodoni Moda', Georgia, serif", body="'Archivo', sans-serif", lab="'DM Mono', monospace",
  radius="0px", bw="1px", shadow="none", extra=".pv-brand{font-style:normal}.pv-hero h4{font-weight:500}.pv-cta{border-bottom-width:2px}",
  typepair="Bodoni Moda (display) / Archivo (body) / DM Mono (labels)",
  ui="Hairline rules, no cards, serif headline, red underline on the active tab and action. Wide margins."),
 dict(name="Cobalt Pop", mode="Light", concept="Bright white and electric blue, snapped into a strict graphic grid. Confident, modern, almost sports-poster like.",
  bg="#f4f7ff", sf="#dfe8ff", tx="#0a1633", sc="#4a5b82", ac="#2f5bff", bd="#b9c9f0",
  disp="'Archivo', sans-serif", body="'Archivo', sans-serif", lab="'DM Mono', monospace",
  radius="0px", bw="2px", shadow="none", extra=".pv-tabs .on{background:var(--ac);color:#fff;padding:2px 6px}.pv-hero h4{font-weight:600;letter-spacing:-.04em}.pv-plate{background:var(--ac);color:#fff;border-color:var(--ac)}",
  typepair="Archivo 600 (display and body) / DM Mono (labels)",
  ui="Thick blue bars, square buttons, blue-filled active tab, tight grid, bold photo border."),
 dict(name="Playground", mode="Light", concept="Soft cream with bubblegum pink and rounded shapes. Playful and friendly without being childish.",
  bg="#fffdf7", sf="#fff0c9", tx="#1d1a2f", sc="#5c5872", ac="#ff5c8a", bd="#e6dcc7",
  disp="'Nunito', sans-serif", body="'Nunito', sans-serif", lab="'DM Mono', monospace",
  radius="14px", bw="1px", shadow="0 4px 14px rgba(0,0,0,.06)", extra=".pv-tag{border-radius:999px}.pv-photo{border-radius:14px}.pv-cta{border:0;background:var(--ac);color:#fff;border-radius:999px;padding:5px 10px}",
  typepair="Nunito (display and body) / DM Mono (labels)",
  ui="Rounded photo and pill chips, soft shadow, pink pill button, generous friendly spacing."),
 dict(name="Acid Club", mode="Dark", concept="True black with acid-lime type. Noisy, nocturnal, and deliberately too loud for a normal food site.",
  bg="#0a0a0a", sf="#171717", tx="#f4f4f0", sc="#9a9a94", ac="#d6ff3f", bd="#2c2c2c",
  disp="'Unbounded', sans-serif", body="'Archivo', sans-serif", lab="'JetBrains Mono', monospace",
  radius="0px", bw="2px", shadow="none", extra=".pv-brand{text-transform:uppercase;letter-spacing:-.04em}.pv-plate{background:var(--ac);color:#0a0a0a;border-color:var(--ac)}.pv-strip img{border-width:2px}",
  typepair="Unbounded (display) / Archivo (body) / JetBrains Mono (labels)",
  ui="Hard black fields, acid labels, square controls, thick rules, dense and intentional spacing."),
 dict(name="Deep Sea", mode="Dark", concept="Midnight navy and turquoise in a quiet editorial frame. Deep, clear, and image-led.",
  bg="#06131c", sf="#0d2330", tx="#e4f2f6", sc="#9bb8c4", ac="#3fc7c0", bd="#1b3a49",
  disp="'Spectral', Georgia, serif", body="'Archivo', sans-serif", lab="'DM Mono', monospace",
  radius="0px", bw="1px", shadow="none", extra=".pv-hero h4{font-weight:400}.pv-tabs .on{border-bottom-color:var(--ac)}",
  typepair="Spectral (display) / Archivo (body) / DM Mono (labels)",
  ui="Thin turquoise rules, flat surfaces, serif headline, square controls, roomy layout."),
 dict(name="Clay Studio", mode="Light", concept="Warm paper and baked-clay accent. An artisan studio feel, but restrained enough for photography.",
  bg="#f6efe8", sf="#e9dcd0", tx="#2b211c", sc="#6f5d52", ac="#b65f3f", bd="#d9c8b8",
  disp="'Spectral', Georgia, serif", body="'Manrope', sans-serif", lab="'DM Mono', monospace",
  radius="2px", bw="1px", shadow="none", extra=".pv-plate{border-color:var(--ac)}.pv-cta{border-bottom-color:var(--ac);color:var(--ac)}",
  typepair="Spectral (display) / Manrope (body) / DM Mono (labels)",
  ui="Paper tones, thin clay rules, square buttons, photo on a warm mat, comfortable spacing."),
 dict(name="Neon Arcade", mode="Dark", concept="Deep purple with hot magenta. Loud, playful, and unmistakably not a food-blog default.",
  bg="#10061f", sf="#1e0f39", tx="#f6eaff", sc="#b9a2d8", ac="#ff4fd8", bd="#3c2266",
  disp="'Unbounded', sans-serif", body="'Archivo', sans-serif", lab="'JetBrains Mono', monospace",
  radius="6px", bw="2px", shadow="0 0 0 1px rgba(255,79,216,.15)", extra=".pv-brand{text-transform:uppercase}.pv-plate{background:var(--ac);color:#10061f;border-color:var(--ac)}.pv-photo{border-radius:6px}",
  typepair="Unbounded (display) / Archivo (body) / JetBrains Mono (labels)",
  ui="Rounded-square panels, magenta fills on marks only, bright borders, compact grid."),
 dict(name="Swiss Grid", mode="Light", concept="Pure white, black type, one red signal. Strict Swiss poster discipline, nothing decorative.",
  bg="#ffffff", sf="#f0f0f0", tx="#111111", sc="#606060", ac="#e2231a", bd="#cfcfcf",
  disp="'Archivo', sans-serif", body="'Archivo', sans-serif", lab="'DM Mono', monospace",
  radius="0px", bw="1px", shadow="none", extra=".pv-brand{text-transform:uppercase;letter-spacing:-.03em}.pv-hero h4{text-transform:uppercase;letter-spacing:-.03em}.pv-tabs .on{color:var(--ac);border-bottom-color:var(--ac)}",
  typepair="Archivo 600 (display and body) / DM Mono (labels)",
  ui="Flush-left grid, hairline dividers, red active tab only, no shadows, precise spacing."),
 dict(name="Ink & Newsprint", mode="Light", concept="Old newsprint and blue ink. Dense, textual, and deliberately unpolished in a magazine way.",
  bg="#f2efe6", sf="#e3dfd2", tx="#17170f", sc="#5c5a4f", ac="#1a4fa0", bd="#c9c5b6",
  disp="'Barlow Condensed', sans-serif", body="'Spectral', Georgia, serif", lab="'DM Mono', monospace",
  radius="0px", bw="1px", shadow="none", extra=".pv-hero h4{text-transform:uppercase;font-weight:600}.pv-plate{border-color:var(--ac);color:var(--ac)}.pv-copy p{font-family:'Spectral',Georgia,serif}",
  typepair="Barlow Condensed (display) / Spectral (body) / DM Mono (labels)",
  ui="Condensed uppercase headline, serif note, blue plate label, tight newspaper spacing."),
 dict(name="Pastel Dream", mode="Light", concept="Lavender and pink pastels with soft curves. Light, airy, and gently playful.",
  bg="#faf6ff", sf="#eee4f7", tx="#2a2038", sc="#6b5b7d", ac="#b48cff", bd="#ded0ee",
  disp="'Instrument Serif', Georgia, serif", body="'Nunito', sans-serif", lab="'DM Mono', monospace",
  radius="16px", bw="1px", shadow="0 6px 18px rgba(80,50,120,.08)", extra=".pv-photo{border-radius:16px}.pv-tag{border-radius:999px}.pv-cta{border:0;background:var(--ac);color:#fff;border-radius:999px;padding:5px 10px}",
  typepair="Instrument Serif (display) / Nunito (body) / DM Mono (labels)",
  ui="Rounded photo frame, pill chips and button, soft lilac shadow, open spacing."),
 dict(name="Concrete Brutal", mode="Mid", concept="Mid-grey concrete with black type and one vermilion signal. Raw, structural, and unconventional.",
  bg="#c9c9c4", sf="#adadaa", tx="#111111", sc="#4b4b48", ac="#ff3b1f", bd="#6f6f6a",
  disp="'Archivo', sans-serif", body="'Archivo', sans-serif", lab="'JetBrains Mono', monospace",
  radius="0px", bw="3px", shadow="4px 4px 0 #111111", extra=".pv-photo{border-width:3px}.pv-hero h4{text-transform:uppercase;font-weight:600}.pv-plate{background:var(--ac);color:#111;border-color:#111}",
  typepair="Archivo 600 (display and body) / JetBrains Mono (labels)",
  ui="Heavy black borders, hard offset shadow, square blocks, vermilion only on marks."),
 dict(name="Coral Reef", mode="Light", concept="Warm-white with coral and turquoise energy. Bright, summery, and cheerful without being retro.",
  bg="#fff7f2", sf="#ffe3d6", tx="#2b1a16", sc="#6d534b", ac="#ff6f4d", bd="#f0c9b6",
  disp="'Bricolage Grotesque', sans-serif", body="'Manrope', sans-serif", lab="'DM Mono', monospace",
  radius="10px", bw="1px", shadow="0 5px 16px rgba(190,80,50,.08)", extra=".pv-photo{border-radius:10px}.pv-tabs .on{color:var(--ac);border-bottom-color:var(--ac)}.pv-cta{border-bottom-color:var(--ac);color:var(--ac)}",
  typepair="Bricolage Grotesque (display) / Manrope (body) / DM Mono (labels)",
  ui="Soft-rounded photo, coral accents, light shadow, bright but controlled spacing."),
 dict(name="Silver Screen", mode="Dark", concept="Monochrome dark with silver type. Cinematic and premium, like a film title card.",
  bg="#0d0d0f", sf="#1b1b1f", tx="#f4f4f6", sc="#a6a6ae", ac="#d8d8e0", bd="#33333a",
  disp="'Bodoni Moda', Georgia, serif", body="'Archivo', sans-serif", lab="'JetBrains Mono', monospace",
  radius="0px", bw="1px", shadow="none", extra=".pv-hero h4{font-weight:400;letter-spacing:.01em}.pv-plate{border-color:var(--ac);color:var(--ac)}",
  typepair="Bodoni Moda (display) / Archivo (body) / JetBrains Mono (labels)",
  ui="Silver hairlines, serif display, no colour beyond greys, wide cinematic margins."),
 dict(name="Botanical Ink", mode="Light", concept="Pale green paper and deep ink-green. Editorial and natural, but fresh rather than earthy.",
  bg="#f3f6ef", sf="#e3ebdd", tx="#1b2a1f", sc="#5c6f60", ac="#2f7d54", bd="#c6d3c2",
  disp="'Instrument Serif', Georgia, serif", body="'Manrope', sans-serif", lab="'DM Mono', monospace",
  radius="0px", bw="1px", shadow="none", extra=".pv-hero h4{font-weight:400}.pv-plate{border-color:var(--ac);color:var(--ac)}.pv-strip img{border-color:var(--bd)}",
  typepair="Instrument Serif (display) / Manrope (body) / DM Mono (labels)",
  ui="Fine green rules, serif display, square controls, calm and even spacing."),
 dict(name="Terminal Bloom", mode="Dark", concept="Black-green with mint terminal type. Technical on the surface, unexpectedly gentle underneath.",
  bg="#07110d", sf="#0e1d17", tx="#dff5e9", sc="#8fb3a2", ac="#7dffb2", bd="#1d3a2c",
  disp="'JetBrains Mono', monospace", body="'Spectral', Georgia, serif", lab="'JetBrains Mono', monospace",
  radius="0px", bw="1px", shadow="none", extra=".pv-brand{font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.06em}.pv-hero h4{font-family:'Spectral',Georgia,serif;font-weight:400}.pv-cta{border-bottom:1px dashed var(--ac)}",
  typepair="JetBrains Mono (display and labels) / Spectral (body)",
  ui="Mono chrome, thin green rules, serif reading text, compact efficient spacing."),
]

def swatch(hexv, label):
    return (f'<div class="sw"><i style="background:{hexv}"></i>'
            f'<span class="sname">{label}</span><span class="shex">{hexv}</span></div>')

def scope_extra(extra, cls):
    rules = []
    for rule in extra.split('}'):
        rule = rule.strip()
        if not rule or '{' not in rule:
            continue
        sel, body = rule.split('{', 1)
        rules.append(f'.{cls} {sel.strip()} {{{body}}}')
    return ' '.join(rules)


def preview(t, cls):
    return f'''<div class="pv {cls}" style="--bg:{t['bg']};--sf:{t['sf']};--tx:{t['tx']};--sc:{t['sc']};--ac:{t['ac']};--bd:{t['bd']};--disp:{t['disp']};--body:{t['body']};--lab:{t['lab']};--rad:{t['radius']};--bw:{t['bw']};--sh:{t['shadow']}">
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
for i, t in enumerate(themes, 1):
    cls = f'pv-{i}'
    cards.append(f'''<section class="theme">
 <div class="head"><h2>{t['name']}</h2><span class="mode">{t['mode']}</span></div>
 <p class="mood">{t['concept']}</p>
 <div class="swatches">{''.join(swatch(t[k], lab) for k, lab in [('bg','Background'),('sf','Surface'),('tx','Primary text'),('sc','Secondary'),('ac','Accent'),('bd','Border')])}</div>
 <div class="meta"><p><b>Type</b> {t['typepair']}</p><p><b>UI</b> {t['ui']}</p></div>
 <div class="twocol"><div class="pvwrap">{preview(t, cls)}</div></div>
 <style>{scope_extra(t['extra'], cls)}</style>
</section>''')

html = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>15 visual identities — Food Diary</title><link rel="icon" href="data:,">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600&family=Barlow+Condensed:wght@500;600&family=Bodoni+Moda:wght@400;500&family=Bricolage+Grotesque:wght@400;600&family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;600&family=Manrope:wght@400;600&family=Nunito:wght@400;600;800&family=Spectral:ital,wght@0,400;1,400&family=Unbounded:wght@400;600&display=swap" rel="stylesheet">
<style>
*{{box-sizing:border-box}}body{{margin:0;background:#08080b;color:#e9e9ef;font-family:Archivo,sans-serif;padding:36px 28px 80px}}
.page{{max-width:1160px;margin:0 auto}}h1{{font-size:30px;margin:0 0 8px}}.lead{{color:#9b9ba8;max-width:900px;line-height:1.6;margin:0 0 12px}}
.warn{{color:#c9c9d2;font-size:13px;border:1px solid #2b2b36;padding:10px 14px;margin:0 0 34px}}
.theme{{border-top:1px solid #24242e;padding:26px 0 36px}}.head{{display:flex;align-items:baseline;gap:14px}}
h2{{font-size:25px;margin:0;font-weight:600}}.mode{{font:10px 'DM Mono',monospace;color:#9b9ba8;border:1px solid #2b2b36;padding:3px 8px;letter-spacing:.1em;text-transform:uppercase}}
.mood{{color:#a6a6b2;max-width:900px;line-height:1.6;margin:10px 0 16px}}
.swatches{{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}}
.sw{{width:132px;border:1px solid #2b2b36;padding:7px;background:#101014}}
.sw i{{display:block;height:34px;border:1px solid rgba(255,255,255,.15);margin-bottom:6px}}
.sname,.shex{{display:block;font:10px 'DM Mono',monospace;color:#9b9ba8;letter-spacing:.04em}}
.shex{{color:#d6d6df}}
.meta{{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:18px}}
.meta p{{font-size:13px;line-height:1.55;color:#b9b9c4;margin:0}}.meta b{{color:#e9e9ef;margin-right:6px}}
.pvwrap{{border:1px solid #2b2b36;padding:14px;background:#0d0d12}}
.pv{{background:var(--bg);color:var(--tx);border:var(--bw) solid var(--bd);padding:16px;font-family:var(--body);border-radius:var(--rad);box-shadow:var(--sh);min-height:330px}}
.pv-top{{display:flex;justify-content:space-between;align-items:baseline;border-bottom:var(--bw) solid var(--bd);padding-bottom:10px}}
.pv-brand{{font:600 17px var(--disp);letter-spacing:-.01em}}
.pv-tabs{{display:flex;gap:14px;font:11px var(--lab);letter-spacing:.1em;text-transform:uppercase;color:var(--sc)}}
.pv-tabs .on{{color:var(--ac);border-bottom:2px solid var(--ac);padding-bottom:3px}}
.pv-filters{{display:flex;gap:12px;padding:10px 0;font:10px var(--lab);letter-spacing:.1em;text-transform:uppercase;color:var(--sc)}}
.pv-filters .on{{color:var(--ac)}}
.pv-hero{{display:grid;grid-template-columns:1.05fr .95fr;gap:16px;align-items:start}}
.pv-photo{{position:relative;background:var(--sf);padding:7px;border:var(--bw) solid var(--bd);border-radius:var(--rad);box-shadow:var(--sh)}}
.pv-photo img{{display:block;width:100%;height:150px;object-fit:cover;background:#222;border-radius:max(0px,calc(var(--rad) - 4px))}}
.pv-plate{{position:absolute;top:-8px;left:-8px;background:var(--bg);border:1px solid var(--ac);color:var(--ac);font:9px var(--lab);letter-spacing:.12em;padding:3px 6px}}
.pv-copy h4{{font:500 27px/1.05 var(--disp);margin:12px 0 8px;letter-spacing:-.02em}}
.pv-marks{{display:flex;gap:10px;flex-wrap:wrap;font:10px var(--lab);letter-spacing:.1em;color:var(--ac)}}
.pv-tag{{border:1px solid var(--ac);padding:3px 7px}}
.pv-copy p{{font-size:12px;line-height:1.55;color:var(--sc);margin:0 0 12px;max-width:36ch}}
.pv-cta{{font:10px var(--lab);letter-spacing:.12em;text-transform:uppercase;color:var(--tx);border-bottom:1px solid var(--ac);padding-bottom:3px}}
.pv-strip{{display:flex;gap:7px;margin:14px 0 12px}}
.pv-strip img{{width:64px;height:42px;object-fit:cover;border:var(--bw) solid var(--bd);background:var(--sf);border-radius:max(0px,calc(var(--rad) - 4px))}}
.pv-map{{display:grid;grid-template-columns:38% 62%;border:var(--bw) solid var(--bd);height:78px;border-radius:var(--rad);overflow:hidden}}
.pv-maplist{{background:var(--sf);border-right:var(--bw) solid var(--bd);padding:8px;font-family:var(--lab);display:flex;flex-direction:column;gap:3px}}
.pv-maplist span{{font-size:9px;color:var(--ac);letter-spacing:.1em}}
.pv-maplist strong{{font:600 11px var(--body);color:var(--tx)}}
.pv-maplist small{{font-size:9px;color:var(--sc)}}
.pv-maparea{{position:relative;background:var(--sf);overflow:hidden}}
.pv-tiles{{position:absolute;inset:0;background-image:linear-gradient(var(--bd) 1px,transparent 1px),linear-gradient(90deg,var(--bd) 1px,transparent 1px);background-size:28px 28px;opacity:.35}}
.pv-pin{{position:absolute;z-index:2;left:48%;top:32px;width:14px;height:14px;background:var(--ac);transform:rotate(45deg);border:2px solid var(--bg)}}
.pv-note{{font:9px 'DM Mono',monospace;letter-spacing:.08em;color:var(--sc);margin-top:9px}}
</style></head><body><div class="page">
<h1>15 visual identities for Food Diary</h1>
<p class="lead">Discovery only. The same layout, the same example photographs, and the same words in every preview. Nothing is ranked and nothing is recommended — decide what you like after seeing them.</p>
<p class="warn">No production code, stack, or dependency was changed. All photographs are labelled examples, not real visits.</p>
{''.join(cards)}
</div></body></html>'''

OUT.write_text(html, encoding="utf-8")
print(OUT)
print(len(html), "bytes")
