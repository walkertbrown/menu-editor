/**
 * providers.ts — shared AI provider clients
 * Mirror of dual-chat/server/routes/ideate.ts provider setup.
 *
 * Key loading strategy: local .env first, fallback to ~/recon/.env for any
 * key that's short/placeholder (< 10 chars). The taste-engine .env has
 * placeholders for DeepSeek and OpenAI; real keys are in ~/recon/.env.
 */
import { parse as dotenvParse } from "dotenv";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { GoogleGenAI } from "@google/genai";
import { generateText } from "ai";

// ---- Env loading ----
const __dir = dirname(fileURLToPath(import.meta.url));

function parseEnvFile(path: string): Record<string, string> {
  try { return dotenvParse(readFileSync(path, "utf8")); }
  catch { return {}; }
}

(function loadKeys() {
  const localEnv    = parseEnvFile(join(__dir, "../.env"));
  const fallbackEnv = parseEnvFile(join(homedir(), "recon/.env"));
  const API_KEYS = ["ANTHROPIC_API_KEY","OPENAI_API_KEY","DEEPSEEK_API_KEY",
                    "GOOGLE_GENERATIVE_AI_API_KEY","GEMINI_API_KEY"] as const;
  for (const key of API_KEYS) {
    const current  = process.env[key] ?? "";
    const local    = localEnv[key]    ?? "";
    const fallback = fallbackEnv[key] ?? "";
    // Pick the longest value: real keys beat short placeholders
    const candidates = [current, local, fallback].filter(Boolean);
    const best = candidates.sort((a, b) => b.length - a.length)[0] ?? "";
    if (best) process.env[key] = best;
  }
  // Also use GEMINI_API_KEY if GOOGLE key is a placeholder
  if ((process.env.GOOGLE_GENERATIVE_AI_API_KEY?.length ?? 0) < 10) {
    const gem = process.env.GEMINI_API_KEY ?? "";
    if (gem.length > 10) process.env.GOOGLE_GENERATIVE_AI_API_KEY = gem;
  }
})();

// ---- Provider clients ----
export const deepseekProvider  = createDeepSeek({ apiKey: process.env.DEEPSEEK_API_KEY });
export const openaiProvider    = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const anthropicProvider = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
// Prefer GEMINI_API_KEY for the grounded search interactions endpoint
export const genai             = new GoogleGenAI({
  apiKey: (process.env.GEMINI_API_KEY?.length ?? 0) > 10
    ? process.env.GEMINI_API_KEY
    : process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// ---- Model IDs ----
export const MODEL_DEEPSEEK  = "deepseek-chat";
export const MODEL_GEMINI    = "gemini-3-flash-preview";
export const MODEL_OPENAI    = "gpt-5.4";
export const MODEL_OPUS      = "claude-opus-4-8";
export const MODEL_SONNET    = "claude-sonnet-4-6";

// ---- Usage tracking ----
export interface Usage { inputTokens: number; outputTokens: number }
export const zeroUsage = (): Usage => ({ inputTokens: 0, outputTokens: 0 });
export const addUsage  = (a: Usage, b: Usage): Usage => ({
  inputTokens:  a.inputTokens  + b.inputTokens,
  outputTokens: a.outputTokens + b.outputTokens,
});

// ---- Cost rates ($/token) ----
export const RATES = {
  deepseek:  { input: 0.14  / 1e6, output: 0.28  / 1e6 },
  gemini:    { input: 0.15  / 1e6, output: 0.60  / 1e6 },
  openai:    { input: 2.50  / 1e6, output: 15.00 / 1e6 },
  anthropic: { input: 3.00  / 1e6, output: 15.00 / 1e6 },
} as const;
export type ProviderKey = keyof typeof RATES;
export const calcCost = (p: ProviderKey, u: Usage) =>
  u.inputTokens * RATES[p].input + u.outputTokens * RATES[p].output;

// ---- Generator helpers ----

export async function genDeepSeek(system: string, prompt: string, max = 1500) {
  const r = await generateText({
    model: deepseekProvider(MODEL_DEEPSEEK),
    system,
    prompt,
    maxOutputTokens: max,
    temperature: 0.7,
  });
  return { text: r.text, usage: { inputTokens: r.usage.inputTokens ?? 0, outputTokens: r.usage.outputTokens ?? 0 } };
}

export async function genOpenAI(system: string, prompt: string, max = 2000) {
  const r = await generateText({
    model: openaiProvider(MODEL_OPENAI),
    system,
    prompt,
    maxOutputTokens: max,
    providerOptions: { openai: { reasoningEffort: "low", textVerbosity: "low" } },
  });
  return { text: r.text, usage: { inputTokens: r.usage.inputTokens ?? 0, outputTokens: r.usage.outputTokens ?? 0 } };
}

export async function genAnthropic(model: string, system: string, prompt: string, max = 4000) {
  const r = await generateText({
    model: anthropicProvider(model),
    system,
    prompt,
    maxOutputTokens: max,
  });
  return { text: r.text, usage: { inputTokens: r.usage.inputTokens ?? 0, outputTokens: r.usage.outputTokens ?? 0 } };
}

export async function genGemini(system: string, prompt: string, max = 1200): Promise<{ text: string; usage: Usage }> {
  const interaction = await (genai as any).interactions.create({
    model: MODEL_GEMINI,
    input: [{ type: "user_input", content: [{ type: "text", text: system + "\n\n" + prompt }] }],
    stream: false,
    generation_config: { max_output_tokens: max },
  });

  let text = (interaction as any).output_text ?? "";
  if (!text) {
    const steps = (interaction as any).steps ?? [];
    for (const step of steps) {
      const s = step as any;
      if (s.type === "model_output") {
        for (const part of s.content ?? []) {
          const p = part as any;
          if (p.type === "text" && p.text) text += p.text;
        }
      }
    }
  }
  const u = (interaction as any).usage;
  return {
    text,
    usage: {
      inputTokens:  u?.total_input_tokens  ?? 0,
      outputTokens: (u?.total_output_tokens ?? 0) + (u?.total_thought_tokens ?? 0),
    },
  };
}

export async function genGeminiGrounded(
  system: string, prompt: string, max = 1200
): Promise<{ text: string; usage: Usage; sources?: { url: string; title: string }[] }> {
  try {
    const interaction = await (genai as any).interactions.create({
      model: MODEL_GEMINI,
      input: [{ type: "user_input", content: [{ type: "text", text: system + "\n\n" + prompt }] }],
      stream: false,
      tools: [{ type: "google_search" }],
      generation_config: { max_output_tokens: max },
    });

    let text = (interaction as any).output_text ?? "";
    const sources: { url: string; title: string }[] = [];

    if (!text) {
      const steps = (interaction as any).steps ?? [];
      for (const step of steps) {
        const s = step as any;
        if (s.type === "model_output") {
          for (const part of s.content ?? []) {
            const p = part as any;
            if (p.type === "text" && p.text) text += p.text;
            for (const ann of p.annotations ?? []) {
              if (ann.type === "url_citation") sources.push({ url: ann.url ?? "", title: ann.title ?? "" });
            }
          }
        }
      }
    }

    const u = (interaction as any).usage;
    return {
      text,
      usage: {
        inputTokens:  u?.total_input_tokens  ?? 0,
        outputTokens: (u?.total_output_tokens ?? 0) + (u?.total_thought_tokens ?? 0),
      },
      sources,
    };
  } catch (e) {
    console.warn("[READ] Grounded search failed, falling back to standard Gemini:", (e as Error).message);
    const r = await genGemini(system, prompt, max);
    return { ...r, sources: [] };
  }
}
