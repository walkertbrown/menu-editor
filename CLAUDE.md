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
- `saveMenu(menu, sections, items, opts?)` — persists + creates snapshot
  - `opts.snapshotLabel` — human label for the snapshot
  - `opts.scopeSectionIds` — string[]; when provided, only those section ids are
    considered "this side's" scope. Sections/items outside the scope are preserved
    from the store (scoped-merge mode). Omit for unscoped full-replace saves
    (dinner and drinks).
  - `opts.allowEmpty` — when true bypasses the empty-save guard. Use only after
    the user confirms they want to erase all content on this side.
  - Throws `EmptyMenuSaveError` (exported; `err.code === 'EMPTY_MENU_SAVE'`) when
    the incoming scoped set is empty but the store has content there.
  - Snapshots always store the FULL merged state so restore is always safe.
- `listSnapshots(menuId)` — last 10 snapshots
- `restoreSnapshot(snapshotId)` — rolls back live data
- `EmptyMenuSaveError` — exported error class; `code === 'EMPTY_MENU_SAVE'`

`/content/mergeMenuSave.ts` — pure helper (no I/O) that implements the
scoped-merge logic. Supabase adapter must call the equivalent logic.

**To swap to Supabase**: implement the same five functions + EmptyMenuSaveError in
a new file and change the import in `/content/store.ts`. No other files change.

## API routes
- `GET  /api/menus` — all menus
- `GET  /api/menus/[id]` — menu + sections + items
- `PUT  /api/menus/[id]` — save; body: `{menu, sections, items, snapshotLabel?,
  scopeSectionIds?, allowEmpty?}`; returns 200 `{ok, snapshots}`, 409 `{code,
  error}` on empty-save guard, 400 on missing fields
- `GET  /api/menus/[id]/snapshots` — snapshot list
- `POST /api/menus/[id]/snapshots` — restore (body: `{snapshotId}`)

## What's NOT here yet (future phases)
- Pelican Club design/theme (Phase 1)
- PDF export (Phase 2)
- Supabase cloud store (Phase 3)
- Auth / multi-user (Phase 4)
