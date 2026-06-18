// GET  /api/menus/[id]/snapshots   — list snapshots for a menu
// POST /api/menus/[id]/snapshots   — restore a snapshot

import { NextRequest, NextResponse } from "next/server";
import { listSnapshots, restoreSnapshot, getMenu } from "@/content/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const snapshots = await listSnapshots(id);
    return NextResponse.json(snapshots);
  } catch (err) {
    console.error(`[GET /api/menus/${id}/snapshots]`, err);
    return NextResponse.json({ error: "Failed to load snapshots" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { snapshotId } = await req.json();
    if (!snapshotId) {
      return NextResponse.json({ error: "snapshotId required" }, { status: 400 });
    }
    await restoreSnapshot(snapshotId);
    const result = await getMenu(id);
    if (!result) return NextResponse.json({ error: "Not found after restore" }, { status: 404 });
    return NextResponse.json(result);
  } catch (err) {
    console.error(`[POST /api/menus/${id}/snapshots]`, err);
    return NextResponse.json({ error: "Failed to restore snapshot" }, { status: 500 });
  }
}
