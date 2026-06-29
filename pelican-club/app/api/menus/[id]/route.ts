// GET /api/menus/[id]  — return a menu with its sections and items
// PUT /api/menus/[id]  — save menu, sections, and items; creates a snapshot
//
// PUT body fields:
//   menu, sections, items        — required
//   snapshotLabel                — optional human label for the snapshot
//   scopeSectionIds              — optional string[]; when present, only those
//                                  section ids are replaced; others are preserved
//   allowEmpty                   — optional boolean; when true bypasses the
//                                  empty-save guard (use after user confirms)
//
// PUT response codes:
//   200 { ok: true, snapshots }  — success
//   400                          — missing required fields
//   409 { code, error }          — empty-save guard blocked the write
//   500                          — unexpected error

import { NextRequest, NextResponse } from "next/server";
import { getMenu, saveMenu, listSnapshots, EmptyMenuSaveError } from "@/content/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const result = await getMenu(id);
    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(result);
  } catch (err) {
    console.error(`[GET /api/menus/${id}]`, err);
    return NextResponse.json({ error: "Failed to load menu" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { menu, sections, items, snapshotLabel, scopeSectionIds, allowEmpty } = body;
    if (!menu || !sections || !items) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    await saveMenu(menu, sections, items, {
      snapshotLabel,
      scopeSectionIds,
      allowEmpty,
    });
    const snapshots = await listSnapshots(id);
    return NextResponse.json({ ok: true, snapshots });
  } catch (err) {
    if (err instanceof EmptyMenuSaveError) {
      console.warn(`[PUT /api/menus/${id}] Empty-save guard blocked:`, err.message);
      return NextResponse.json(
        { code: err.code, error: err.message },
        { status: 409 }
      );
    }
    console.error(`[PUT /api/menus/${id}]`, err);
    return NextResponse.json({ error: "Failed to save menu" }, { status: 500 });
  }
}
