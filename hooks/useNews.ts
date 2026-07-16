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

function stripImageMarkup(input: string): string {
	return input
		.replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // markdown images
		.replace(/\[image\]/gi, " ") // Discourse [image] placeholder
		.replace(/\s+/g, " ")
		.trim();
}

function getExcerpt(post: RawNewsPost): string {
	const source =
		(post.excerpt && post.excerpt.trim().length > 0 && post.excerpt) ||
		(post.cooked && post.cooked.trim().length > 0 && post.cooked) ||
		"";

	const text = stripImageMarkup(stripHtml(source));
	return text.length > 0 ? text : "No summary available for this update yet.";
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
