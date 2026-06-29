/**
 * pipeline.ts — orchestrator for the menu-design pipeline
 *
 * Order: READ → DESIGN → LAYOUT → SPACING → BUILDER → render+measure
 *        → CHECKER → (route fixes → re-BUILD/re-render/re-CHECK) × cap 4
 *
 * Run once with: npx tsx src/pipeline.ts
 */
// Env loading is handled by providers.ts (loads local .env + ~/recon/.env fallback)
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFile, mkdir } from "node:fs/promises";

import { theSmith } from "./menus/the-smith.js";
import { runRead    } from "./agents/read.js";
import { runDesign  } from "./agents/design.js";
import { runLayout  } from "./agents/layout.js";
import { runSpacing } from "./agents/spacing.js";
import { runBuilder } from "./agents/builder.js";
import { runChecker } from "./agents/checker.js";
import { renderMenu } from "./render.js";

import { zeroUsage, addUsage, calcCost, RATES } from "./providers.js";
import type { Usage } from "./providers.js";
import type { RestaurantBrief } from "./agents/read.js";
import type { DesignSpec }       from "./agents/design.js";
import type { StructureSpec }    from "./agents/layout.js";
import type { SpacingSpec }      from "./agents/spacing.js";
import type { CheckerFinding }   from "./agents/checker.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR   = join(__dirname, "../out");
const MAX_ITER  = 4;  // hard cap enforced in code

interface Project {
  restaurantName: string;
  location:       string;
  brief?:         RestaurantBrief;
  designSpec?:    DesignSpec;
  structureSpec?: StructureSpec;
  spacingSpec?:   SpacingSpec;
  html?:          string;
  render?:        { pngPath: string; overflowPx: number; fits: boolean };
  checkerFindings: CheckerFinding[];
  iteration:      number;
}

interface IterRecord {
  iteration:      number;
  brief?:         RestaurantBrief;
  designSpec?:    DesignSpec;
  structureSpec?: StructureSpec;
  spacingSpec?:   SpacingSpec;
  overflowPx?:    number;
  fits?:          boolean;
  checkerVerdict?: "SHIP" | "REVISE";
  findings?:      CheckerFinding[];
}

// ---- Usage totals per provider ----
const usageTotals: Record<string, Usage> = {
  gemini:    zeroUsage(),
  anthropic: zeroUsage(),
  deepseek:  zeroUsage(),
  openai:    zeroUsage(),
};

function track(provider: string, u: Usage) {
  if (!usageTotals[provider]) usageTotals[provider] = zeroUsage();
  usageTotals[provider] = addUsage(usageTotals[provider], u);
}

function estimateTotalCost(): number {
  return (
    calcCost("gemini",    usageTotals.gemini)    +
    calcCost("anthropic", usageTotals.anthropic) +
    calcCost("deepseek",  usageTotals.deepseek)  +
    calcCost("openai",    usageTotals.openai)
  );
}

