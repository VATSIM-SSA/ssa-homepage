import { NextRequest } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const sscApi = process.env.SSC_API;

    if (!sscApi) {
      return new Response("SSC_API is not configured.", {
        status: 500,
      });
    }

    let url: URL;

    try {
      url = new URL(sscApi);
    } catch {
      return new Response("SSC_API is not a valid URL.", {
        status: 500,
      });
    }

    const response = await fetch(url.toString(), {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return new Response(
        `Upstream screenshot competition API returned ${response.status}.`,
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
        : "Error fetching screenshot competition data.",
      {
        status: 500,
      },
    );
  }
}
