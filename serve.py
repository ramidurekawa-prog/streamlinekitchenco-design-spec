#!/usr/bin/env python3
"""
SKC design-spec dev server.

Plain `python -m http.server` sends no Cache-Control, so browsers heuristically
cache core.js / styles.css / fragments and serve them STALE during review — which
looks like "buttons don't work" (a stale core.js is missing the newest functions
the freshly-fetched buttons call). This server sends no-store on every response,
so the browser always loads the current files. No hard-refresh needed.

Usage:  python3 serve.py        # serves cwd on http://localhost:8000
"""
import http.server
import socketserver

PORT = 8000


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), NoCacheHandler) as httpd:
        print(f"SKC no-cache dev server → http://localhost:{PORT}  (Ctrl+C to stop)")
        httpd.serve_forever()
