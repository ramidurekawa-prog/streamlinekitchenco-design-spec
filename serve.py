#!/usr/bin/env python3
"""
SKC design-spec dev server.

Plain `python -m http.server` sends no Cache-Control, so browsers heuristically
cache core.js / styles.css / fragments and serve them STALE during review — which
looks like "buttons don't work" (a stale core.js is missing the newest functions
the freshly-fetched buttons call). This server sends no-store on every response,
so the browser always loads the current files. No hard-refresh needed.

It also binds dual-stack (IPv6 + IPv4) like `python -m http.server` does, so both
http://localhost:8000 and http://[::]:8000 work.

Usage:  python3 serve.py        # serves cwd on http://localhost:8000
"""
import contextlib
import http.server
import socket
import socketserver

PORT = 8000


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


class DualStackServer(socketserver.TCPServer):
    # Bind IPv6 but accept IPv4 too, so localhost AND [::] both resolve.
    address_family = socket.AF_INET6
    allow_reuse_address = True

    def server_bind(self):
        with contextlib.suppress(Exception):
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        return super().server_bind()


if __name__ == "__main__":
    with DualStackServer(("", PORT), NoCacheHandler) as httpd:
        print(f"SKC no-cache dev server → http://localhost:{PORT}  (Ctrl+C to stop)")
        httpd.serve_forever()
