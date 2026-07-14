import { NextRequest } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const policiesApi = process.env.POLICIES_API;

    if (!policiesApi) {
      return new Response("POLICIES_API is not configured.", {
        status: 500,
      });
    }

    let url: URL;

    try {
      url = new URL(policiesApi);
    } catch {
      return new Response("POLICIES_API is not a valid URL.", {
        status: 500,
      });
    }

    const response = await fetch(url.toString(), {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return new Response(
        `Upstream policy API returned ${response.status}.`,
        {
          status: response.status,
        },
      );
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