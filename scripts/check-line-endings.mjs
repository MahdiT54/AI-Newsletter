#!/usr/bin/env node
/**
 * Fails if CRLF (or legacy lone CR) appears in the Git index for text files that should be LF.
 * Uses indexed blobs so Windows working-tree CRLF from core.autocrlf does not false-positive.
 * Skips binary-looking content (NUL), and Windows script extensions checked out as CRLF.
 */

import { execFileSync, execSync } from "node:child_process";

/** @readonly */
const SKIP_EXT = new Set(["bat", "cmd", "ps1"]);

/** @readonly */
const TEXT_EXT = new Set([
  "ts",
  "tsx",
  "mts",
  "cts",
  "js",
  "jsx",
  "mjs",
  "cjs",
  "json",
  "jsonc",
  "md",
  "mdx",
  "css",
  "scss",
  "sass",
  "less",
  "html",
  "htm",
  "svg",
  "xml",
  "txt",
  "yml",
  "yaml",
  "toml",
  "ini",
  "cfg",
  "prisma",
  "sql",
  "sh",
  "bash",
  "zsh",
]);

/**
 * @param {string} fileName
 * @returns {string | null}
 */
function getExtension(fileName) {
  const base = fileName.split("/").pop() ?? fileName;
  if (!base.includes(".")) {
    return null;
  }
  const parts = base.split(".");
  return parts.length >= 2 ? (parts.pop() ?? null) : null;
}

/**
 * @param {string} base
 * @returns {boolean}
 */
function isSpecialTextFile(base) {
  const lower = base.toLowerCase();
  return (
    lower === "dockerfile" ||
    lower.startsWith("dockerfile.") ||
    lower === "makefile" ||
    lower === ".gitattributes" ||
    lower === ".gitignore" ||
    lower === ".editorconfig"
  );
}

/**
 * @param {string} file
 * @returns {Buffer}
 */
function readIndexedBlob(file) {
  return execFileSync("git", ["show", `:${file}`], {
    encoding: "buffer",
    maxBuffer: 100 * 1024 * 1024,
  });
}

function main() {
  execSync("git rev-parse --is-inside-work-tree", { stdio: "pipe" });

  const files = execSync("git ls-files", { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean);

  /** @type {string[]} */
  const violations = [];

  for (const file of files) {
    const base = file.split("/").pop() ?? file;
    const ext = getExtension(file);
    const extLower = ext?.toLowerCase() ?? "";

    if (extLower && SKIP_EXT.has(extLower)) {
      continue;
    }

    const isText =
      (extLower && TEXT_EXT.has(extLower)) || isSpecialTextFile(base);

    if (!isText) {
      continue;
    }

    let buf;
    try {
      buf = readIndexedBlob(file);
    } catch {
      continue;
    }

    if (buf.includes(0)) {
      continue;
    }

    const hasCrlf = buf.includes("\r\n");
    const hasLoneCr = !hasCrlf && buf.includes("\r");

    if (hasCrlf || hasLoneCr) {
      violations.push(file);
    }
  }

  if (violations.length > 0) {
    console.error(
      "Line ending check failed: CRLF or lone CR in indexed text files:",
    );
    for (const f of violations) {
      console.error(`  ${f}`);
    }
    process.exit(1);
  }

  console.log("Line ending check passed.");
}

main();
