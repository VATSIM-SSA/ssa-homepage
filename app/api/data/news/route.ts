import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const ids = searchParams.get("ids");
        const newsApi = process.env.NEWS_API;

        if (!newsApi) {
            return new Response("NEWS_API is not configured.", { status: 500 });
        }

        const url = new URL(newsApi);

        if (ids) {
            url.searchParams.set("ids", ids);
        }

        const response = await fetch(url.toString(), {
            cache: "no-store",
        });

        if (!response.ok) {
            const message = await response.text();

            return new Response(message || "Error fetching news data.", {
                status: response.status,
            });
        }

        const body = await response.text();

        // Discourse returns post_url as a site-relative path ("/t/slug/12/1"),
        // which the browser resolves against this site rather than the forum.
        // Rewrite it against the NEWS_API origin before handing it on.
        let payload = body;

        try {
            const data = JSON.parse(body);

            if (Array.isArray(data?.latest_posts)) {
                for (const post of data.latest_posts) {
                    if (typeof post?.post_url === "string" && post.post_url.startsWith("/")) {
                        post.post_url = new URL(post.post_url, url.origin).toString();
                    }

                    // First image in the rendered post, absolutised so the
                    // browser fetches it from the forum rather than this site.
                    if (typeof post?.cooked === "string") {
                        const match = post.cooked.match(/<img[^>]+src=["']([^"']+)["']/i);
                        if (match) {
                            const src = match[1];
                            post.image = src.startsWith("/")
                                ? new URL(src, url.origin).toString()
                                : src;
                        }
                    }
                }

                payload = JSON.stringify(data);
            }
        } catch {
            // Not JSON, or a shape we don't recognise — pass it through untouched.
        }

        return new Response(payload, {
            status: response.status,
            headers: {
                "content-type": response.headers.get("content-type") ?? "application/json",
            },
        });
    } catch (error) {
        return new Response(
            error instanceof Error ? error.message : "Error fetching news data.",
            { status: 500 },
        );
    }
}