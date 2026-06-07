import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const ids = searchParams.get("ids");
        const rvasApi = process.env.RVAS_API;

        if (!rvasApi) {
            return new Response("RVAS_API is not configured.", { status: 500 });
        }

        const url = new URL(rvasApi);

        if (ids) {
            url.searchParams.set("ids", ids);
        }

        const response = await fetch(url.toString(), {
            cache: "no-store",
        });

        if (!response.ok) {
            const message = await response.text();

            return new Response(message || "Error fetching rVA data.", {
                status: response.status,
            });
        }

        const body = await response.text();

        return new Response(body, {
            status: response.status,
            headers: {
                "content-type": response.headers.get("content-type") ?? "application/json",
            },
        });
    } catch (error) {
        return new Response(
            error instanceof Error ? error.message : "Error fetching rVA data.",
            { status: 500 },
        );
    }
}