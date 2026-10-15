#!/usr/bin/env python3
"""HTML open/close tag balance check. Exit 0 when clean, 1 with errors listed.
Component-assembled HTML (like the gzh builder) silently swallows content when
a tag is left unclosed -- run this after every build, before delivery.

Usage: python3 tagcheck.py file.html
"""
import sys
from html.parser import HTMLParser

VOID = {"br", "img", "hr", "meta", "link", "input", "source", "wbr"}


class Checker(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag not in VOID:
            self.stack.append((tag, self.getpos()))

    def handle_startendtag(self, tag, attrs):
        pass

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack:
            self.errors.append(f"extra </{tag}> at {self.getpos()}")
            return
        if self.stack[-1][0] == tag:
            self.stack.pop()
            return
        names = [t for t, _ in self.stack]
        if tag in names:
            while self.stack and self.stack[-1][0] != tag:
                t, pos = self.stack.pop()
                self.errors.append(f"unclosed <{t}> opened at {pos}, closed by </{tag}>")
            self.stack.pop()
        else:
            self.errors.append(f"</{tag}> has no matching open at {self.getpos()}")


def main():
    if len(sys.argv) != 2:
        print("usage: python3 tagcheck.py file.html", file=sys.stderr)
        sys.exit(2)
    with open(sys.argv[1], encoding="utf-8") as f:
        src = f.read()
    c = Checker()
    c.feed(src)
    for t, pos in c.stack:
        c.errors.append(f"unclosed <{t}> opened at {pos} (EOF reached)")
    if c.errors:
        print(f"ERRORS: {len(c.errors)}")
        for e in c.errors[:25]:
            print(" -", e)
        sys.exit(1)
    print("OK: tags balanced")


if __name__ == "__main__":
    main()
