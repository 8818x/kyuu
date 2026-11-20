#!/usr/bin/env python3
"""Tiny local-only form for adding Kyuu entries. Never deployed to GitHub Pages."""
import http.server
import json
import re
import socketserver
import subprocess
import sys
import webbrowser
from pathlib import Path
from urllib.parse import quote, urlparse

from add_entry import date_from_name, exif_datetime

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "scripts" / "add_entry.py"
PORT = 8130
PHOTO_EXT = {".jpg", ".jpeg", ".png", ".webp"}


def known_types():
    text = (ROOT / "app.js").read_text(encoding="utf-8")
    m = re.search(r"const dishNames = \{(.*?)\n\};", text, re.S)
    if not m:
        return {}
    out = {}
    for k, v in re.findall(r'^\s*([A-Za-z]\w*)\s*:\s*"([^"]*)"', m.group(1), re.M):
        if k != "All":
            out[k] = v
    return out


def unused_photos():
    used = set()
    data = (ROOT / "data" / "entries.js").read_text(encoding="utf-8")
    used.update(m.group(1) for m in re.finditer(r'"images/([^"]+)"', data))
    result = []
    for p in sorted((ROOT / "images").glob("*")):
        if p.suffix.lower() not in PHOTO_EXT or p.name in used:
            continue
        if p.stem.endswith("-display"):
            continue
        result.append({
            "name": p.name,
            "path": "images/" + p.name,
            "date": exif_datetime(p) or date_from_name(p.name) or "",
            "url": "/images/" + quote(p.name)
        })
    result.sort(key=lambda x: (x["date"] or "0000"), reverse=True)
    return result

