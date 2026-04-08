# Developer environment

## Why line endings matter

Git stores snapshots of files. When some machines check out **CRLF** (Windows default in many tools) and others **LF** (macOS/Linux, and most JS tooling), the same logical file can look “changed” on every clone or every save. That produces noisy `git diff`, false merge conflicts, and “warning: LF will be replaced by CRLF” messages.

**This repository’s source of truth for how text is stored and normalized is `.gitattributes` in the root**, not each developer’s global Git settings. After clone, text files should be **LF** in the working tree (except Windows batch/PowerShell scripts, which use CRLF by design).

---

## Recommended Git settings

### macOS / Linux

```bash
git config --global core.autocrlf input
```

This leaves line endings as committed (LF) when checking out and normalizes to LF on commit.

### Windows

**Preferred with this repo:** disable Git’s automatic CRLF conversion so `.gitattributes` controls behavior:

```bash
git config --global core.autocrlf false
```

Then rely on `.gitattributes` + an editor that respects `.editorconfig` (LF for source).

**If you keep `core.autocrlf true` (Git for Windows default):** Git may rewrite line endings on commit/checkout in ways that fight project rules and still produce warnings. Teams standardizing on LF usually set `false` and let `.gitattributes` + EditorConfig handle the rest.

### Optional: show current values

```bash
git config --show-origin --get-all core.autocrlf
git config --show-origin --get-all core.eol
```

---

## One-time re-normalization after adding or changing `.gitattributes`

When `.gitattributes` is introduced or tightened, existing files in the index may need re-normalization so the repository matches the new rules. **Coordinate with the team:** the following can produce a large, mostly mechanical commit.

1. Ensure your working tree is clean or stash changes.
2. Re-stage with normalization:

   ```bash
   git add --renormalize .
   ```

3. Inspect the diff:

   ```bash
   git status
   git diff --cached
   ```

4. Commit when the diff only reflects line-ending / attribute normalization (plus any intentional edits).

On older Git versions without `add --renormalize`, use `git rm -r --cached .` then `git add .` (more disruptive; prefer renormalize on current Git).

---

## Verification

Local checks:

```bash
# Whitespace issues (trailing space, conflict markers); does not catch all CRLF cases
git diff --check

# Indexed text blobs: fails if CRLF/lone CR would be committed (see package.json).
# Uses the Git index so a CRLF working tree on Windows (e.g. with core.autocrlf) does not false-positive when the index is normalized.
pnpm run check:line-endings
```

In CI, the same check runs on push and pull requests.

---

## Optional guardrails

### Pre-commit hook

This repo does not enable a mandatory pre-commit hook by default. If the team wants one, options include:

- **Husky + lint-staged** — run `pnpm run check:line-endings` and `pnpm run lint` before commit.
- **Core Git hook** — `.git/hooks/pre-commit` calling `pnpm run check:line-endings` (each clone must install it, or use a shared hooks path).

### CI

See `.github/workflows/line-endings.yml`: fails the job if CRLF (or old lone CR) appears in tracked text files matched by the check (excluding `.bat`, `.cmd`, `.ps1`).

---

## New repo bootstrap (template)

Copy into new TypeScript / Next.js repos to avoid repeating setup:

1. Add **`.gitattributes`** (same baseline as this repo: `* text=auto eol=lf`, explicit `*.ts` / `*.tsx` / …, `binary` for images/fonts, `eol=crlf` for `*.bat` / `*.cmd` / `*.ps1`).
2. Add **`.editorconfig`** (`charset = utf-8`, `end_of_line = lf`, `insert_final_newline = true`, `indent_style` / `indent_size` aligned with your formatter — here: 2 spaces for TS/JSON/YAML).
3. Add a short **dev doc** (this file or a section in `CONTRIBUTING.md`) describing:
   - `.gitattributes` is canonical
   - `core.autocrlf` recommendations above
   - one-time `git add --renormalize .` when introducing rules
4. Optionally add **`pnpm run check:line-endings`** + CI workflow mirroring `scripts/check-line-endings.mjs` and `.github/workflows/line-endings.yml`.

---

## Editor notes

Use an EditorConfig plugin in VS Code / Cursor / JetBrains so new files get LF and correct indentation automatically. Biome (`pnpm format`) aligns formatting with `.editorconfig` for supported file types.
