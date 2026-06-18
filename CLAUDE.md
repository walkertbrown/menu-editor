@AGENTS.md

# Pelican Club Menu Editor — Project Conventions

## Stack
- Next.js (App Router) · TypeScript · React
- `@dnd-kit/core` + `@dnd-kit/sortable` for drag-to-reorder
- Local JSON file store at `data/menus.json` (swappable to Supabase)

## Branch convention
- `main` — stable only; never work directly here
- Feature work always goes on a named branch, e.g. `phase-1-theme`

## File-size limit
~300 lines per file. If a file approaches that, split it.

## Architecture — three top-level areas

| Area | Path | What lives here |
|---|---|---|
| content | `/content/` | Data types, store interface, seed data, snapshot logic |
| theme | `/theme/` | Per-item-type read-only renderers + page furniture stub |
| editor | `/editor/` | Editor screens, section editor, item card shell, field editors |

## One feature per file
- Each item-type renderer has its own file: `theme/renderers/<Type>Item.tsx`
- Each item-type field editor has its own file: `editor/fields/<Type>Fields.tsx`
- `ItemCard.tsx` — card shell + type dispatch only (no field logic)
- `SectionEditor.tsx` — section header, reorder controls, droppable container
- `MenuEditor.tsx` — top-level screen, DndContext, save/restore

## Data model summary
See `/content/types.ts` for full TypeScript interfaces.

Item types: `food`, `wine_by_glass`, `beer_cider`, `cocktail`, `spirit_list`

The store shape (`StoreShape`) is:
```
{ menus, sections, items, snapshots }
```

## Data access layer
`/content/store.ts` exports:
- `getMenus()` — list all menus
- `getMenu(id)` — menu + sections + items
- `saveMenu(menu, sections, items, label?)` — persists + creates snapshot
- `listSnapshots(menuId)` — last 10 snapshots
- `restoreSnapshot(snapshotId)` — rolls back live data

**To swap to Supabase**: implement the same five functions in a new file and change the import in `/content/store.ts`. No other files change.

## API routes
- `GET  /api/menus` — all menus
- `GET  /api/menus/[id]` — menu + sections + items
- `PUT  /api/menus/[id]` — save (body: `{menu, sections, items}`)
- `GET  /api/menus/[id]/snapshots` — snapshot list
- `POST /api/menus/[id]/snapshots` — restore (body: `{snapshotId}`)

## What's NOT here yet (future phases)
- Pelican Club design/theme (Phase 1)
- PDF export (Phase 2)
- Supabase cloud store (Phase 3)
- Auth / multi-user (Phase 4)
