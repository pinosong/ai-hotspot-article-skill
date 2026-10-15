#!/usr/bin/env python3
"""Inline local images as base64 data URIs -> single self-contained HTML file.
Relative-path images break in chat attachments and Telegram; always ship the
single-file build to the user.

Usage: python3 inline_images.py input.html output.html
Image paths are resolved relative to input.html's directory.
"""
import base64
import os
import re
import sys

MIME = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
        ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml"}


def main():
    if len(sys.argv) != 3:
        print("usage: python3 inline_images.py input.html output.html", file=sys.stderr)
        sys.exit(2)
    src_path, out_path = sys.argv[1], sys.argv[2]
    base = os.path.dirname(os.path.abspath(src_path))
    with open(src_path, encoding="utf-8") as f:
        html = f.read()

    def inline(m):
        rel = m.group(1)
        if rel.startswith("data:"):
            return m.group(0)
        full = os.path.normpath(os.path.join(base, rel))
        ext = os.path.splitext(full)[1].lower()
        with open(full, "rb") as f:
            b64 = base64.b64encode(f.read()).decode()
        print(f"inlined {rel}: -> {len(b64)} chars")
        return f'src="data:{MIME.get(ext, "image/png")};base64,{b64}"'

    out = re.sub(r'src="((?!data:|https?://|//)[^"]+)"', inline, html)
    # sanity: no leftover relative image refs
    leftovers = re.findall(r'src="(images/[^"]+)"', out)
    if leftovers:
        print(f"ERROR: leftover relative paths: {leftovers}", file=sys.stderr)
        sys.exit(1)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"wrote {out_path} ({os.path.getsize(out_path)} bytes)")


if __name__ == "__main__":
    main()
