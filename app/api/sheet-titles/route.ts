// GET /api/sheet-titles       — return all sheet titles
// PUT /api/sheet-titles       — save a single sheet title

import { NextRequest, NextResponse } from "next/server";
import { getSheetTitles, saveSheetTitle } from "@/content/store";

export async function GET() {
  try {
    const titles = await getSheetTitles();
    return NextResponse.json(titles);
  } catch (err) {
    console.error("[GET /api/sheet-titles]", err);
    return NextResponse.json({ error: "Failed to load sheet titles" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { sheetId, title } = body;
    if (typeof sheetId !== "string" || typeof title !== "string") {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    await saveSheetTitle(sheetId, title);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PUT /api/sheet-titles]", err);
    return NextResponse.json({ error: "Failed to save sheet title" }, { status: 500 });
  }
}
