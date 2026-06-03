import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const sourceUrl = new URL("/api/data/staff", request.url);
    const ids = request.nextUrl.searchParams.get("ids");

    if (ids) {
      sourceUrl.searchParams.set("ids", ids);
    }

    const response = await fetch(sourceUrl.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      const message = await response.text();

      return new Response(message || "Error fetching staff data.", {
        status: response.status,
      });
    }

    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        "content-type":
          response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    return new Response(
      error instanceof Error ? error.message : "Error fetching staff data.",
      { status: 500 },
    );
  }
}
