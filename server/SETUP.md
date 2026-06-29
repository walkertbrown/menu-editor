# Menu backup server — operator setup (Walker)

Backs up each restaurant's menu (the editor's "Backed up ✓") to ServerMac.
No domain needed — rides your existing Tailscale Funnel.

## One-time / after a reboot — two commands

1. **Start the save server** (no sudo):
   ```
   bash server/start.sh
   ```

2. **Expose it on the Funnel at /menus** (needs sudo — it's a network change):
   ```
   sudo tailscale funnel --bg --set-path /menus 9120
   ```
   This is *additive* — it does not touch the existing `/ → 9100` mapping.

## Verify it's live (public URL)
```
curl https://servermac.tailaad45c.ts.net/menus/api/health
```
Should return `{"ok":true,...}`.

## Where things live
- Server code:   `server/server.js`
- Saved menus:   `server/data/<restaurantId>.json`
- Logs:          `server/server.log`
- Olive Branch id: `server/olive-branch.id`

## See a restaurant's latest backup
```
curl https://servermac.tailaad45c.ts.net/menus/api/menu/$(cat server/olive-branch.id) | head -c 300
```

## Make a new restaurant's editor later
From `builds/olive-branch`:
```
node package-single.cjs "their-id-here" "Their Name" "https://servermac.tailaad45c.ts.net/menus"
```
Output lands in `builds/olive-branch/package/`. Use a unique, hard-to-guess id
(it's the only key protecting that restaurant's data).

## Notes
- The endpoint is open to anyone who knows the exact id (the id is the secret).
  Fine for a pilot; add a token header later if you scale.
- To take the Funnel path down: `sudo tailscale funnel --set-path /menus off`
