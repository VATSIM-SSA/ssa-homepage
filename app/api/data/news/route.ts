import { NextRequest } from "next/server";

// The posts firehose carries no tags, but the news cards want them to choose a
// placeholder image. Tags live on topics, so pull the Announcements category
// once and key its tags by topic id. Best-effort: on any failure the cards
// simply fall back to no image.
async function fetchAnnouncementTags(origin: string): Promise<Map<number, string[]>> {
    const map = new Map<number, string[]>();

    try {
        const response = await fetch(
            new URL("/c/announcements/5.json", origin).toString(),
            { cache: "no-store" },
        );

        if (!response.ok) {
            return map;
        }

        const data = await response.json();
        const topics = data?.topic_list?.topics;

        if (Array.isArray(topics)) {
            for (const topic of topics) {
                if (typeof topic?.id === "number" && Array.isArray(topic?.tags)) {
                    map.set(topic.id, topic.tags);
                }
            }
        }
    } catch {
        // Tags are a nice-to-have; leave the map empty on any error.
    }

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
        // which the browser resolves against this site rather than the forum.
        // Rewrite it against the NEWS_API origin before handing it on.
        let payload = body;

        try {
            const data = JSON.parse(body);

            if (Array.isArray(data?.latest_posts)) {
                const tagsByTopic = await fetchAnnouncementTags(url.origin);

                for (const post of data.latest_posts) {
                    if (typeof post?.post_url === "string" && post.post_url.startsWith("/")) {
                        post.post_url = new URL(post.post_url, url.origin).toString();
                    }

                    // Attach the topic's tags so the card can pick a placeholder
                    // image when the post has none of its own.
                    if (typeof post?.topic_id === "number") {
                        post.tags = tagsByTopic.get(post.topic_id) ?? [];
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