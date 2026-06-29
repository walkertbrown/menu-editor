/**
 * agents/spacing.ts — SPACING agent
 * Uses DeepSeek to decide spacing intent (relative, not fixed numbers).
 */
import { genDeepSeek } from "../providers.js";
import type { DesignSpec } from "./design.js";
import type { StructureSpec } from "./layout.js";
import type { Menu } from "../menus/the-smith.js";
import type { Usage } from "../providers.js";

export interface SpacingSpec {
  density: string;
  sectionWhitespace: string;
  itemSpacing: string;
  leadingFeel: string;
  notes: string;
}

const SYSTEM = `Decide spacing intent, never fixed numbers. Given design + structure + content volume, express how it should breathe: density (airy↔dense), relative whitespace section-vs-item, leading feel — all relative, tuned to the vibe. There should not be giant areas of empty space unless specifically planned. Output relative intent only; the builder and fit step resolve actual sizes. Output {density, sectionWhitespace, itemSpacing, leadingFeel, notes}. Respond with only valid JSON.`;

export async function runSpacing(menu: Menu, designSpec: DesignSpec, structureSpec: StructureSpec): Promise<{ spacingSpec: SpacingSpec; usage: Usage }> {
  const totalItems = menu.sections.reduce((sum, s) => sum + s.items.length, 0);
  const prompt = `Content volume: ${menu.sections.length} sections, ${totalItems} total items\nDesign style: ${designSpec.style}\nMood: ${JSON.stringify(designSpec)}\nStructure: ${JSON.stringify(structureSpec)}\n\nReturn only a JSON object with keys: density (string), sectionWhitespace (string), itemSpacing (string), leadingFeel (string), notes (string).`;

  console.log("[SPACING] Running DeepSeek...");
  const result = await genDeepSeek(SYSTEM, prompt, 800);

  let spacingSpec: SpacingSpec;
  try {
    const jsonMatch = result.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    spacingSpec = JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.warn("[SPACING] JSON parse failed, using fallback:", (e as Error).message);
    spacingSpec = {
      density: "moderately dense — many items, must fit a letter sheet without crowding",
      sectionWhitespace: "tight margin between sections, enough breathing room to distinguish them visually",
      itemSpacing: "compact item rows, description slightly smaller than name",
      leadingFeel: "snug but legible — 1.3–1.4x line height feel",
      notes: "Priority: all content must fit single sheet. No giant header areas.",
    };
  }

  return { spacingSpec, usage: result.usage };
}
