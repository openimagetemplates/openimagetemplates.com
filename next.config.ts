import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/open-image-template.schema.json",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex",
          },
          {
            key: "Link",
            value:
              '<https://www.openimagetemplates.com/schema>; rel="canonical"; type="text/html", <https://www.openimagetemplates.com/openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"',
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/:key([A-Za-z0-9-]{8,128}).txt",
        destination: "/api/indexnow-key/:key",
      },
      {
        source: "/templates/:id.json",
        destination: "/api/templates/:id",
      },
    ];
  },
};

export default nextConfig;
