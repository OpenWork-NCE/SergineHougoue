# Phase 1 Fix Report

**Date:** 2026-06-25  
**Base:** e36f72c  
**Commit message:** `fix(phase-1): cleanup agent artifacts, fix locale path wiring, i18n footer hours`

## Fix 1: Remove SDD agent artifacts from git

- `git rm` on 41 tracked artifact files at repo root (`task-*.cmd`, `task-*.log`, `step1-*.cmd`, `install-*.log`, `probe.cmd`, `wait-*.cmd`, `01-branch.cmd`, `restore.cmd`, `status*.cmd`).
- **Kept:** `.run.cmd`, `.superpowers/sdd/scripts/review-package.cmd`, `.superpowers/sdd/scripts/task-brief.cmd`.
- Added `.gitignore` patterns: `task-*.cmd`, `task-*.log`, `step*.cmd`, `install-*.log`, `probe.cmd`, `wait-*.cmd`, `phase1-*.cmd`, `phase1-*.log`, `*.cmd.log`.
- Deleted untracked scratch files: `.step4-dev.log`, `.step4-dev.err`.

## Fix 2: Layout currentPath — real pathname

- Updated `src/routes/+layout.svelte` to import `page` from `$app/state` and pass `page.url.pathname` to `<Nav>`.
- LangToggle on `/fr/politique-confidentialite` now produces EN href `/en/politique-confidentialite` (verified via existing `LangToggle` component tests + layout wiring).

## Fix 3: Footer hours i18n

- Added `footer.hours` to `FooterCopy` / `SiteCopy` in `src/lib/i18n/copy.ts` (FR and EN strings).
- Replaced hardcoded French hours in `Footer.svelte` with `{copy.footer.hours}` and `whitespace-pre-line` (newline-separated, no `{@html}`).

## Fix 4: E2E wrap-up coverage

- Added `tests/e2e/locale-shell.spec.ts`:
  - `/en/` shows English hero title from `getCopy`
  - `/fr/politique-confidentialite` renders FR privacy heading
  - `/en/politique-confidentialite` renders EN privacy heading

## Verification

| Command | Result |
|---------|--------|
| `npm run lint` | PASS |
| `npm run check` | PASS (0 errors, 0 warnings) |
| `npm run test` | PASS (10 files, 41 tests) |
| `npm run test:e2e` | PASS (10 tests, chromium + mobile-chrome) |