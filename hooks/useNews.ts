"use client";

import { useEffect, useState } from "react";

type RawNewsPost = {
	id: number;
	topic_title?: string | null;
	name?: string | null;
	username?: string | null;
	created_at?: string | null;
	excerpt?: string | null;
	cooked?: string | null;
	post_url?: string | null;
	image?: string | null;
	tags?: string[] | null;
};

type NewsEnvelope = { latest_posts: RawNewsPost[] };
type DataEnvelope = { data: RawNewsPost[] };

type NewsResponse =
	| RawNewsPost[]
	| NewsEnvelope
	| DataEnvelope
	| Array<DataEnvelope>;

export type NewsPost = {
	id: number;
	title: string;
	author: string;
	authorCid: string | null;
	publishedAt: string;
	excerpt: string;
	url: string | null;
	image: string | null;
	tags: string[];
};

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function isDataEnvelope(value: unknown): value is DataEnvelope {
	return isObject(value) && "data" in value && Array.isArray(value.data);
}

function isNewsEnvelope(value: unknown): value is NewsEnvelope {
	return (
		isObject(value) &&
		"latest_posts" in value &&
		Array.isArray(value.latest_posts)
	);
}

function stripHtml(input: string): string {
	return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

// Discourse wraps an uploaded image in a lightbox anchor whose text is the
// file's name, dimensions and size ("banner.jpeg 1920×1080 104 KB"). Removing
// the tags alone would leave that metadata in the excerpt, so drop the whole
// block before the HTML is flattened.
function stripImageBlocks(input: string): string {
	return input
		.replace(/<a[^>]*class="[^"]*lightbox[^"]*"[^>]*>[\s\S]*?<\/a>/gi, " ")
		.replace(/<img[^>]*>/gi, " ");
}

function stripImageMarkup(input: string): string {
	return input
		.replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // markdown images
		.replace(/\[image\]/gi, " ") // Discourse [image] placeholder
		.replace(/\s+/g, " ")
		.trim();
}

const NAMED_ENTITIES: Record<string, string> = {
	amp: "&",
	lt: "<",
	gt: ">",
	quot: '"',
	apos: "'",
	nbsp: " ",
	hellip: "…",
	mdash: "—",
	ndash: "–",
	rsquo: "’",
	lsquo: "‘",
	rdquo: "”",
	ldquo: "“",
};

// Discourse serves excerpts as HTML, so entities like "&hellip;" and "&#39;"
// survive tag-stripping and would render literally. Decode the common named
// ones plus any numeric reference.
function decodeEntities(input: string): string {
	return input.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, code) => {
		if (code[0] === "#") {
			const codePoint =
				code[1].toLowerCase() === "x"
					? parseInt(code.slice(2), 16)
					: parseInt(code.slice(1), 10);

			return Number.isFinite(codePoint)
				? String.fromCodePoint(codePoint)
				: match;
		}

		return NAMED_ENTITIES[code.toLowerCase()] ?? match;
	});
}

function toPlainText(input: string): string {
	const text = stripImageMarkup(stripHtml(stripImageBlocks(input)));

	// Decode entities last, then tidy the trailing ellipsis Discourse adds so
	// the CSS line-clamp is the only thing that truncates on screen.
	return decodeEntities(text)
		.replace(/\s*(?:…|\.\.\.)\s*$/, "")
		.trim();
}

function getExcerpt(post: RawNewsPost): string {
	// An excerpt that held nothing but an image flattens to an empty string, so
	// fall back to the post body before giving up.
	const fromExcerpt = post.excerpt ? toPlainText(post.excerpt) : "";

	if (fromExcerpt.length > 0) {
		return fromExcerpt;
	}

	const fromCooked = post.cooked ? toPlainText(post.cooked) : "";

	return fromCooked.length > 0
		? fromCooked
		: "No summary available for this update yet.";
}

function normalisePost(post: RawNewsPost): NewsPost {
	return {
		id: post.id,
		title: post.topic_title || "Untitled news post",
		author: post.name || post.username || "VATSSA",
		authorCid: post.username || null,
		publishedAt: post.created_at || "",
		excerpt: getExcerpt(post),
		url: post.post_url || null,
		image: post.image || null,
		tags: Array.isArray(post.tags) ? post.tags : [],
	};
}

function normaliseNews(payload: NewsResponse): NewsPost[] {
	let posts: RawNewsPost[] = [];

	if (Array.isArray(payload)) {
		if (payload.length > 0 && isDataEnvelope(payload[0])) {
			posts = payload[0].data;
		} else {
			posts = payload as RawNewsPost[];
		}
	} else if (isDataEnvelope(payload)) {
		posts = payload.data;
	} else if (isNewsEnvelope(payload)) {
		posts = payload.latest_posts;
	}

	return posts.map(normalisePost);
}

export function useNews(limit?: number) {
	const [news, setNews] = useState<NewsPost[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isActive = true;

		async function loadNews() {
			try {
				setIsLoading(true);
				setError(null);

				const response = await fetch("/api/data/news", {
					cache: "no-store",
				});

				if (!response.ok) {
					const message = await response.text();

					throw new Error(message || "Failed to fetch news.");
				}

				const payload = (await response.json()) as NewsResponse;

				if (!isActive) {
					return;
				}

				const posts = normaliseNews(payload);
				setNews(typeof limit === "number" ? posts.slice(0, limit) : posts);
			} catch (caughtError) {
				if (!isActive) {
					return;
				}

				setError(
					caughtError instanceof Error
						? caughtError.message
						: "Failed to fetch news.",
				);
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		}

		loadNews();

		return () => {
			isActive = false;
		};
	}, [limit]);

	return {
		news,
		isLoading,
		error,
	};
}

export default useNews;
