/**
 * agents/layout.ts — LAYOUT agent
 * Uses DeepSeek to decide structure: columns, section order, grouping, page plan.
 */
import { genDeepSeek } from "../providers.js";
import type { Menu } from "../menus/the-smith.js";
import type { DesignSpec } from "./design.js";
import type { Usage } from "../providers.js";

export interface StructureSpec {
  columns: number;
  sectionOrder: string[];
  grouping: string;
  pagePlan: string;
}

const SYSTEM = `Decide structure only. Structure follows the amount of items and categories: choose column count, section order and grouping, and the page/sheet plan. You may use their current menu as a basis, but judge it truly and only use the structure if it truly fits this new menu. Optimize for how a guest scans it. No fonts, no spacing values. Output {columns, sectionOrder, grouping, pagePlan}. Respond with only valid JSON.`;

export async function runLayout(menu: Menu, designSpec: DesignSpec): Promise<{ structureSpec: StructureSpec; usage: Usage }> {
  const sections = menu.sections.map(s => `${s.title} (${s.items.length} items)`).join(", ");
  const prompt = `Restaurant: "${menu.name}"\nTotal sections: ${menu.sections.length}\nSections with item counts: ${sections}\nDesign style: ${designSpec.style}\n\nReturn only a JSON object with keys: columns (number), sectionOrder (array of section title strings in recommended order), grouping (string description), pagePlan (string description).`;

  console.log("[LAYOUT] Running DeepSeek...");
  const result = await genDeepSeek(SYSTEM, prompt, 1000);

  let structureSpec: StructureSpec;
  try {
    const jsonMatch = result.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    structureSpec = JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.warn("[LAYOUT] JSON parse failed, using fallback:", (e as Error).message);
    structureSpec = {
      columns: 2,
      sectionOrder: menu.sections.map(s => s.title),
      grouping: "Group starters/salads left, mains right; steaks at bottom",
      pagePlan: "Single US-letter page, two equal columns, header at top",
    };
  }

  return { structureSpec, usage: result.usage };
}
