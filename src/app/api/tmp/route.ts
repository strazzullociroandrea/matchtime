import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import fetchAndCacheMatches from "@/server/api/routers/api/getInfo/fetchAndCache";
import { env } from "@/env";

const handler = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category")?.replaceAll("_", " ");

    const { matches } = await fetchAndCacheMatches(category ?? env.CATEGORY);
  
    return new Response(matches, {
      status: 200,
      headers: {
        "Content-Type": "text/json; charset=utf-8",
        "Content-Disposition": 'inline; filename="partite.json"',
      },
    });
  } catch (error) {
    console.error("Errore nel handler del calendario:", error);
    return new Response("Errore server", { status: 500 });
  }
};

export { handler as GET, handler as POST };

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  );
}
