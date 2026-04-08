# Contributing

## Line endings and Git

This project is developed on **macOS** and **Windows**. To avoid noisy diffs and spurious “whole file changed” commits from **LF vs CRLF**:

- **Canonical rules** live in the repo root **`.gitattributes`** (and **`.editorconfig`** for editors). They override per-machine defaults.
- Set **`core.autocrlf`** as recommended for your OS (see [Developer setup — Git and line endings](docs/dev-setup.md#recommended-git-settings)).
- After changing line-ending policy, use the **one-time re-normalization** steps in [Developer setup](docs/dev-setup.md#one-time-re-normalization-after-adding-or-changing-gitattributes).

Full details, verification commands, CI behavior, and a **bootstrap template for new repos**: [docs/dev-setup.md](docs/dev-setup.md).
