from pathlib import Path

OUT = Path(r"C:\Users\Amane\Downloads\2026\zhu-jiao-fan\.impeccable\explorations\typography\typography.html")
IMG = "../images/"

directions = [
 dict(name="Quiet Serif", tag="Editorial / literary",
  heading="Pridi", body="Noto Sans Thai", label="IBM Plex Sans Thai",
  hsize="64 / 40px", hweight="500", hline="1.12", hspace="-0.02em",
  bsize="17 / 16px", bweight="400", bline="1.75", bspace="0",
  lsize="12px", lweight="500", lline="1.4", lspace="0.12em",
  good="A real Thai serif gives the page a printed, considered voice. Latin and Thai share the same bookish character.",
  bad="Pridi is the most literary option here; small Thai serif labels can look light on a phone."),
 dict(name="Civic Sans", tag="Neutral / highly legible",
  heading="Sarabun", body="Sarabun", label="IBM Plex Sans Thai",
  hsize="60 / 38px", hweight="600", hline="1.15", hspace="-0.02em",
  bsize="17 / 16px", bweight="400", bline="1.75", bspace="0",
  lsize="12px", lweight="500", lline="1.4", lspace="0.12em",
  good="Sarabun was designed for Thai government use: exceptionally clear at small sizes and on low-end phones.",
  bad="The least distinctive option. It reads correct and calm, but not especially personal."),
 dict(name="Modern Grotesk", tag="Contemporary / precise",
  heading="Prompt", body="Prompt", label="Krub",
  hsize="62 / 40px", hweight="600", hline="1.1", hspace="-0.03em",
  bsize="17 / 16px", bweight="400", bline="1.7", bspace="0",
  lsize="12px", lweight="500", lline="1.4", lspace="0.14em",
  good="Prompt pairs Thai and Latin with the same modern geometry. Clean hierarchy, strong shop names, good mobile rhythm.",
  bad="Slightly app-like in tone; long Thai notes feel cooler than the personal-journal brief."),
 dict(name="Humanist Loop", tag="Soft / human",
  heading="IBM Plex Sans Thai Looped", body="IBM Plex Sans Thai", label="IBM Plex Sans Thai",
  hsize="60 / 38px", hweight="600", hline="1.15", hspace="-0.02em",
  bsize="17 / 16px", bweight="400", bline="1.75", bspace="0",
  lsize="12px", lweight="500", lline="1.4", lspace="0.12em",
  good="The looped Thai forms are warm and forgiving on a small screen. Best pure readability of the five.",
  bad="Softer and more casual; gives the diary less editorial authority than the serif options."),
 dict(name="Book Serif", tag="Refined / print-led",
  heading="Taviraj", body="Noto Sans Thai", label="Noto Sans Thai",
  hsize="64 / 40px", hweight="500", hline="1.12", hspace="-0.015em",
  bsize="17 / 16px", bweight="400", bline="1.8", bspace="0",
  lsize="12px", lweight="500", lline="1.4", lspace="0.10em",
  good="The strongest magazine character. Taviraj gives Thai headings real presence without becoming decorative.",
  bad="Thai serif is less crisp than sans at 12px, and the tone is more formal than a casual food log."),
]

FONT_URL = ("https://fonts.googleapis.com/css2?family=Pridi:wght@400;500;600"
            "&family=Taviraj:wght@400;500;600"
            "&family=Noto+Sans+Thai:wght@400;500;600"
            "&family=IBM+Plex+Sans+Thai:wght@400;500;600"
            "&family=IBM+Plex+Sans+Thai+Looped:wght@400;500;600"
            "&family=Sarabun:wght@400;500;600"
            "&family=Prompt:wght@400;500;600"
            "&family=Krub:wght@400;500;600&display=swap")


def diary(cls, wide=True):
    size = "wide" if wide else "narrow"
    return f'''<div class="mini {size} {cls}">
  <div class="mini-top"><b>Food Diary</b><span>Diary &nbsp; Map</span></div>
  <div class="mini-filter">ALL &nbsp;·&nbsp; ZHUJIAOFAN &nbsp;·&nbsp; SHAOROU</div>
  <div class="mini-hero">
    <div class="mini-photo"><img src="{IMG}dish-1.jpg" alt="Example food photograph"><span>PLATE 001</span></div>
    <div class="mini-copy"><div class="mini-meta">17 NOV 2026 &nbsp;·&nbsp; ZHUJIAOFAN</div>
    <h3>Sample Shop</h3><p>Rich broth, tender pork. Replace this with your own note.</p><span class="mini-action">Read entry &rarr;</span></div>
  </div>
  <div class="mini-strip"><img src="{IMG}dish-2.jpg" alt="Example food photograph"><img src="{IMG}dish-3.jpg" alt="Example food photograph"><img src="{IMG}dish-4.jpg" alt="Example food photograph"></div>
</div>'''


