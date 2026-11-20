#!/usr/bin/env python3
"""Tiny local-only form for adding Kyuu entries. Never deployed to GitHub Pages."""
import http.server
import json
import socketserver
import subprocess
import sys
import webbrowser
from pathlib import Path
from urllib.parse import urlparse

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "scripts" / "add_entry.py"
PORT = 8130

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
</style></head><body><div class="wrap">
<h1>Add a plate</h1><p class="lead">Local editor only — nothing here is published.</p>
<form id="f">
<label>Photo path</label><input name="image" required placeholder="images/IMG_20260501_120000.jpg">
<div class="hint">Path on this computer. Date and metadata are handled automatically.</div>
<label>Shop</label><input name="shop" required placeholder="ร้านตัวอย่าง">
<div class="row"><div><label>Type key</label><input name="type" required placeholder="Roti"></div>
<div><label>Display label</label><input name="label" placeholder="A la carte"></div></div>
<div class="hint">Existing keys: Zhujiaofan, Shaorou, PadThaiHoiTod, Roti, ALaCarte. New keys are registered.</div>
<label>Google Maps — coords or full link</label><input name="maps" required placeholder="13.75,100.50">
<label>Note (optional)</label><input name="note">
<label>Date override (optional)</label><input name="date" placeholder="YYYY-MM-DD">
<button id="go" type="submit">Add entry</button>
</form><div id="out"></div>
</div><script>
const f=document.getElementById('f'),out=document.getElementById('out'),go=document.getElementById('go');
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
        if urlparse(self.path).path == "/add":
            self.send_response(405); self.end_headers(); return
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
