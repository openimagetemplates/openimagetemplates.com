export default function ArchitecturePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Implementation notes</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-zinc-950">Fast global delivery without runaway image costs.</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
        The site is static-first. Template metadata can be deployed with the app, while images should live behind a CDN-backed object store.
      </p>
      <div className="mt-10 space-y-4">
        {[
          {
            title: "Use R2 as origin",
            body: "Store original generated images and derived card previews in Cloudflare R2. R2 avoids egress fees to Cloudflare and keeps the app server out of the image path.",
          },
          {
            title: "Put a custom CDN domain in front",
            body: "Serve assets from something like img.openimagetemplates.com with Cloudflare cache rules. Use immutable URLs that include content hashes or generation dates.",
          },
          {
            title: "Generate derivatives once",
            body: "Precompute card WebP or AVIF previews at 512-768px wide. Detail pages can use larger derivatives. Do not ask Next.js to optimize every remote image on demand.",
          },
          {
            title: "Keep schema and catalogue crawlable",
            body: "Template detail pages should be static HTML with visible prompt text and JSON-LD-like schema data. That is the SEO and AI-crawler value.",
          },
          {
            title: "Moderate submissions before publish",
            body: "Community submissions can be stored as JSON plus asset uploads in a private R2 prefix. Publishing moves approved assets to the public prefix and adds the template to the catalogue index.",
          },
        ].map((item) => (
          <section key={item.title} className="rounded-[8px] border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950">{item.title}</h2>
            <p className="mt-2 leading-7 text-zinc-600">{item.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
