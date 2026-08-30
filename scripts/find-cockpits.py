#!/usr/bin/env python3
# find-cockpits.py — list candidate cockpit images from Wikimedia Commons.
# Writes JSON lines: {title, license, artist, thumb, url}
# Usage: python find-cockpits.py [output.jsonl]  (default: ../assets/cockpit-candidates.jsonl)
import json
import os
import sys
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "..", "assets", "cockpit-candidates.jsonl")

UA = "DSHF1Skin/0.1 (personal F1 theme asset research; python-urllib)"
API = "https://commons.wikimedia.org/w/api.php"
CATEGORIES = [
    "Category:Top views of Formula One cars",
    "Category:Formula One car cockpits",
    "Category:Formula One steering wheels",
]


def api(params):
    params = dict(params)
    params.setdefault("format", "json")
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


out_path = os.path.abspath(OUT)
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, "w", encoding="utf-8") as out:
    for cat in CATEGORIES:
        data = api({
            "action": "query",
            "generator": "categorymembers",
            "gcmtitle": cat,
            "gcmtype": "file",
            "gcmlimit": "50",
            "prop": "imageinfo",
            "iiprop": "url|extmetadata",
            "iiurlwidth": "1600",
        })
        pages = (data.get("query") or {}).get("pages") or {}
        for p in pages.values():
            info = (p.get("imageinfo") or [{}])[0]
            meta = info.get("extmetadata") or {}
            lic = (meta.get("LicenseShortName") or {}).get("value", "?")
            artist = (meta.get("Artist") or {}).get("value", "?")
            artist = artist.replace("<", " ").replace(">", " ")[:80]
            out.write(json.dumps({
                "category": cat,
                "title": p.get("title"),
                "license": lic,
                "artist": artist,
                "thumb": info.get("thumburl"),
                "url": info.get("url"),
            }, ensure_ascii=False) + "\n")
            out.flush()

print("wrote", len(open(out_path, encoding="utf-8").readlines()), "candidates to", out_path)
