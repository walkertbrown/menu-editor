// GET /api/restaurant  — return the shared restaurant identity
// PUT /api/restaurant  — save the shared restaurant identity

import { NextRequest, NextResponse } from "next/server";
import { getRestaurant, saveRestaurant } from "@/content/store";

export async function GET() {
  try {
    const identity = await getRestaurant();
    return NextResponse.json(identity);
  } catch (err) {
    console.error("[GET /api/restaurant]", err);
    return NextResponse.json({ error: "Failed to load restaurant" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { houseName, eyebrowLine } = body;
    if (typeof houseName !== "string" || typeof eyebrowLine !== "string") {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    await saveRestaurant({ houseName, eyebrowLine });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PUT /api/restaurant]", err);
    return NextResponse.json({ error: "Failed to save restaurant" }, { status: 500 });
  }
}
