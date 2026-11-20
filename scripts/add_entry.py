#!/usr/bin/env python3
"""Add one photo entry to Kyuu with a single command.

Usage (from anywhere):
  python scripts/add_entry.py <image> "<shop>" <type> <maps> [--label "A la carte"] [--note "..."] [--date YYYY-MM-DD] [--dry-run]

<image>  path to the photo (in images/ or elsewhere; it will be copied into images/)
<type>   key such as Roti, ALaCarte, KhaoKhaMu ... new keys are registered automatically
<maps>   either "lat,lng" or a full Google Maps URL containing @lat,lng
"""
import argparse
import datetime as dt
import json
import re
import shutil
import struct
import subprocess
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

TYPE_ALIASES = {"ข้าวขาหมู": "KhaoKhaMu"}

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "images"
DATA = ROOT / "data" / "entries.js"
APP = ROOT / "app.js"
INDEX = ROOT / "index.html"


def exif_datetime(path):
    data = path.read_bytes()[:200000]
    pos = 2
    while pos + 4 <= len(data):
        if data[pos] != 0xFF:
            break
        marker = data[pos + 1]
        if marker in (0xD8, 0xD9) or 0xD0 <= marker <= 0xD7:
            pos += 2
            continue
        if pos + 4 > len(data):
            break
        length = int.from_bytes(data[pos + 2:pos + 4], "big")
        if length < 2:
            break
        payload = data[pos + 4:pos + 2 + length]
        if marker == 0xE1 and payload.startswith(b"Exif\x00\x00"):
            tiff = payload[6:]
            if len(tiff) < 8:
                break
            endian = "<" if tiff[:2] == b"II" else ">" if tiff[:2] == b"MM" else None
            if not endian:
                break
            try:
                ifd = struct.unpack_from(endian + "I", tiff, 4)[0]
                count = struct.unpack_from(endian + "H", tiff, ifd)[0]
                for i in range(count):
                    off = ifd + 2 + i * 12
                    tag, typ, num = struct.unpack_from(endian + "HHI", tiff, off)
                    if tag == 0x0132 and typ == 2:
                        if num <= 4:
                            raw = tiff[off + 8:off + 8 + num]
                        else:
                            voff = struct.unpack_from(endian + "I", tiff, off + 8)[0]
                            raw = tiff[voff:voff + num]
                        s = raw.split(b"\x00")[0].decode("ascii", "replace")
                        m = re.match(r"(\d{4}):(\d{2}):(\d{2})", s)
                        if m:
                            return "-".join(m.groups())
            except Exception:
                pass
        pos += 2 + length
        if marker == 0xDA:
            break
    return None


def date_from_name(name):
    m = re.search(r"(20\d{2})(\d{2})(\d{2})", name)
    return "-".join(m.groups()) if m else None


def strip_metadata(path):
    data = path.read_bytes()
    if data[:2] != b"\xff\xd8":
        return False
    out = bytearray(data[:2]); pos = 2; removed = 0
    while pos + 4 <= len(data):
        if data[pos] != 0xFF:
            break
        marker = data[pos + 1]
        if marker in (0xD8, 0xD9) or 0xD0 <= marker <= 0xD7:
            out += data[pos:pos + 2]; pos += 2; continue
        length = int.from_bytes(data[pos + 2:pos + 4], "big")
        if length < 2:
            break
        payload = data[pos + 4:pos + 2 + length]
        drop = (
            (marker == 0xE1 and (payload.startswith(b"Exif\x00\x00") or
                                 payload.startswith(b"http://ns.adobe.com/xap/1.0/"))) or
            (marker == 0xED and payload.startswith(b"Photoshop 3.0")) or
            marker == 0xFE
        )
        if drop:
            removed += 1
        else:
            out += data[pos:pos + 2 + length]
        pos += 2 + length
        if marker == 0xDA:
            out += data[pos:]; break
    if removed:
        path.write_bytes(out)
    return bool(removed)


def dims(path):
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-select_streams", "v:0",
        "-show_entries", "stream=width,height", "-of", "json", str(path)
    ], text=True)
    s = json.loads(out)["streams"][0]
    return int(s["width"]), int(s["height"])


def make_display(src, dst):
    w, h = dims(src)
    if w * 2 >= h * 3:
        cw, ch = h * 3 // 2, h
    else:
        cw, ch = w, w * 2 // 3
    cw -= cw % 2; ch -= ch % 2
    x, y = (w - cw) // 2, (h - ch) // 2
    subprocess.run([
        "ffmpeg", "-y", "-loglevel", "error", "-i", str(src),
        "-vf", f"crop={cw}:{ch}:{x}:{y},scale=1200:800",
        "-q:v", "82", str(dst)
    ], check=True)


def make_thumb(src, dst):
    subprocess.run([
        "ffmpeg", "-y", "-loglevel", "error", "-i", str(src),
        "-vf", "scale=400:-2", "-q:v", "76", str(dst)
    ], check=True)


