import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const ids = searchParams.get("ids");
        const bookingsApi = process.env.BOOKINGS_API;

        if (!bookingsApi) {
            return new Response("BOOKINGS_API is not configured.", { status: 500 });
        }

        const url = new URL(bookingsApi);

        if (ids) {
            url.searchParams.set("ids", ids);
        }

        const response = await fetch(url.toString(), {
            cache: "no-store",
        });

        if (!response.ok) {
            const message = await response.text();

            return new Response(message || "Error fetching bookings data.", {
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
            error instanceof Error ? error.message : "Error fetching bookings data.",
            { status: 500 },
        );
    }
}