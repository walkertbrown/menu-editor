// GET /api/menus/[id]  — return a menu with its sections and items
// PUT /api/menus/[id]  — save menu, sections, and items; creates a snapshot

import { NextRequest, NextResponse } from "next/server";
import { getMenu, saveMenu, listSnapshots } from "@/content/store";

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
    const { menu, sections, items, snapshotLabel } = body;
    if (!menu || !sections || !items) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    await saveMenu(menu, sections, items, snapshotLabel);
    const snapshots = await listSnapshots(id);
    return NextResponse.json({ ok: true, snapshots });
  } catch (err) {
    console.error(`[PUT /api/menus/${id}]`, err);
    return NextResponse.json({ error: "Failed to save menu" }, { status: 500 });
  }
}
