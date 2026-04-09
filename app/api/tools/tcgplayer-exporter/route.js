// app/api/tools/tcgplayer-exporter/route.js
//
// Server-side bridge for the TCGPlayer exporter UI.
//
// Why this exists:
// - tcgcsv.com blocks browser-origin requests via CORS
// - the browser cannot reliably set the User-Agent header
// - app/lib/tcgplayer-exporter.js already contains the server-safe fetch logic
//
// This route keeps the existing client UI intact by exposing:
// - GET ?type=groups
// - GET ?type=set&groupId=123

import { fetchGroups, fetchProducts, fetchPrices } from "@/app/lib/tcgplayer-exporter";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "groups") {
      const groups = await fetchGroups();
      return Response.json({ results: groups }, { status: 200 });
    }

    if (type === "set") {
      const groupId = searchParams.get("groupId");

      if (!groupId) {
        return Response.json(
          { error: "Missing required query param: groupId" },
          { status: 400 }
        );
      }

      const [products, prices] = await Promise.all([
        fetchProducts(groupId),
        fetchPrices(groupId),
      ]);

      return Response.json(
        {
          groupId,
          products,
          prices,
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        error: 'Invalid request. Use ?type=groups or ?type=set&groupId=<id>.',
      },
      { status: 400 }
    );
  } catch (error) {
    return Response.json(
      {
        error: error?.message || "Unknown TCGPlayer exporter error",
      },
      { status: 500 }
    );
  }
}
