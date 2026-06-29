#!/usr/bin/env bash
# Start the menu-backup server in the background (survives this terminal closing).
# Re-running is safe: it won't start a second copy if one is already up.
set -e
cd "$(dirname "$0")"

if curl -s --max-time 3 http://127.0.0.1:9120/api/health >/dev/null 2>&1; then
  echo "menu-save-server already running on :9120"
  exit 0
fi

setsid nohup env PORT=9120 DATA_DIR="$(pwd)/data" node "$(pwd)/server.js" > "$(pwd)/server.log" 2>&1 &
sleep 1.5
if curl -s --max-time 3 http://127.0.0.1:9120/api/health >/dev/null 2>&1; then
  echo "menu-save-server started on :9120  (logs: $(pwd)/server.log, data: $(pwd)/data)"
else
  echo "FAILED to start — check $(pwd)/server.log"; exit 1
fi