async function main() {
  await mkdir(OUT_DIR,              { recursive: true });
  await mkdir(join(__dirname, "../cache"), { recursive: true });

  const project: Project = {
    restaurantName:  theSmith.name,
    location:        theSmith.location,
    checkerFindings: [],
    iteration:       0,
  };

  const iterRecords: IterRecord[] = [];

  console.log("=== TASTE ENGINE PIPELINE START ===");
  console.log(`Restaurant: ${project.restaurantName}, ${project.location}`);

  // ---- Phase 1: READ (once, cached) ----
  const readResult = await runRead(project.restaurantName, project.location);
  project.brief = readResult.brief;
  track("gemini", readResult.usage);
  console.log("[READ] Brief:", JSON.stringify(project.brief, null, 2));

  // ---- Phase 2: DESIGN (once) ----
  const designResult = await runDesign(project.brief);
  project.designSpec = designResult.designSpec;
  track("anthropic", designResult.usage);
  console.log("[DESIGN] Spec:", JSON.stringify(project.designSpec, null, 2));

  // ---- Phase 3: LAYOUT (once) ----
  const layoutResult = await runLayout(theSmith, project.designSpec);
  project.structureSpec = layoutResult.structureSpec;
  track("deepseek", layoutResult.usage);
  console.log("[LAYOUT] Spec:", JSON.stringify(project.structureSpec, null, 2));

  // ---- Phase 4: SPACING (once) ----
  const spacingResult = await runSpacing(theSmith, project.designSpec, project.structureSpec);
  project.spacingSpec = spacingResult.spacingSpec;
  track("deepseek", spacingResult.usage);
  console.log("[SPACING] Spec:", JSON.stringify(project.spacingSpec, null, 2));

  // ---- Iteration loop: BUILD → render → CHECK ----
  let finalVerdict: "SHIP" | "REVISE" = "REVISE";

  for (let iter = 1; iter <= MAX_ITER; iter++) {
    project.iteration = iter;
    console.log(`\n=== ITERATION ${iter}/${MAX_ITER} ===`);

    // On revise iterations, only pass findings relevant to owners that need to re-run.
    // For this skeleton the builder always re-runs; design/layout/spacing are stable.
    // (A full impl would selectively re-run owner agents — future work.)
    const findingsForBuilder = iter === 1 ? [] : project.checkerFindings;

    // BUILDER
    const builderResult = await runBuilder(
      theSmith,
      project.brief!,
      project.designSpec!,
      project.structureSpec!,
      project.spacingSpec!,
      findingsForBuilder,
      iter,
    );
    project.html = builderResult.html;
    track("anthropic", builderResult.usage);

    // Render
    const pngPath = join(OUT_DIR, `the-smith-iter${iter}.png`);
    const renderResult = await renderMenu(project.html, pngPath);
    project.render = renderResult;

    // CHECKER
    const checkerResult = await runChecker(
      renderResult.pngPath,
      renderResult.overflowPx,
      renderResult.fits,
      project.designSpec!,
      project.structureSpec!,
      project.spacingSpec!,
      iter,
    );
    track("openai", checkerResult.usage);

    project.checkerFindings = checkerResult.findings;
    finalVerdict = checkerResult.verdict;

    iterRecords.push({
      iteration:      iter,
      brief:          project.brief,
      designSpec:     project.designSpec,
      structureSpec:  project.structureSpec,
      spacingSpec:    project.spacingSpec,
      overflowPx:     renderResult.overflowPx,
      fits:           renderResult.fits,
      checkerVerdict: checkerResult.verdict,
      findings:       checkerResult.findings,
    });

    console.log(`[CHECKER] Verdict: ${checkerResult.verdict}`);
    if (checkerResult.findings.length) {
      console.log("[CHECKER] Findings:");
      checkerResult.findings.forEach(f => console.log(`  [${f.severity}] ${f.issue} — owner: ${f.owner}`));
    }

    if (checkerResult.verdict === "SHIP") {
      console.log(`\n✓ SHIP verdict reached at iteration ${iter}`);
      break;
    }

    if (iter === MAX_ITER) {
      console.log(`\n⚠ Hit iteration cap (${MAX_ITER}). Final verdict: ${finalVerdict}`);
    }
  }

  // ---- Save run report ----
  const totalCostUsd = estimateTotalCost();
  const report = {
    restaurantName: project.restaurantName,
    location:       project.location,
    finalVerdict,
    totalIterations: project.iteration,
    finalPng:       project.render?.pngPath ?? null,
    finalFits:      project.render?.fits ?? null,
    finalOverflowPx: project.render?.overflowPx ?? null,
    usageTotals,
    estimatedCostUsd: totalCostUsd,
    iterations:     iterRecords,
  };

  const reportPath = join(OUT_DIR, "run-report.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n=== RUN COMPLETE ===`);
  console.log(`Final verdict:    ${finalVerdict}`);
  console.log(`Iterations:       ${project.iteration}`);
  console.log(`Fits letter sheet: ${project.render?.fits}`);
  console.log(`Overflow px:      ${project.render?.overflowPx}`);
  console.log(`Final PNG:        ${project.render?.pngPath}`);
  console.log(`Report:           ${reportPath}`);
  console.log(`Est. cost:        $${totalCostUsd.toFixed(4)}`);
}

main().catch(e => {
  console.error("Pipeline failed:", e);
  process.exit(1);
});
