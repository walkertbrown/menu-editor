// POST /api/restaurant/logo  — upload a logo image
// DELETE /api/restaurant/logo — remove the logo

import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { getRestaurant, saveRestaurant } from "@/content/store";

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"]);
const EXT_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/gif": "gif",
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("logo") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const mime = file.type;
    if (!ALLOWED_TYPES.has(mime)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const ext = EXT_MAP[mime] ?? "png";
    const filename = `restaurant-logo.${ext}`;
    const filePath = path.join(process.cwd(), "public", filename);

    // Remove any previous logo files with different extensions
    const restaurant = await getRestaurant();
    if (restaurant.logoUrl) {
      const prev = path.join(process.cwd(), "public", path.basename(restaurant.logoUrl));
      if (prev !== filePath && existsSync(prev)) {
        await unlink(prev).catch(() => {});
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const logoUrl = `/${filename}`;
    await saveRestaurant({ ...restaurant, logoUrl });

    return NextResponse.json({ logoUrl });
  } catch (err) {
    console.error("[POST /api/restaurant/logo]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const restaurant = await getRestaurant();
    if (restaurant.logoUrl) {
      const prev = path.join(process.cwd(), "public", path.basename(restaurant.logoUrl));
      if (existsSync(prev)) {
        await unlink(prev).catch(() => {});
      }
    }
    await saveRestaurant({ ...restaurant, logoUrl: undefined });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/restaurant/logo]", err);
    return NextResponse.json({ error: "Remove failed" }, { status: 500 });
  }
}
