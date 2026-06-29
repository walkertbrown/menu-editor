/**
 * agents/design.ts — DESIGN agent
 * Uses claude-opus-4-8 to set aesthetic direction.
 * TODO: enable adaptive thinking when AI SDK support is confirmed.
 */
import { genAnthropic } from "../providers.js";
import { MODEL_OPUS } from "../providers.js";
import type { RestaurantBrief } from "./read.js";
import type { Usage } from "../providers.js";

export interface DesignSpec {
  palette: { name: string; hex: string }[];
  type: { families: string[]; personalityNote: string };
  style: string;
  ornament: boolean;
}

const SYSTEM = `Set the aesthetic for THIS restaurant's menu — nothing else. From the brief (+ logo colors), choose a palette (hex), typography (≤2 families + a personality note), and a style direction. You have no house style — a diner and a brasserie must look nothing alike. Pull color from the brand/logo, never use their old menu's design. Decide no layout, structure, or spacing. Output {palette, type, style, ornament:bool}. Respond with only valid JSON.`;

export async function runDesign(brief: RestaurantBrief): Promise<{ designSpec: DesignSpec; usage: Usage }> {
  const prompt = `Restaurant brief:\n${JSON.stringify(brief, null, 2)}\n\nReturn only a JSON object with keys: palette (array of {name, hex}), type ({families: string[], personalityNote: string}), style (string), ornament (boolean).`;

  console.log("[DESIGN] Running claude-opus-4-8...");
  const result = await genAnthropic(MODEL_OPUS, SYSTEM, prompt, 1200);

  let designSpec: DesignSpec;
  try {
    const jsonMatch = result.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    designSpec = JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.warn("[DESIGN] JSON parse failed, using fallback:", (e as Error).message);
    designSpec = {
      palette: [
        { name: "Charcoal", hex: "#2C2C2C" },
        { name: "Warm Ivory", hex: "#F5F0E8" },
        { name: "Amber Gold", hex: "#C8963E" },
        { name: "Deep Burgundy", hex: "#6B2D2D" },
      ],
      type: { families: ["Playfair Display", "Lato"], personalityNote: "Elegant serif headlines with clean sans body" },
      style: "Warm American brasserie: dark and moody with gold accents, approachable but refined",
      ornament: true,
    };
  }

  return { designSpec, usage: result.usage };
}
