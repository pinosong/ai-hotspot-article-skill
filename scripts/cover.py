#!/usr/bin/env python3
"""Generate the 公众号 cover card (900x383, black bg + brand green).
Usage: python3 cover.py --title "Gemini 4 Argon 来了" --sub1 "通稿数据很能打"
       --sub2 "真实口碑却吵翻了" --date "2026.10.14" --brand "AI 捡漏指南 · 每日热点"
       --out cover.png
"""
import argparse
from PIL import Image, ImageDraw, ImageFont

W, H = 900, 383
BG = (10, 14, 13)
GREEN = (5, 150, 105)
FONT = "/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--title", required=True)
    ap.add_argument("--sub1", default="")
    ap.add_argument("--sub2", default="")
    ap.add_argument("--date", default="")
    ap.add_argument("--brand", default="AI 捡漏指南 · 每日热点")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()

    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    for cx, cy, r, al in [(770, 70, 90, 26), (830, 300, 120, 20), (90, 320, 70, 22)]:
        glow = Image.new("RGBA", (r * 2, r * 2), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow)
        for i in range(r, 0, -1):
            alpha = int(al * (1 - i / r))
            gd.ellipse([r - i, r - i, r + i, r + i], fill=GREEN + (alpha,))
        img.paste(glow, (cx - r, cy - r), glow)

    f_title = ImageFont.truetype(FONT, 64, index=0)
    f_sub = ImageFont.truetype(FONT, 26, index=0)
    f_brand = ImageFont.truetype(FONT, 20, index=0)

    d.text((64, 34), a.brand, font=f_brand, fill=GREEN)
    d.text((60, 78), a.title, font=f_title, fill=(255, 255, 255))
    if a.sub1:
        d.text((64, 168), a.sub1, font=f_sub, fill=(220, 225, 223))
    if a.sub2:
        d.text((64, 208), a.sub2, font=f_sub, fill=(160, 170, 168))
    d.rectangle([64, 280, 112, 284], fill=GREEN)
    if a.date:
        d.text((64, 300), a.date, font=f_brand, fill=(120, 130, 128))
    img.save(a.out)
    print(f"saved {a.out} ({W}x{H})")


if __name__ == "__main__":
    main()
