// GET /api/menus — return all menus
import { NextResponse } from "next/server";
import { getMenus } from "@/content/store";

export async function GET() {
  try {
    const menus = await getMenus();
    return NextResponse.json(menus);
  } catch (err) {
    console.error("[GET /api/menus]", err);
    return NextResponse.json({ error: "Failed to load menus" }, { status: 500 });
  }
}
