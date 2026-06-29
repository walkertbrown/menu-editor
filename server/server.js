// Tiny menu-backup server for the Olive Branch (and future) menu editors.
// Stores each restaurant's full menu state as JSON on disk, keyed by an id.
// No dependencies — Node's built-in http + fs only.
//
// Routes (prefix-agnostic, so it works whether Tailscale Funnel strips /menus):
//   GET  .../api/health          -> { ok: true }
//   GET  .../api/menu/:id        -> { savedAt, state } | 404
//   POST .../api/menu/:id        -> { ok, savedAt }   (body: { savedAt?, state })
//
// Run:  PORT=9120 DATA_DIR=~/menu-save-server/data node server.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '9120', 10);
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const MAX_BODY = 4 * 1024 * 1024; // 4 MB ceiling per save

fs.mkdirSync(DATA_DIR, { recursive: true });

const VALID_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{2,63}$/; // no path traversal, no dots
const fileFor = (id) => path.join(DATA_DIR, id + '.json');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
}
function send(res, code, obj) {
  cors(res);
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = code;
  res.end(JSON.stringify(obj));
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') { cors(res); res.statusCode = 204; return res.end(); }

  const url = req.url || '';
  if (/\/api\/health\b/.test(url)) return send(res, 200, { ok: true, time: new Date().toISOString() });

  const m = url.match(/\/api\/menu\/([^/?#]+)/);
  if (!m) return send(res, 404, { error: 'not found' });
  const id = decodeURIComponent(m[1]);
  if (!VALID_ID.test(id)) return send(res, 400, { error: 'bad id' });

  if (req.method === 'GET') {
    fs.readFile(fileFor(id), 'utf8', (err, data) => {
      if (err) return send(res, 404, { error: 'no backup yet' });
      try { return send(res, 200, JSON.parse(data)); }
      catch { return send(res, 500, { error: 'corrupt backup' }); }
    });
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    let aborted = false;
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY) { aborted = true; send(res, 413, { error: 'too large' }); req.destroy(); }
    });
    req.on('end', () => {
      if (aborted) return;
      let payload;
      try { payload = JSON.parse(body); } catch { return send(res, 400, { error: 'bad json' }); }
      if (!payload || typeof payload !== 'object' || !payload.state) return send(res, 400, { error: 'missing state' });
      const record = { savedAt: payload.savedAt || new Date().toISOString(), state: payload.state };
      // atomic write: temp file then rename, so a crash never corrupts the backup
      const tmp = fileFor(id) + '.tmp';
      fs.writeFile(tmp, JSON.stringify(record), (err) => {
        if (err) return send(res, 500, { error: 'write failed' });
        fs.rename(tmp, fileFor(id), (err2) => {
          if (err2) return send(res, 500, { error: 'commit failed' });
          console.log(`[${record.savedAt}] saved ${id} (${body.length} bytes)`);
          send(res, 200, { ok: true, savedAt: record.savedAt });
        });
      });
    });
    return;
  }

  return send(res, 405, { error: 'method not allowed' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`menu-save-server listening on http://127.0.0.1:${PORT}  (data: ${DATA_DIR})`);
});
