#!/usr/bin/env python3
"""Threaded static server. Images/pages load in parallel (fast), HTML isn't cached
so edits always show on reload; static assets get a short cache for snappy repeats."""
import http.server
from http.server import ThreadingHTTPServer

PORT = 8000


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        path = self.path.split("?")[0].lower()
        if path.endswith((".html", "/")) or path == "":
            # always revalidate HTML so edits show immediately
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        else:
            # let the browser cache images/js/css/fonts briefly -> fast repeat loads
            self.send_header("Cache-Control", "public, max-age=3600")
        super().end_headers()


ThreadingHTTPServer.allow_reuse_address = True
ThreadingHTTPServer.daemon_threads = True
with ThreadingHTTPServer(("127.0.0.1", PORT), Handler) as httpd:
    print(f"Serving (threaded) at http://localhost:{PORT}")
    httpd.serve_forever()
