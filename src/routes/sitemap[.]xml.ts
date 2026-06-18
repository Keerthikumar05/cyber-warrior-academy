import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { worlds, getMissionsForWorld } from "@/lib/missions";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: { path: string; changefreq: string; priority: string }[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
        ];
        for (const w of worlds) {
          if (w.status !== "available") continue;
          for (const m of getMissionsForWorld(w.slug)) {
            entries.push({ path: `/play/${w.slug}/${m.slug}`, changefreq: "monthly", priority: "0.8" });
          }
        }
        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
