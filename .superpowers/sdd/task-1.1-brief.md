# Task 1.1 — Initialize SvelteKit + TypeScript project (Brief)

> **Source of truth:** plan lines 102–354 of
> `C:\Users\AM\Documents\Workspace\DHC\immo\docs\superpowers\plans\2026-06-24-sergine-hougoue-immo.md`.
> Follow steps in order. Do not skip. Do not add steps. All file contents are verbatim from the plan.

## Where this fits

Task 1.1 is the very first task of Phase 1 (Foundation) of the Sergine Hougoue
bilingual real-estate web app (SvelteKit 2 + Svelte 5 + TS + Tailwind + Sanity).
It produces a runnable dev server on `localhost:5173`. Followed by Task 1.2
(Tailwind), Task 1.3 (Vitest+Playwright), ... Task 1.12 (Privacy page).

## Current state

- Working dir: `C:\Users\AM\Documents\Workspace\DHC\immo`
- Branch: `feat/phase-1-foundation` (just created from `master`)
- HEAD: `17d7802 Chore: Init` (only commit)
- Tracked files: `.claude/settings.local.json`, `DESIGN.md`, `Utilities to Brainstorm/...`, `docs/superpowers/{plans,specs}/...`
- Untracked scratch (leave alone): `.run.cmd`, `.superpowers/`, various `*.cmd` files in root.
- **No** `src/`, **no** `package.json`, **no** `node_modules`, **no** committed `.gitignore`.

## CRITICAL: shell workaround

This environment's `run_commands` cannot pass arguments to spawned processes
(uv_spawn bug: the whole command string is treated as the executable path).
You MUST run any command that takes args (git, npm, node, etc.) by writing
a `.cmd` batch file and invoking it like:

    run_commands([{ command: "C:\\Users\\AM\\Documents\\Workspace\\DHC\\immo\\task-1.1-step3-install.cmd" }])

Each `.cmd` must:

1. `setlocal`
2. `call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1`
3. `set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"`
4. `cd /d "C:\Users\AM\Documents\Workspace\DHC\immo"`
5. Run the commands
6. `endlocal`

`.run.cmd` is a pre-existing diagnostic shim. For long-running commands
(`npm install`, `npm run dev`), redirect output to a log file
(`>install.log 2>&1`) and `read_files` the log.

## Steps (verbatim from plan, lines 102–354)

1. **Create `.gitignore`** (plan lines 113–128) — overwrite the existing
   untracked `.gitignore` with the exact plan content (12 lines, no extras).
2. **Create `package.json`** (plan lines 132–168) — exact JSON. Note `name`,
   `private`, `type:module`, scripts, and the 14 devDependencies.
3. **Install deps** (plan line 173) — `npm install`. Slow (1–3 min).
   Run via `.cmd` with output to log. Must succeed with exit 0.
4. **Create `svelte.config.js`** (plan lines 178–200) — adapter-vercel + aliases.
5. **Create `vite.config.ts`** (plan lines 204–217) — port 5173.
6. **Create `tsconfig.json`** (plan lines 222–238) — extends `.svelte-kit/tsconfig.json`.
7. **Create `src/app.html`** (plan lines 244–263) — includes Fraunces/Inter fonts.
8. **Create `src/app.d.ts`** (plan lines 269–285) — declares `Locale` + `App` namespace.
9. **Create `src/routes/+layout.svelte`** and `src/routes/+page.svelte` (plan lines 289–300).
10. **Create `README.md`** (plan lines 306–334).
11. **Run dev server** (plan line 338) — `npm run dev`. Confirm "Local: http://localhost:5173"
    banner appears. Then KILL THE DEV SERVER (e.g. `taskkill /F /IM node.exe /T`).
12. **Run `npm run check`** (plan line 343) — expect `0 errors, 0 warnings`.
13. **Commit** (plan lines 348–353) — message: `chore: scaffold SvelteKit + TypeScript project`.

## TDD note

Task 1.1 is project scaffolding — there are no features to test-drive. The
plan deliberately omits a failing-test step here. The test framework is
installed in Task 1.3; the first actual TDD cycle is Task 1.4 (i18n module).

## Self-review before reporting DONE

1. All 13 steps completed with the listed files existing at the right paths.
2. `npm install` succeeded; `node_modules/` and `package-lock.json` present.
3. Dev server started; ready banner seen; dev server killed.
4. `npm run check` returned `0 errors, 0 warnings`.
5. `git log --oneline -3` shows the new commit on top of `17d7802`.
6. Commit message is exactly `chore: scaffold SvelteKit + TypeScript project`.
7. No accidental changes to `DESIGN.md`, `docs/`, `Utilities to Brainstorm/`, `.claude/`.
8. `.gitignore` content matches the plan exactly (not the older SDD-scratch content).

## Report (write to `.superpowers/sdd/task-1.1-report.md`)

- Status: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED
- For each step: which `.cmd` file ran it + a one-line outcome
- `npm install` log tail (last 5 lines)
- Dev server ready banner confirmation
- `npm run check` output (last 5 lines)
- Final commit short SHA + message
- Concerns (if any)

Keep report ≤ 50 lines.

## Return message (short)

Return ONLY:

- Status
- New commit short SHA
- One-line test summary (e.g. "npm run check → 0 errors, 0 warnings")
- Concerns if any

## Reference

- Plan (this task in full): `C:\Users\AM\Documents\Workspace\DHC\immo\docs\superpowers\plans\2026-06-24-sergine-hougoue-immo.md` lines 102–354
- Spec (don't edit): `docs/superpowers/specs/2026-06-24-sergine-hougoue-immo-design.md`
- Progress ledger (don't edit): `.superpowers/sdd/progress.md`