FORM = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Kyuu — add entry</title>
<style>
:root{--paper:#fff;--ground:#f7f5ef;--ink:#161514;--sec:#6a655e;--rule:#d5cfc4;--accent:#bf2f1e}
*{box-sizing:border-box}body{margin:0;background:var(--ground);color:var(--ink);font:15px/1.6 system-ui,sans-serif}
.wrap{max-width:640px;margin:40px auto;padding:28px;background:var(--paper);border:1px solid var(--rule)}
h1{font-size:26px;margin:0 0 4px}p.lead{color:var(--sec);margin:0 0 24px}
label{display:block;margin:16px 0 6px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--sec)}
input{width:100%;padding:11px 12px;border:1px solid var(--rule);background:var(--paper);color:var(--ink);font:inherit}
input:focus{outline:2px solid var(--accent);outline-offset:2px}
.row{display:flex;gap:12px}.row>div{flex:1}
button{margin-top:24px;width:100%;padding:14px;border:0;background:var(--accent);color:#fff;font:inherit;cursor:pointer}
button:disabled{opacity:.6;cursor:wait}
#out{margin-top:18px;padding:12px;background:var(--ground);border:1px solid var(--rule);white-space:pre-wrap;display:none}
.hint{font-size:13px;color:var(--sec);margin-top:4px}
#photos{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px;margin-top:8px}
#photos button{padding:0;margin:0;background:none;border:2px solid var(--rule);cursor:pointer;overflow:hidden}
#photos button.sel{border-color:var(--accent)}
#photos img{display:block;width:100%;height:78px;object-fit:cover}
#photos span{display:block;font-size:11px;color:var(--sec);padding:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#preview{margin-top:12px;border:1px solid var(--rule);background:var(--ground);min-height:40px;text-align:center}
#preview img{max-width:100%;max-height:300px;display:block;margin:auto}
.msg{font-size:13px;margin-top:4px;min-height:18px}
.msg.ok{color:#2f6f5e}.msg.warn{color:var(--accent)}
</style></head><body><div class="wrap">
<h1>Add a plate</h1><p class="lead">Local editor only — nothing here is published.</p>
<form id="f">
<label>Photos without data</label><div id="photos"></div>
<div id="preview"></div>
<label>Photo path</label><input name="image" required placeholder="images/IMG_20260501_120000.jpg">
<div class="hint">Pick a photo above, or type a path. Date and metadata are handled automatically.</div>
<label>Shop</label><input name="shop" required placeholder="ร้านตัวอย่าง">
<div class="row"><div><label>Type key</label><input name="type" required placeholder="Roti" list="types"><datalist id="types"></datalist>
<div class="msg" id="type-msg"></div></div>
<div><label>Display label</label><input name="label" placeholder="A la carte"><div class="msg" id="label-msg"></div></div></div>
<label>Google Maps — coords or full link</label><input name="maps" required placeholder="13.75,100.50">
<div class="msg" id="maps-msg"></div>
<label>Note (optional)</label><input name="note">
<label>Date override (optional)</label><input name="date" placeholder="YYYY-MM-DD">
<div class="msg" id="date-msg"></div>
<button id="go" type="submit">Add entry</button>
</form><div id="out"></div>
</div><script>
const f=document.getElementById('f'),out=document.getElementById('out'),go=document.getElementById('go');
const photosBox=document.getElementById('photos'),preview=document.getElementById('preview');
function selectPhoto(p,btn){
  f.image.value=p.path;
  if(p.date&&!f.date.value) f.date.value=p.date;
  preview.innerHTML='<img src="'+p.url+'" alt="Preview">';
  photosBox.querySelectorAll('button').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');
}
(async()=>{
  try{
    const r=await fetch('/photos'), list=await r.json();
    if(!list.length){photosBox.textContent='No unused photos found in images/.';return}
    list.forEach(p=>{
      const b=document.createElement('button');b.type='button';
      const i=document.createElement('img');i.src=p.url;i.alt=p.name;
      const s=document.createElement('span');s.textContent=(p.date||'no date')+' · '+p.name;
      b.append(i,s);b.addEventListener('click',()=>selectPhoto(p,b));photosBox.appendChild(b);
    });
  }catch(e){photosBox.textContent='Could not load photos.'}
})();
let TYPES={};
function msg(id,text,ok){const e=document.getElementById(id);e.textContent=text;e.className='msg '+(ok?'ok':'warn')}
function norm(s){return s.trim().toLowerCase().replace(/[^a-z0-9]/g,'')}
(async()=>{try{TYPES=await (await fetch('/types')).json();
  const dl=document.getElementById('types');Object.keys(TYPES).forEach(k=>{const o=document.createElement('option');o.value=k;o.label=TYPES[k];dl.appendChild(o)});
  checkAll();}catch(e){}})();
function checkType(){const v=f.type.value.trim();if(!v){msg('type-msg','',true);return null}
  const n=norm(v);const hit=Object.keys(TYPES).find(k=>norm(k)===n||norm(TYPES[k])===n);
  if(hit){if(v!==hit)f.type.value=hit;if(!f.label.value)f.label.value=TYPES[hit];msg('type-msg','ok',true);return hit}
  msg('type-msg','New key — add a display label',false);return null}
function checkMaps(){const v=f.maps.value.trim();if(!v){msg('maps-msg','',true);return}
  const m=v.match(/^([-.\\d]+)\\s*,\\s*([-.\\d]+)$/);
  if(m){f.maps.value='https://www.google.com/maps/@'+m[1]+','+m[2]+',17z?hl=en';msg('maps-msg','Coords converted to full link',true);return}
  if(/maps\\.app\\.goo\\.gl|share\\.google/.test(v)){msg('maps-msg','Short link will not make a pin — paste the full link',false);return}
  if(v.includes('/@')){msg('maps-msg','Full link ready',true);return}
  msg('maps-msg','Use lat,lng or a full Google Maps link',false)}
function checkDate(){const v=f.date.value.trim();if(!v){msg('date-msg','Leave blank to use the photo date',true);return}
  if(!/^\\d{4}-\\d{2}-\\d{2}$/.test(v)){msg('date-msg','Use YYYY-MM-DD',false);return}
  const d=new Date(v);if(isNaN(d)){msg('date-msg','Invalid date',false);return}
  msg('date-msg','Date ready',true)}
function checkAll(){checkType();checkMaps();checkDate()}
['type','label','maps','date'].forEach(n=>f[n].addEventListener('input',checkAll));
f.addEventListener('submit',async e=>{e.preventDefault();go.disabled=true;out.style.display='block';out.textContent='Working…';
const d=Object.fromEntries(new FormData(f));
try{const r=await fetch('/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});
const j=await r.json();out.textContent=(j.ok?'OK\\n\\n'+j.stdout:(j.error||j.stdout||'Failed'))+(j.stderr?'\\n'+j.stderr:'');}
catch(err){out.textContent='Error: '+err}finally{go.disabled=false}});
</script></body></html>"""


class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/add":
            self.send_response(405); self.end_headers(); return
        if path == "/photos":
            body = json.dumps(unused_photos()).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers(); self.wfile.write(body); return
        if path == "/types":
            body = json.dumps(known_types()).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers(); self.wfile.write(body); return
        if path.startswith("/images/"):
            name = Path(path[len("/images/"):]).name
            target = ROOT / "images" / name
            if not target.is_file() or target.resolve().parent != (ROOT / "images").resolve():
                self.send_response(404); self.end_headers(); return
            body = target.read_bytes()
            ctype = {".jpg": "image/jpeg", ".jpeg": "image/jpeg",
                     ".png": "image/png", ".webp": "image/webp"}.get(target.suffix.lower(), "application/octet-stream")
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers(); self.wfile.write(body); return
        body = FORM.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers(); self.wfile.write(body)

    def do_POST(self):
        if urlparse(self.path).path != "/add":
            self.send_response(404); self.end_headers(); return
        raw = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        data = json.loads(raw or b"{}")
        cmd = [sys.executable, str(SCRIPT), data.get("image", ""), data.get("shop", ""),
               data.get("type", ""), data.get("maps", "")]
        for key, flag in (("label", "--label"), ("note", "--note"), ("date", "--date")):
            if data.get(key):
                cmd += [flag, data[key]]
        p = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", cwd=str(ROOT))
        ok = p.returncode == 0
        body = json.dumps({"ok": ok, "stdout": p.stdout.strip(), "stderr": p.stderr.strip()}).encode("utf-8")
        self.send_response(200 if ok else 400)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers(); self.wfile.write(body)


if __name__ == "__main__":
    print(f"Kyuu entry editor: http://127.0.0.1:{PORT}/")
    try:
        webbrowser.open(f"http://127.0.0.1:{PORT}/")
    except Exception:
        pass
    with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
        httpd.serve_forever()
