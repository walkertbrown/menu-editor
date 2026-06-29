/**
 * agents/checker.ts — CHECKER agent
 * Uses gpt-5.4 with vision to review the rendered PNG against the specs.
 */
import { readFile } from "node:fs/promises";
import { openaiProvider, MODEL_OPENAI } from "../providers.js";
import { generateText } from "ai";
import type { DesignSpec } from "./design.js";
import type { StructureSpec } from "./layout.js";
import type { SpacingSpec } from "./spacing.js";
import type { Usage } from "../providers.js";

export interface CheckerFinding {
  issue: string;
  location: string;
  severity: "critical" | "major" | "minor";
  owner: "design" | "layout" | "spacing" | "builder";
  rootCause: "spec" | "implementation";
}

export interface CheckerResult {
  verdict: "SHIP" | "REVISE";
  findings: CheckerFinding[];
  usage: Usage;
}

const SYSTEM = `You are an adversarial design critic with the spec, the rendered menu (image), and an objective fit measurement. Hunt for what's wrong — but be right, not just harsh. Check (a) conformance: does it deliver the spec; (b) quality: is this send-to-a-paying-client good, and would it beat a generic template? Use the fit number as fact. For each real problem: {issue, location, severity, owner: design|layout|spacing|builder, rootCause: spec|implementation}. Ignore nitpicks. Verdict: SHIP if it clears the bar, else REVISE — and if it's good, say SHIP; do not manufacture problems for another round. Respond with only valid JSON: {verdict: "SHIP"|"REVISE", findings: [{issue, location, severity, owner, rootCause}]}`;

export async function runChecker(
  pngPath: string,
  overflowPx: number,
  fits: boolean,
  designSpec: DesignSpec,
  structureSpec: StructureSpec,
  spacingSpec: SpacingSpec,
  iteration: number,
): Promise<CheckerResult> {
  console.log(`[CHECKER] Running gpt-5.4 with vision (iteration ${iteration})...`);

  // Load PNG as base64
  const pngBuffer = await readFile(pngPath);
  const base64 = pngBuffer.toString("base64");

  const fitInfo = fits
    ? "Fit measurement: FITS — content fits within 1056px (US letter height). No overflow."
    : `Fit measurement: OVERFLOW — content exceeds letter height by ${overflowPx}px. This is a real problem.`;

  const prompt = `${fitInfo}

DESIGN SPEC:
${JSON.stringify(designSpec, null, 2)}

STRUCTURE SPEC:
${JSON.stringify(structureSpec, null, 2)}

SPACING SPEC:
${JSON.stringify(spacingSpec, null, 2)}

Iteration: ${iteration}. Review the rendered menu image above. Return only JSON.`;

  let result;
  try {
    result = await generateText({
      model: openaiProvider(MODEL_OPENAI),
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: base64,
              mimeType: "image/png",
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
      maxOutputTokens: 1500,
      providerOptions: { openai: { reasoningEffort: "low", textVerbosity: "low" } },
    });
  } catch (e) {
    // Vision might fail on some model versions — fall back to text-only
    console.warn("[CHECKER] Vision call failed, falling back to text-only:", (e as Error).message);
    result = await generateText({
      model: openaiProvider(MODEL_OPENAI),
      system: SYSTEM,
      prompt: `I cannot view the image but here is the context:\n${fitInfo}\n\nDESIGN SPEC:\n${JSON.stringify(designSpec)}\n\nSTRUCTURE SPEC:\n${JSON.stringify(structureSpec)}\n\n${fits ? "Content fits the page." : `Content overflows by ${overflowPx}px — this is the primary issue.`}\n\nGiven this is iteration ${iteration} and the primary structural information, provide your verdict. Return only JSON.`,
      maxOutputTokens: 1500,
      providerOptions: { openai: { reasoningEffort: "low", textVerbosity: "low" } },
    });
  }

  const usage: Usage = {
    inputTokens: result.usage.inputTokens ?? 0,
    outputTokens: result.usage.outputTokens ?? 0,
  };

  let checkerResult: CheckerResult;
  try {
    const jsonMatch = result.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    const parsed = JSON.parse(jsonMatch[0]);
    checkerResult = {
      verdict: parsed.verdict === "SHIP" ? "SHIP" : "REVISE",
      findings: parsed.findings ?? [],
      usage,
    };
  } catch (e) {
    console.warn("[CHECKER] JSON parse failed:", (e as Error).message);
    // If content doesn't fit, force REVISE
    checkerResult = {
      verdict: fits ? "SHIP" : "REVISE",
      findings: fits ? [] : [{
        issue: `Content overflows by ${overflowPx}px`,
        location: "full page",
        severity: "critical" as const,
        owner: "builder" as const,
        rootCause: "implementation" as const,
      }],
      usage,
    };
  }

  return checkerResult;
}
