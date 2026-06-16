import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nanoGptDir = resolve(process.env.NANOGPT_PROJECT_DIR ?? "/Users/dev1/worktrees/worktree/white");
const nanoGptTemplatePath = resolve(nanoGptDir, "app/media/promptTemplates.ts");
const outputPath = resolve(rootDir, "src/data/nanogpt-prompt-templates.json");
const defaultAssetBaseUrl = process.env.NANOGPT_TEMPLATE_ASSET_BASE_URL ?? "https://nano-gpt.com";

const source = readFileSync(nanoGptTemplatePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    esModuleInterop: true,
  },
  fileName: nanoGptTemplatePath,
});

const syncModule = { exports: {} };
const imageModels = {
  WAVESPEED: new Proxy(
    {},
    {
      get: (_target, prop) => String(prop),
    },
  ),
};

vm.runInNewContext(compiled.outputText, {
  exports: syncModule.exports,
  module: syncModule,
  require: (specifier) => {
    if (specifier === "lib/modelProviders/imageModels") {
      return { ImageModels: imageModels };
    }
    throw new Error(`Unsupported import while syncing templates: ${specifier}`);
  },
}, { filename: nanoGptTemplatePath });

const nanoTemplates = syncModule.exports.promptTemplates;

const publicTemplates = nanoTemplates
  .filter((template) => !template.tags?.includes("candid"))
  .map((template) => ({
    id: template.id,
    title: template.title,
    description: template.description,
    category: template.category,
    tags: template.tags ?? [],
    image: absoluteAssetUrl(template.previewImage),
    imageAlt: `${template.title} preview`,
    prompt: template.compiledPrompt,
    negativePrompt: template.negativePrompt ?? [],
    slots: template.slots ?? [],
    suggestedModel: template.suggestedModel,
    suggestedModelLabel: template.suggestedModelLabel,
    schemaVersion: template.schemaVersion,
    generatedAt: template.previewGeneratedAt,
    creator: "Open Image Templates",
    license: "CC BY 4.0",
  }));

writeFileSync(
  outputPath,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      source: "nano-gpt.com app/media/promptTemplates.ts",
      templates: publicTemplates,
    },
    null,
    2,
  )}\n`,
);

console.log(`Synced ${publicTemplates.length} templates from ${nanoGptDir}`);
console.log(`Wrote ${outputPath}`);

function absoluteAssetUrl(value) {
  if (!value) return value;
  if (/^https?:\/\//.test(value)) return value;
  return `${defaultAssetBaseUrl.replace(/\/$/, "")}${value.startsWith("/") ? value : `/${value}`}`;
}
