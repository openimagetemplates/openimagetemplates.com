import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

const options = parseOptions(process.argv.slice(2));
const sourceDir = requiredOption(options, "source-dir");
const prefix = requiredOption(options, "prefix").replace(/^\/+|\/+$/g, "");
const bucket = options.bucket ?? "oit-public-assets";
const assetBaseUrl = (options["asset-base-url"] ?? "https://assets.openimagetemplates.com").replace(/\/+$/, "");
const envFile = options["env-file"];
const concurrency = Number(options.concurrency ?? 6);

if (!/^[a-z0-9][a-z0-9/-]*$/.test(prefix)) throw new Error("prefix contains unsupported characters");
if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 16) throw new Error("concurrency must be between 1 and 16");

const files = readdirSync(sourceDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && /\.(?:webp|png|jpe?g)$/i.test(entry.name))
  .map((entry) => entry.name)
  .sort();

if (files.length === 0) throw new Error(`No publishable images found in ${sourceDir}`);

let uploaded = 0;
let skipped = 0;
let completed = 0;

await runPool(files, concurrency, async (fileName) => {
  const key = `${prefix}/${fileName}`;
  const publicUrl = `${assetBaseUrl}/${prefix}/${encodeURIComponent(fileName)}`;
  const existing = await fetch(`${publicUrl}?availability-check=${Date.now()}-${encodeURIComponent(fileName)}`, {
    method: "HEAD",
    redirect: "manual",
  });

  if (existing.ok) {
    skipped += 1;
  } else if (existing.status === 404 || (existing.status >= 300 && existing.status < 400)) {
    await putObject(key, resolve(sourceDir, fileName), contentTypeFor(fileName));
    uploaded += 1;
  } else {
    throw new Error(`Could not check ${publicUrl}: HTTP ${existing.status}`);
  }

  completed += 1;
  if (completed % 10 === 0 || completed === files.length) {
    console.log(`Checked ${completed}/${files.length} assets (${uploaded} uploaded, ${skipped} already present).`);
  }
});

console.log(`Published ${prefix}: ${uploaded} uploaded, ${skipped} already present.`);

function putObject(key, file, contentType) {
  const args = [
    "wrangler",
    "r2",
    "object",
    "put",
    `${bucket}/${key}`,
    "--file",
    file,
    "--remote",
    "--content-type",
    contentType,
    "--cache-control",
    "public, max-age=31536000, immutable",
  ];
  if (envFile) args.push("--env-file", envFile);

  return new Promise((resolvePromise, reject) => {
    const child = spawn("npx", args, { stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.stderr.on("data", (chunk) => { output += chunk; });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`Failed to upload ${key}:\n${output.trim()}`));
    });
  });
}

async function runPool(items, size, worker) {
  let nextIndex = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (nextIndex < items.length) {
      const item = items[nextIndex];
      nextIndex += 1;
      await worker(item);
    }
  }));
}

function contentTypeFor(fileName) {
  if (/\.webp$/i.test(fileName)) return "image/webp";
  if (/\.png$/i.test(fileName)) return "image/png";
  return "image/jpeg";
}

function parseOptions(args) {
  const parsed = {};
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index];
    const value = args[index + 1];
    if (!name?.startsWith("--") || value === undefined) throw new Error(`Invalid option near ${name ?? "end of command"}`);
    parsed[name.slice(2)] = value;
  }
  return parsed;
}

function requiredOption(optionsRecord, name) {
  const value = optionsRecord[name];
  if (!value) throw new Error(`Missing required --${name} option`);
  return value;
}
