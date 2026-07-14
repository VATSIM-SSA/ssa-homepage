import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const sourceUrl = new URL("/api/data/policies", request.url);

    const response = await fetch(sourceUrl.toString(), {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return new Response(await response.text(), {
        status: response.status,
      });
    }

    const json = await response.json();

    return Response.json(json);
  } catch (error) {
    return new Response(
      error instanceof Error
        ? error.message
        : "Error fetching policy data.",
      {
        status: 500,
      },
    );
  }
}