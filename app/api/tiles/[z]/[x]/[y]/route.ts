// Proxies CARTO basemap tiles so the API key stays on the server. The key is
// a runtime env var (CARTO_API_KEY, no NEXT_PUBLIC_), so it never reaches the
// browser bundle. Tiles ship with long cache headers and a .png path, so
// Cloudflare caches them at the edge and repeat requests never hit the VPS or
// count against CARTO's monthly quota.
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ z: string; x: string; y: string }> },
) {
    const { z, x, y } = await params;
    const match = /^(\d+)(@2x)?\.png$/.exec(y);
    const zoom = Number(z);
    const col = Number(x);

    if (!match || !/^\d+$/.test(z) || !/^\d+$/.test(x) || zoom > 20) {
        return new Response("Invalid tile.", { status: 400 });
    }

    const row = Number(match[1]);
    const max = 2 ** zoom;

    if (col >= max || row >= max) {
        return new Response("Invalid tile.", { status: 400 });
    }

    const apiKey = process.env.CARTO_API_KEY;

    if (!apiKey) {
        return new Response("CARTO_API_KEY is not configured.", { status: 500 });
    }

    try {
        const response = await fetch(
            `https://a.basemaps.cartocdn.com/dark_all/${zoom}/${col}/${row}${match[2] ?? ""}.png?key=${apiKey}`,
            { cache: "no-store" },
        );

        if (!response.ok) {
            return new Response("Error fetching tile.", {
                status: response.status,
                headers: { "cache-control": "no-store" },
            });
        }

        return new Response(await response.arrayBuffer(), {
            headers: {
                "content-type": "image/png",
                "cache-control": "public, max-age=86400, s-maxage=2592000",
            },
        });
    } catch {
        // Never echo the upstream error: it could carry the keyed URL.
        return new Response("Error fetching tile.", { status: 502 });
    }
}
