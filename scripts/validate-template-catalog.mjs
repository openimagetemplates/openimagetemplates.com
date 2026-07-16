import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = resolve(rootDir, "src/data/templates.json");
const assetBaseUrl = "https://assets.openimagetemplates.com/";
const supportedCategories = new Set(["Portrait", "Lifestyle", "Product", "Character", "Cinematic", "Design", "Other"]);
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
const errors = [];
const seenIds = new Set();

if (!Array.isArray(catalog.templates) || catalog.templates.length === 0) {
  errors.push("templates must be a non-empty array");
}

if (catalog.source !== "openimagetemplates.com canonical catalogue") {
  errors.push("catalog source must identify Open Image Templates as canonical");
}

for (const [index, template] of (catalog.templates ?? []).entries()) {
  const location = `templates[${index}]`;

  for (const field of ["id", "title", "description", "category", "image", "imageAlt", "simplePrompt", "prompt", "demoPrompt", "contentTier", "suggestedModel", "generatedAt", "exampleSchemaVersion", "creator", "license"]) {
    if (typeof template[field] !== "string" || template[field].trim() === "") {
      errors.push(`${location}.${field} must be a non-empty string`);
    }
  }

  if (!supportedCategories.has(template.category)) {
    errors.push(`${location}.category is unsupported`);
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(template.id ?? "")) {
    errors.push(`${location}.id must be a URL-safe slug`);
  } else if (seenIds.has(template.id)) {
    errors.push(`${location}.id duplicates ${template.id}`);
  } else {
    seenIds.add(template.id);
  }

  if (!template.image?.startsWith(assetBaseUrl)) {
    errors.push(`${location}.image must use ${assetBaseUrl}`);
  }

  if (typeof template.image === "string" && template.image.includes("nano-gpt.com")) {
    errors.push(`${location}.image must not be hosted by NanoGPT`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(template.generatedAt ?? "")) {
    errors.push(`${location}.generatedAt must use YYYY-MM-DD`);
  }

  if (!/^\d+\.\d+\.\d+$/.test(template.exampleSchemaVersion ?? "")) {
    errors.push(`${location}.exampleSchemaVersion must be semantic versioning`);
  }

  if (!["sfw", "suggestive-capable"].includes(template.contentTier)) {
    errors.push(`${location}.contentTier is invalid`);
  }

  if (!template.suggestedSettings || typeof template.suggestedSettings !== "object" || Array.isArray(template.suggestedSettings)) {
    errors.push(`${location}.suggestedSettings must be an object`);
  }

  if (template.inputRequirements !== undefined) {
    if (!template.inputRequirements || typeof template.inputRequirements !== "object" || Array.isArray(template.inputRequirements)) {
      errors.push(`${location}.inputRequirements must be an object`);
    } else if (template.inputRequirements.image !== undefined) {
      const imageRequirement = template.inputRequirements.image;
      if (!imageRequirement || typeof imageRequirement !== "object" || Array.isArray(imageRequirement)) {
        errors.push(`${location}.inputRequirements.image must be an object`);
      } else {
        if (typeof imageRequirement.required !== "boolean") {
          errors.push(`${location}.inputRequirements.image.required must be a boolean`);
        }
        for (const field of ["label", "description"]) {
          if (typeof imageRequirement[field] !== "string" || imageRequirement[field].trim() === "") {
            errors.push(`${location}.inputRequirements.image.${field} must be a non-empty string`);
          }
        }
      }
    }
  }

  for (const field of ["tags", "negativePrompt"]) {
    if (!Array.isArray(template[field])) {
      errors.push(`${location}.${field} must be an array`);
    } else if (template[field].some((value) => typeof value !== "string")) {
      errors.push(`${location}.${field} must contain only strings`);
    }
  }

  if (!Array.isArray(template.slots)) {
    errors.push(`${location}.slots must be an array`);
  }

  for (const [slotIndex, slot] of (template.slots ?? []).entries()) {
    if (!slot || typeof slot !== "object" || Array.isArray(slot)) {
      errors.push(`${location}.slots[${slotIndex}] must be an object`);
      continue;
    }
    if (!/^[a-z][a-z0-9_]*$/.test(slot.name ?? "")) {
      errors.push(`${location}.slots[${slotIndex}].name must be snake_case`);
    }
    for (const field of ["label", "example"]) {
      if (typeof slot[field] !== "string" || slot[field].trim() === "") {
        errors.push(`${location}.slots[${slotIndex}].${field} must be a non-empty string`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`Template catalogue validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${catalog.templates.length} canonical Open Image Templates.`);
}