def mapview(cls, wide=True):
    size = "wide" if wide else "narrow"
    return f'''<div class="mini {size} {cls}">
  <div class="mini-top"><b>Food Diary</b><span>Diary &nbsp; Map</span></div>
  <div class="mini-filter">ALL &nbsp;·&nbsp; ZHUJIAOFAN &nbsp;·&nbsp; SHAOROU</div>
  <div class="mini-map"><div class="mini-list"><div>PLACES · 001</div><strong>Sample Shop</strong><small>Zhujiaofan · 17 Nov 2026</small><strong>Second Shop</strong><small>Shaorou · 12 Nov 2026</small></div><div class="mini-canvas"><i></i></div></div>
</div>'''


cards = []
for i, d in enumerate(directions, 1):
    cls = f"dir-{i}"
    cards.append(f'''<section class="direction">
 <div class="head"><span class="num">0{i}</span><h2>{d['name']}</h2><span class="tag">{d['tag']}</span></div>
 <p class="concept">Heading <b>{d['heading']}</b> · Body <b>{d['body']}</b> · Labels <b>{d['label']}</b></p>
 <div class="previews">
  <figure><figcaption>Diary · desktop</figcaption>{diary(cls, True)}</figure>
  <figure><figcaption>Map · desktop</figcaption>{mapview(cls, True)}</figure>
  <figure><figcaption>Diary · mobile 390</figcaption>{diary(cls, False)}</figure>
  <figure><figcaption>Map · mobile 390</figcaption>{mapview(cls, False)}</figure>
 </div>
 <div class="specimen {cls}"><span class="sp-label">THAI SPECIMEN / FONT TEST</span><span class="sp-thai">ข้าวขาหมู · หมูกรอบ · ร้านอาหาร</span><span class="sp-latin">Khao kha mu · crispy pork · restaurant</span></div>
 <div class="details">
  <table><tr><th>Role</th><th>Font</th><th>Size (desk / mob)</th><th>Weight</th><th>Line height</th><th>Letter spacing</th></tr>
  <tr><td>Heading</td><td>{d['heading']}</td><td>{d['hsize']}</td><td>{d['hweight']}</td><td>{d['hline']}</td><td>{d['hspace']}</td></tr>
  <tr><td>Body</td><td>{d['body']}</td><td>{d['bsize']}</td><td>{d['bweight']}</td><td>{d['bline']}</td><td>{d['bspace']}</td></tr>
  <tr><td>Label</td><td>{d['label']}</td><td>{d['lsize']}</td><td>{d['lweight']}</td><td>{d['lline']}</td><td>{d['lspace']}</td></tr></table>
  <div class="fit"><p><b class="good">Strengths</b> {d['good']}</p><p><b class="bad">Weaknesses</b> {d['bad']}</p></div>
 </div>
 <style>
 .dir-{i} .mini h3{{font-family:'{d['heading']}',sans-serif;font-size:clamp(28px,4vw,{d['hsize'].split(' / ')[0]});font-weight:{d['hweight']};line-height:{d['hline']};letter-spacing:{d['hspace']}}}
 .dir-{i} .mini p,.dir-{i} .mini-list strong{{font-family:'{d['body']}',sans-serif;font-weight:{d['bweight']};line-height:{d['bline']};letter-spacing:{d['bspace']}}}
 .dir-{i} .mini-top,.dir-{i} .mini-filter,.dir-{i} .mini-meta,.dir-{i} .mini-action,.dir-{i} .mini-list div,.dir-{i} .mini-list small,.dir-{i} .sp-label{{font-family:'{d['label']}',sans-serif;font-weight:{d['lweight']};letter-spacing:{d['lspace']};line-height:{d['lline']}}}
 .dir-{i} .sp-thai{{font-family:'{d['heading']}',sans-serif}}.dir-{i} .sp-latin{{font-family:'{d['body']}',sans-serif}}
 </style>
</section>''')

html = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Five typography systems — Food Diary</title><link rel="icon" href="data:,">
<link href="{FONT_URL}" rel="stylesheet">
<style>
*{{box-sizing:border-box}}body{{margin:0;background:#0c0c10;color:#e9e9ef;font-family:Arial,sans-serif;padding:36px 28px 80px}}
.page{{max-width:1280px;margin:0 auto}}h1{{font-size:30px;margin:0 0 8px}}.lead{{color:#a2a2ae;max-width:960px;line-height:1.6;margin:0 0 12px}}
.warn{{border:1px solid #2b2b36;padding:10px 14px;font-size:13px;color:#c9c9d2;margin:0 0 34px}}
.direction{{border-top:1px solid #2b2b36;padding:26px 0 40px}}.head{{display:flex;align-items:baseline;gap:14px}}
.num{{font:12px Arial,sans-serif;color:#9a9aa6;border:1px solid #2b2b36;padding:4px 8px}}
h2{{font-size:24px;margin:0}}.tag{{font-size:12px;color:#9a9aa6;margin-left:auto}}
.concept{{color:#b9b9c4;font-size:13px;margin:10px 0 18px}}.concept b{{color:#e9e9ef;font-weight:600}}
.previews{{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:16px}}
figure{{margin:0}}figcaption{{font:11px Arial,sans-serif;color:#9a9aa6;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px}}
.mini{{background:#f7f5ef;color:#161514;border:1px solid #d5cfc4;padding:14px;min-height:170px}}
.mini.narrow{{width:340px;padding:10px}}
.mini-top{{display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid #bf2f1e;padding-bottom:8px;font-size:12px;color:#6a655e}}
.mini-top b{{font-size:17px;color:#161514}}
.mini-filter{{font-size:10px;color:#bf2f1e;padding:8px 0;text-transform:uppercase}}
.mini-hero{{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start}}
.mini.narrow .mini-hero{{grid-template-columns:1fr;gap:10px}}
.mini-photo{{position:relative;background:#fff;border:1px solid #d5cfc4;padding:6px}}
.mini-photo img{{display:block;width:100%;height:110px;object-fit:cover}}
.mini.narrow .mini-photo img{{height:110px}}
.mini-photo span{{position:absolute;top:-8px;left:-1px;background:#bf2f1e;color:#fff;font:9px Arial,sans-serif;padding:3px 6px}}
.mini-copy h3{{margin:8px 0 6px;color:#161514}}
.mini-copy p{{font-size:13px;color:#161514;margin:0 0 8px}}
.mini-meta{{font-size:10px;color:#6a655e}}
.mini-action{{font-size:10px;color:#bf2f1e;border-bottom:1px solid #bf2f1e;padding-bottom:2px}}
.mini-strip{{display:flex;gap:6px;margin-top:12px}}
.mini-strip img{{width:58px;height:38px;object-fit:cover;border:1px solid #d5cfc4}}
.mini-map{{display:grid;grid-template-columns:38% 62%;border:1px solid #d5cfc4;height:130px}}
.mini-list{{background:#ece8de;border-right:1px solid #d5cfc4;padding:8px;font-size:10px;color:#6a655e}}
.mini-list div{{color:#bf2f1e;font-size:10px;margin-bottom:8px}}
.mini-list strong{{display:block;font-size:12px;color:#161514;margin-top:6px}}
.mini-list small{{font-size:9px;color:#6a655e}}
.mini-canvas{{position:relative;background:#e4e0d6}}
.mini-canvas i{{position:absolute;left:48%;top:44px;width:14px;height:14px;background:#bf2f1e;transform:rotate(45deg);border:2px solid #fff}}
.specimen{{background:#fff;border:1px solid #d5cfc4;padding:14px 16px;display:flex;flex-wrap:wrap;gap:10px 22px;align-items:baseline;margin-bottom:16px;color:#161514}}
.sp-label{{font-size:9px;color:#bf2f1e;text-transform:uppercase}}
.sp-thai{{font-size:22px}}.sp-latin{{font-size:13px;color:#6a655e}}
.details{{display:grid;grid-template-columns:1.5fr 1fr;gap:20px}}
table{{width:100%;border-collapse:collapse;font-size:12px;color:#c9c9d2}}
th,td{{text-align:left;padding:6px 8px;border-bottom:1px solid #2b2b36}}th{{color:#8f8f9b;font-weight:400}}
.fit p{{font-size:13px;line-height:1.6;color:#b9b9c4;margin:0 0 12px}}.good{{color:#8fd6b4}}.bad{{color:#e0a5a5}}
@media(max-width:900px){{.previews,.details{{grid-template-columns:1fr}}.mini.narrow{{width:100%;max-width:340px}}}}
</style></head><body><div class="page">
<h1>Five typography systems for Food Diary</h1>
<p class="lead">Same palette, same layout, same Diary and Map content in every preview. Only the type system changes. Desktop and phone previews use the real fonts loaded in this page.</p>
<p class="warn">Visual exploration only. No production code changed. Thai line is a labelled font specimen, not site copy. All fonts shown have a Thai subset and a system fallback.</p>
{''.join(cards)}
</div></body></html>'''

OUT.write_text(html, encoding="utf-8")
print(OUT)
print(len(html), "bytes")
