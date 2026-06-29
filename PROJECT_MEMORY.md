# Menu-Editor — Project Memory / Handoff

## LATEST STATE (2026-06-29)

**What this project is now:** a menu-design business evolving toward a product. Walker
(restaurant GM at Pelican Club, builds at AI speed; constraints: ~$0 budget, very little
time, low-social/async-only, wants out of restaurants) redesigns restaurants' menus and
pairs them with a self-serve editor whose layout self-corrects as the owner edits ("edits
stay beautiful").

**This session built the TASTE-ENGINE** — an automated, **no-template**, multi-agent menu
*design* pipeline at `~/menu-editor/taste-engine/` (branch `taste-engine-phase0`). It turns
a restaurant name + its raw menu content into a finished, rendered menu with **zero human
design touch**. First cold test (The Smith, NYC) ran clean end-to-end. **The bet — "can
software hold Walker's taste" — looks alive.**

---

### Taste-engine architecture (BUILT, runs)
Orchestrated chain, NO template (design derived per-restaurant from a brief + content):
`READ → DESIGN → LAYOUT → SPACING → BUILDER → render+measure → CHECKER → (loop)`

- **READ** — Gemini `gemini-3-flash-preview` grounded **web search** (`tools:[{type:"google_search"}]`
  via `@google/genai` interactions) → identity brief {style, tier, clientele, neighborhood,
  mood, formality, brand/color cues}. Cached to file (don't re-fire grounding on reruns).
- **DESIGN** — Anthropic `claude-opus-4-8` → aesthetic spec {palette, type, style, ornament}.
  [TODO: enable adaptive thinking — skipped for the first run.]
- **LAYOUT** — DeepSeek `deepseek-chat` → structure {columns, sectionOrder, grouping, pagePlan}.
  May reference the current menu's structure but must judge it.
- **SPACING** — DeepSeek → spacing **intent, no numbers** (density / whitespace / leading feel;
  "no giant empty space unless planned").
- **BUILDER** — Anthropic `claude-sonnet-4-6` (no thinking, maxTokens 8000) → print-ready
  semantic HTML/CSS, US-letter.
- **render+measure** — puppeteer renders at 816×1056px, measures overflow = the deterministic
  **fit number**. (Spacing is handled at prompt time, not with hardcoded floors — Walker's call;
  the measure is the instrument that would trigger a pivot to a deterministic fit-solver if it
  ever spills.)
- **CHECKER** — OpenAI `gpt-5.4` **vision** (sees the rendered PNG) → adversarial critique vs
  spec + a send-worthy bar → `{verdict: SHIP|REVISE, findings:[{issue, location, severity,
  owner, rootCause}]}`.
- **ORCHESTRATOR** — routes findings, re-builds/re-renders/re-checks; **HARD CAP 4 iterations,
  in code** (the only thing that stops the adversary looping forever).

Model-tiering logic: spend on the judgment seats (Opus designer, vision checker), cheap on the
mechanical ones (DeepSeek layout/spacing), Gemini for grounding-native read, Sonnet for clean
HTML. **~$0.56 / full run.** Prompts are Walker's refined versions, verbatim, in each
`src/agents/*.ts` — Walker drives prompt-tuning.

### First cold test — The Smith (NYC), hand-keyed dinner menu
- Ran end-to-end clean. **Fit held: 0px overflow all 4 rounds.** $0.56. **Verdict REVISE**
  (hit the 4-cap, no SHIP).
- Output: genuinely promising — clean two-column brasserie menu, on-brand palette, dotted
  leaders to prices, all 10 sections + footer; **beats the iMenuPro version**. NOT send-worthy yet.
- **Bugs:** (1) name garbled in the headline → "THE SMITH & BAR" (should be "The Smith /
  Restaurant & Bar"); (2) "EST. 2005" likely **confabulated** by the read (~2007 actual) —
  read facts need verification (thin-signal hallucination risk we flagged); (3) Vegetables
  column-placement nit the checker fixated on.
- **Why the loop didn't converge (= the #1 fix):** the orchestrator only re-runs the BUILDER
  even when the checker blames `layout`/`spacing` → the layout spec never changes → the same
  finding recurs every round.

### NEXT STEPS (priority order)
1. **Orchestrator owner-routing** — when a checker finding's `owner` is layout/spacing, re-run
   THAT agent (with the finding), then rebuild. This is what makes the loop converge. (Scoped;
   builder flagged it.)
2. **Fix the name-misread** — read/design handling of "Name — descriptor" (don't fold the
   descriptor into the name).
3. **Ground the read's facts** — confabulation guard (the est-date).
4. **Tune the agent prompts** (Walker's job).
5. **THE MOAT TEST (brief-quality A/B):** run The Smith with Walker's *expert* brief vs a *thin
   generic* brief — same content/pipeline. The quality gap = the moat. Small gap → the read is
   automatable, it scales (a product). Big gap → Walker's eye IS the product (a faster service,
   not a product). This single experiment decides product-vs-service.
6. **Deferred (later):** auto-fill/auto-format **editor integration** (feed the generated menu
   INTO the existing self-correcting editor so it's editable + reflows — the "edits stay
   beautiful" product feature); the validate-back-half (fact-check finalists); **ingestion**
   (vision: PDF/photo → data model — currently hand-keyed); multiple encoded looks across
   restaurant tiers.

### Strategy (GTM) — decided this session
- **Near-term = a small, local, high-touch craft business**, NOT a scalable funnel yet.
  Free/cheap redesigns build a portfolio + proof; **paid redesigns are the business, priced
  like skilled work ($300–500, market-rate — not $50)**; the editor is a cheap one-time
  *foothold* that keeps Walker embedded so **repeat redesigns** (the recurring revenue) flow
  back to him.
- **Channel:** Instagram DM → **chef-owned / independent fine dining, local (NOLA)** → finished
  free menu attached + "I'm the GM at Pelican Club" operator-peer credential. Async, $0, fits
  his constraints. It does NOT scale nationally without losing the warm edge — that's the honest
  ceiling.
- **Kill-gate (set it):** before scaling free work, get **ONE non-friend to pay full price**
  through an async channel he'll actually run. **Usage ≠ willingness-to-pay.** Giveaways build
  the delivery/portfolio muscle, NOT the closing muscle (his weak one) — that only grows by
  invoicing.
- **Product vs craft:** it becomes a real *product* only if the taste-engine produces
  send-worthy menus with no hand-touch (item 5 is the test). Walker's key insight: **his taste
  = the restaurant's taste** (no house style — fidelity to each place; that's why his menus
  share no DNA). The "read" is automatable (grounded search + logo/menu color/style), so the
  moat relocates from "Walker's eye" to the **execution pipeline** — ownable, and it compounds.
- Adversary verdicts (run twice, with corrections): **taproom rotating-beer-list idea = KILL**
  (wrong medium — high churn favors *digital* boards, not print; saturated by Untappd's
  network moat). **Research-layer for the dual-chat idea machine = KILL** (idea quality wasn't
  the bottleneck; distribution is).

### Existing menu-editor assets (don't lose / will integrate)
- The self-correcting **editor** (`builds/olive-branch` Vite+React single-file; `pelican-club`
  Next.js) — drag/reorder + add/remove + the reflow that keeps the design as content changes.
  See `PLAYBOOK.md`, and auto-memory `spacing-model.md` / `pdf-export-method.md`.
- `package-single.cjs` (single-file packaging), `server/` (backup server). The taste-engine is
  the auto-DESIGN front-end that will eventually FEED INTO this editor.
- Convention note: the repo normally commits straight to `main` (auto-memory
  `commits-direct-to-main`); the taste-engine sits on its own branch `taste-engine-phase0`
  **deliberately** (experimental, may be reworked) — merge to main when it's proven.

### Setup / run
`~/menu-editor/taste-engine/.env` has all 4 keys (ANTHROPIC / OPENAI / DEEPSEEK /
GOOGLE_GENERATIVE_AI). Deps installed. Run: `npx tsx <entry>` from `taste-engine/`; output
(regenerated, gitignored) lands in `taste-engine/out/`.

### Tangential (different project): dual-chat IdeateView
This session *started* by building a frontend (`IdeateView.tsx`) for the dual-chat board's
`/api/ideate` "idea machine" — that's the **recon/dual-chat** project (`~/recon/dual-chat`,
branch `idea-machine`), not menu-editor. Its planned research-layer was **killed** (idea
quality isn't Walker's bottleneck). Committed there separately; not part of menu-editor.
