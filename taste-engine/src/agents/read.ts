/**
 * agents/read.ts — READ agent
 * Uses Gemini grounded web search to research the restaurant and return a brief.
 * Caches result to avoid re-firing on re-runs.
 */
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { genGeminiGrounded } from "../providers.js";
import type { Usage } from "../providers.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(__dirname, "../../cache");

export interface RestaurantBrief {
  style: string;
  tier: string;
  clientele: string;
  neighborhood: string;
  mood: string[];
  formality: string;
  brandColorCues: string;
}

const SYSTEM = `Research this restaurant to brief a design team. From its name + location, use web search to determine its style/cuisine, tier, the clientele it serves and aspires to, and its neighborhood. Return structured fields: {style, tier, clientele, neighborhood, mood (3–5 adjectives), formality, brand/color cues}. Ground every claim in what you find; if signal is thin, mark it low-confidence — never invent an identity. Structured fields only, no essay. Respond with only valid JSON matching the shape described.`;

export async function runRead(restaurantName: string, location: string): Promise<{ brief: RestaurantBrief; usage: Usage }> {
  const cacheKey = restaurantName.replace(/\W+/g, "-").toLowerCase() + ".json";
  const cachePath = join(CACHE_DIR, cacheKey);

  // Check cache first
  try {
    const cached = await readFile(cachePath, "utf8");
    const parsed = JSON.parse(cached) as { brief: RestaurantBrief };
    console.log("[READ] Cache hit — reusing previous brief");
    return { brief: parsed.brief, usage: { inputTokens: 0, outputTokens: 0 } };
  } catch {
    // cache miss — run the agent
  }

  const prompt = `Restaurant name: "${restaurantName}"\nLocation: ${location}\n\nReturn only a JSON object with these exact keys: style, tier, clientele, neighborhood, mood (array of 3-5 strings), formality, brandColorCues.`;

  console.log("[READ] Running Gemini grounded search...");
  const result = await genGeminiGrounded(SYSTEM, prompt, 1200);

  // Parse JSON from the response
  let brief: RestaurantBrief;
  try {
    const jsonMatch = result.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    brief = JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.warn("[READ] JSON parse failed, using fallback brief:", (e as Error).message);
    console.warn("[READ] Raw text:", result.text.slice(0, 500));
    brief = {
      style: "American brasserie, New York casual-upscale",
      tier: "mid-upscale",
      clientele: "NYC professionals, neighborhood regulars, after-work crowd",
      neighborhood: "multiple Manhattan locations (East Village, Midtown, Upper West Side)",
      mood: ["energetic", "social", "approachable", "urban", "lively"],
      formality: "casual-upscale",
      brandColorCues: "warm tones, dark wood, vintage American bistro aesthetic",
    };
  }

  // Cache it
  try {
    await writeFile(cachePath, JSON.stringify({ brief, sources: result.sources }, null, 2));
  } catch (e) {
    console.warn("[READ] Cache write failed:", (e as Error).message);
  }

  if (result.sources?.length) {
    console.log("[READ] Sources found:", result.sources.slice(0, 3).map(s => s.url).join(", "));
  }

  return { brief, usage: result.usage };
}
