#!/usr/bin/env python3
# fetch-cockpits.py — download the four selected cockpit images from
# Wikimedia Commons (see assets/cockpits/CREDITS.md for attribution).
# Saves assets/cockpits/<team>-raw.<ext>.
import os
import time
import urllib.error
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(HERE, "..", "assets", "cockpits"))
UA = "DSHF1Skin/0.1 (personal F1 theme asset research; python-urllib)"

PICKS = {
    "redbull": "https://upload.wikimedia.org/wikipedia/commons/2/28/Red_Bull_RB7_of_David_Coulthard_at_the_2025_Adelaide_Grand_Final_Parade_-_07.jpg",
    "ferrari": "https://upload.wikimedia.org/wikipedia/commons/8/87/Ferrari_F14_T_cockpit.jpg",
    "mclaren": "https://upload.wikimedia.org/wikipedia/commons/a/a4/McLaren_MP4-2_cockpit.jpg",
    "mercedes": "https://upload.wikimedia.org/wikipedia/commons/0/01/Mercedes_F1_W03_Petronas_Schumacher_%282%29.jpg",
}

os.makedirs(OUT, exist_ok=True)
for team, url in PICKS.items():
    ext = os.path.splitext(url.split("?")[0])[1] or ".jpg"
    dest = os.path.join(OUT, f"{team}-raw{ext}")
    if os.path.exists(dest) and os.path.getsize(dest) > 100000:
        print(f"{team}: already downloaded, skip")
        continue
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=120) as resp, open(dest, "wb") as f:
                data = resp.read()
                f.write(data)
            print(f"{team}: {len(data)} bytes -> {dest}")
            break
        except urllib.error.HTTPError as e:
            wait = 8 * (attempt + 1)
            print(f"{team}: HTTP {e.code}, retry in {wait}s")
            time.sleep(wait)
    else:
        print(f"{team}: FAILED after retries")
    time.sleep(3)
