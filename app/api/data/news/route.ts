import { NextRequest } from "next/server";

// News cards pick a placeholder picture by category: Vacancy Announcements
// get the vacancy picture, everything else the divisional one. The posts
// firehose carries no category, so read the topic lists of the two public
// News categories once and key them by topic id. Best-effort: on any failure
// the cards fall back to the default picture.
const PUBLIC_NEWS_CATEGORIES = [
    "/c/announcements/5.json",
    "/c/vacancy-announcements/11.json",
];

async function fetchTopicCategories(origin: string): Promise<Map<number, number>> {
    const map = new Map<number, number>();

    await Promise.all(
        PUBLIC_NEWS_CATEGORIES.map(async (path) => {
            try {
                const response = await fetch(new URL(path, origin).toString(), {
                    cache: "no-store",
                });

                if (!response.ok) {
                    return;
                }

                const data = await response.json();
                const topics = data?.topic_list?.topics;

                if (Array.isArray(topics)) {
                    for (const topic of topics) {
                        if (typeof topic?.id === "number" && typeof topic?.category_id === "number") {
                            map.set(topic.id, topic.category_id);
                        }
                    }
                }
            } catch {
                // A category is a nice-to-have; the card falls back to the default picture.
            }
        }),
    );

    return map;
}

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
        // which the browser resolves against this site rather than News.
        // Rewrite it against the NEWS_API origin before handing it on.
        let payload = body;

        try {
            const data = JSON.parse(body);

            if (Array.isArray(data?.latest_posts)) {
                const categoryByTopic = await fetchTopicCategories(url.origin);

                for (const post of data.latest_posts) {
                    if (typeof post?.post_url === "string" && post.post_url.startsWith("/")) {
                        post.post_url = new URL(post.post_url, url.origin).toString();
                    }

                    // Attach the topic's category so the card can pick a
                    // placeholder image when the post has none of its own.
                    if (typeof post?.topic_id === "number") {
                        post.category_id = categoryByTopic.get(post.topic_id) ?? null;
                    }

                    // First image in the rendered post, absolutised so the
                    // browser fetches it from News rather than this site.
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