def maps_url(value):
    if value.startswith("http"):
        return value
    m = re.fullmatch(r"\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*", value)
    if not m:
        raise SystemExit("maps ต้องเป็นพิกัด 'lat,lng' หรือลิงก์ Google Maps แบบเต็ม")
    return f"https://www.google.com/maps/@{m.group(1)},{m.group(2)},17z?hl=en"


def js(v):
    return json.dumps(v, ensure_ascii=False)


def add_entry_block(date, shop, type_key, display_rel, thumb_rel, maps_link, note):
    note_line = f',\n    note: {js(note)}' if note else ""
    return (
        "  {\n"
        f"    date: {js(date)},\n"
        f"    shop: {js(shop)},\n"
        f"    type: {js(type_key)},\n"
        f"    display: {js(display_rel)},\n"
        f"    thumb: {js(thumb_rel)},\n"
        f"    maps: {js(maps_link)}{note_line}\n"
        "  }"
    )


def insert_entry(text, block):
    idx = text.rfind("];")
    if idx < 0:
        raise SystemExit("หาจุดปิด array ใน data/entries.js ไม่เจอ")
    head, tail = text[:idx].rstrip(), text[idx:]
    sep = ",\n" if head.rstrip().endswith("}") else "\n"
    return head + sep + block + "\n" + tail


def register_type(type_key, label):
    app = APP.read_text(encoding="utf-8")
    name_block = re.search(r"(const dishNames = \{)(.*?)(\n\};)", app, re.S)
    if not name_block:
        raise SystemExit("หา dishNames ใน app.js ไม่เจอ")

    if re.search(r"\b" + re.escape(type_key) + r"\s*:", name_block.group(2)):
        return False

    inner = name_block.group(2).rstrip()
    if not inner.endswith(","):
        inner += ","
    app = app[:name_block.start(2)] + inner + f"\n  {type_key}: {js(label)}" + app[name_block.end(2):]

    known_block = re.search(r"(const known = \{)([^\n]*?)(\};)", app)
    if not known_block:
        raise SystemExit("หา known color map ใน app.js ไม่เจอ")
    known = known_block.group(2).rstrip()
    count = len([p for p in known.split(",") if p.strip()])
    if not known.endswith(","):
        known += ","
    app = app[:known_block.start(2)] + known + f" {type_key}: {count}" + app[known_block.end(2):]
    APP.write_text(app, encoding="utf-8")
    return True


def bump_cache():
    text = INDEX.read_text(encoding="utf-8")
    nums = [int(n) for n in re.findall(r"\?v=(\d+)", text)]
    if not nums:
        return None
    new = max(nums) + 1
    INDEX.write_text(re.sub(r"\?v=\d+", f"?v={new}", text), encoding="utf-8")
    return new


def main():
    ap = argparse.ArgumentParser(description="Add one photo entry to Kyuu")
    ap.add_argument("image")
    ap.add_argument("shop")
    ap.add_argument("type")
    ap.add_argument("maps")
    ap.add_argument("--label", help="display label for a new type")
    ap.add_argument("--note", default="")
    ap.add_argument("--date", help="override capture date YYYY-MM-DD")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    a.type = TYPE_ALIASES.get(a.type.strip(), a.type.strip())

    src = Path(a.image).expanduser()
    if not src.is_absolute():
        src = (Path.cwd() / src).resolve()
    if not src.is_file():
        raise SystemExit(f"ไม่เจอรูป: {src}")

    IMAGES.mkdir(exist_ok=True)
    target = IMAGES / src.name
    if src.resolve() != target.resolve():
        if target.exists():
            raise SystemExit(f"มีไฟล์ชื่อนี้ใน images/ แล้ว: {target}")
        shutil.copy2(src, target)
    photo = target

    date = a.date or exif_datetime(photo) or date_from_name(photo.name)
    if not date:
        raise SystemExit("หาวันถ่ายไม่เจอ — ใส่ --date YYYY-MM-DD")
    try:
        dt.date.fromisoformat(date)
    except ValueError:
        raise SystemExit(f"วันที่ไม่ถูกต้อง: {date}")

    display = photo.with_name(photo.stem + "-display.webp")
    thumb = photo.with_name(photo.stem + "-thumb.webp")
    block = add_entry_block(date, a.shop, a.type,
                            "images/" + display.name,
                            "images/" + thumb.name, maps_url(a.maps), a.note)

    if a.dry_run:
        print("DRY RUN")
        print("date:", date)
        print("photo:", photo)
        print("display:", display)
        print("thumb:", thumb)
        print(block)
        return

    print("strip metadata:", "removed" if strip_metadata(photo) else "already clean")
    make_display(photo, display)
    make_thumb(photo, thumb)
    DATA.write_text(insert_entry(DATA.read_text(encoding="utf-8"), block), encoding="utf-8")
    added = register_type(a.type, a.label or a.type)
    version = bump_cache()
    print("added entry:", a.shop, date, a.type)
    print("registered new type:", added)
    print("cache version:", version)
    print("display:", display)


if __name__ == "__main__":
    main()
