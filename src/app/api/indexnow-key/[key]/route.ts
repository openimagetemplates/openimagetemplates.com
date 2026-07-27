type IndexNowKeyRouteProps = {
  params: Promise<{ key: string }>;
};

export async function GET(_request: Request, { params }: IndexNowKeyRouteProps) {
  const { key } = await params;
  const configuredKey = process.env.INDEXNOW_KEY;

  if (!configuredKey || key !== configuredKey) {
    return new Response("Not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex",
      },
    });
  }

  return new Response(configuredKey, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
