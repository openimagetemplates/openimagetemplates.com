const host = "www.openimagetemplates.com";
const siteUrl = `https://${host}`;
const key = process.env.INDEXNOW_KEY?.trim();
const endpoint = process.env.INDEXNOW_ENDPOINT?.trim() || "https://api.indexnow.org/indexnow";

if (!key) {
  throw new Error("INDEXNOW_KEY is required.");
}

if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) {
  throw new Error("INDEXNOW_KEY must be 8-128 characters containing only letters, numbers, or hyphens.");
}

const urlList = process.argv
  .slice(2)
  .map((value) => new URL(value, siteUrl))
  .filter((url) => url.hostname === host)
  .map((url) => url.toString());

if (urlList.length === 0) {
  throw new Error(
    "Pass at least one changed, created, or deleted URL. Example: npm run indexnow:submit -- /templates/example",
  );
}

if (urlList.length > 10_000) {
  throw new Error("IndexNow accepts at most 10,000 URLs per request.");
}

const keyLocation = process.env.INDEXNOW_KEY_LOCATION?.trim() || `${siteUrl}/${key}.txt`;
const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body: JSON.stringify({
    host,
    key,
    keyLocation,
    urlList,
  }),
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(`IndexNow returned ${response.status}: ${body.slice(0, 500)}`);
}

console.log(`Submitted ${urlList.length} URL${urlList.length === 1 ? "" : "s"} to IndexNow.`);
