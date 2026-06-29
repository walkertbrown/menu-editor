/**
 * agents/builder.ts — BUILDER agent
 * Uses claude-sonnet-4-6 to produce self-contained HTML/CSS for the menu.
 * maxOutputTokens 8000 as specified.
 */
import { genAnthropic } from "../providers.js";
import { MODEL_SONNET } from "../providers.js";
import type { Menu } from "../menus/the-smith.js";
import type { RestaurantBrief } from "./read.js";
import type { DesignSpec } from "./design.js";
import type { StructureSpec } from "./layout.js";
import type { SpacingSpec } from "./spacing.js";
import type { CheckerFinding } from "./checker.js";
import type { Usage } from "../providers.js";

const SYSTEM = `Implement the specs into print-ready, semantic HTML/CSS for a US-letter sheet that faithfully realizes design + structure + spacing. Don't redesign — implement. Keep markup cleanly structured so it can be measured and reflowed.

CRITICAL CONSTRAINTS:
- Output ONLY a complete, self-contained HTML document (<!DOCTYPE html> through </html>). No markdown, no explanation, no code fences.
- Target viewport: 816px wide × 1056px tall (US letter at 96dpi). ALL content MUST fit within this height.
- Use compact but legible font sizes (menu items ~11-12px, descriptions ~10px, section headers ~13-14px).
- Use CSS columns if column layout is specified — this naturally flows content to fit the page.
- No external dependencies — inline all CSS. Use Google Fonts @import only if needed.
- Body margin: 24px on all sides. Content must fit 816px - 48px = 768px wide.
- The page should look like a real printed restaurant menu that a client would pay for.`;

function menuToText(menu: Menu): string {
  return menu.sections.map(section => {
    const items = section.items.map(item => {
      const price = item.price !== null ? `$${item.price}` : "MP";
      const desc = item.desc ? ` — ${item.desc}` : "";
      return `  ${item.name} ${price}${desc}`;
    }).join("\n");
    const note = section.note ? `\n  [${section.note}]` : "";
    return `${section.title}${note}\n${items}`;
  }).join("\n\n");
}

export async function runBuilder(
  menu: Menu,
  brief: RestaurantBrief,
  designSpec: DesignSpec,
  structureSpec: StructureSpec,
  spacingSpec: SpacingSpec,
  checkerFindings: CheckerFinding[],
  iteration: number,
): Promise<{ html: string; usage: Usage }> {
  const menuText = menuToText(menu);

  const findingsSection = checkerFindings.length > 0
    ? `\n\nCHECKER FINDINGS TO FIX (iteration ${iteration}):\n${checkerFindings.map(f => `- [${f.severity}] ${f.issue} (${f.location}) — ${f.rootCause}`).join("\n")}`
    : "";

  const prompt = `RESTAURANT: ${menu.name}, ${menu.location}

RESTAURANT BRIEF:
${JSON.stringify(brief, null, 2)}

DESIGN SPEC:
${JSON.stringify(designSpec, null, 2)}

STRUCTURE SPEC:
${JSON.stringify(structureSpec, null, 2)}

SPACING SPEC:
${JSON.stringify(spacingSpec, null, 2)}

MENU CONTENT:
${menuText}

FOOTER:
${menu.footer}
${findingsSection}

Produce a single complete HTML document. Start with <!DOCTYPE html> and end with </html>. No other text.`;

  console.log(`[BUILDER] Running claude-sonnet-4-6 (iteration ${iteration})...`);
  const result = await genAnthropic(MODEL_SONNET, SYSTEM, prompt, 8000);

  // Extract the HTML — strip any accidental markdown fences
  let html = result.text.trim();
  const fenceMatch = html.match(/```(?:html)?\n?([\s\S]*?)```/);
  if (fenceMatch) html = fenceMatch[1].trim();
  if (!html.startsWith("<!DOCTYPE")) {
    const docStart = html.indexOf("<!DOCTYPE");
    if (docStart !== -1) html = html.slice(docStart);
  }

  return { html, usage: result.usage };
}
