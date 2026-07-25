#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = "public/open-image-template.schema.json";
const versionSourcePath = "src/lib/templates.ts";
const changelogPath = "docs/schema-changelog.md";

function readProjectFile(filePath) {
  return readFileSync(path.join(projectRoot, filePath), "utf8");
}

function versionFromSource(source, label) {
  const match = source.match(/TEMPLATE_SCHEMA_VERSION\s*=\s*"(\d+\.\d+\.\d+)"/);
  if (!match) {
    throw new Error(`Could not find TEMPLATE_SCHEMA_VERSION in ${label}.`);
  }
  return match[1];
}

function parseVersion(version, label) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`${label} must be a three-part Semantic Version, received "${version}".`);
  }
  return match.slice(1).map(Number);
}

function isGreaterVersion(candidate, base) {
  const candidateParts = parseVersion(candidate, "Current schema version");
  const baseParts = parseVersion(base, "Base schema version");

  for (let index = 0; index < candidateParts.length; index += 1) {
    if (candidateParts[index] !== baseParts[index]) {
      return candidateParts[index] > baseParts[index];
    }
  }
  return false;
}

function gitShow(ref, filePath) {
  return execFileSync("git", ["show", `${ref}:${filePath}`], {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function requestedBaseRef() {
  const baseArgumentIndex = process.argv.indexOf("--base");
  if (baseArgumentIndex !== -1) {
    const value = process.argv[baseArgumentIndex + 1];
    if (!value) throw new Error("--base requires a Git revision.");
    return value;
  }
  return process.env.SCHEMA_BASE_REF || "HEAD";
}

try {
  const currentSchemaSource = readProjectFile(schemaPath);
  const currentSchema = JSON.parse(currentSchemaSource);
  const currentVersion = versionFromSource(readProjectFile(versionSourcePath), versionSourcePath);
  const advertisedVersion = currentSchema["x-schema-version"];
  const changelog = readProjectFile(changelogPath);
  const changelogHeading = new RegExp(
    `^## \\[${currentVersion.replaceAll(".", "\\.")}\\] - \\d{4}-\\d{2}-\\d{2}$`,
    "m",
  );

  parseVersion(currentVersion, "Current schema version");

  if (advertisedVersion !== currentVersion) {
    throw new Error(
      `${schemaPath} advertises version "${advertisedVersion ?? "missing"}", but ${versionSourcePath} uses "${currentVersion}".`,
    );
  }

  if (!changelogHeading.test(changelog)) {
    throw new Error(`${changelogPath} needs a dated "## [${currentVersion}] - YYYY-MM-DD" entry.`);
  }

  const baseRef = requestedBaseRef();
  let baseSchemaSource;
  let baseVersionSource;

  try {
    baseSchemaSource = gitShow(baseRef, schemaPath);
    baseVersionSource = gitShow(baseRef, versionSourcePath);
  } catch {
    throw new Error(`Could not read schema files from Git base revision "${baseRef}".`);
  }

  if (baseSchemaSource !== currentSchemaSource) {
    const baseVersion = versionFromSource(baseVersionSource, `${baseRef}:${versionSourcePath}`);
    if (!isGreaterVersion(currentVersion, baseVersion)) {
      throw new Error(
        `${schemaPath} changed relative to ${baseRef}, but the schema version did not increase (${baseVersion} → ${currentVersion}).`,
      );
    }
  }

  console.log(`Schema version check passed (${currentVersion}, base ${baseRef}).`);
} catch (error) {
  console.error(`Schema version check failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
