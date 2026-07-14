import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const sourceUrl = new URL("/api/data/policies", request.url);

    const response = await fetch(sourceUrl.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      const message = await response.text();

      return new Response(message || "Error fetching policy data.", {
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
      error instanceof Error
        ? error.message
        : "Error fetching policy data.",
      {
        status: 500,
      }
    );
  }
}