import type { PortableTextBlock } from '@portabletext/types';
import { DB_URL } from '$env/static/private';
import type { Post, PocketBasePost, PocketBaseListResponse } from '$lib/types';

// Base URL for PocketBase
const POCKETBASE_URL = DB_URL;
const COLLECTION_NAME = 'posts';

/**
 * Construct PocketBase image URL
 */
function getImageUrl(post: PocketBasePost): string | null {
	if (!post.mainImage || !post.id) return null;
	return `${POCKETBASE_URL}/api/files/${COLLECTION_NAME}/${post.id}/${post.mainImage}`;
}

/**
 * Transform PocketBase response to match Post interface
 */
function transformPost(pbPost: PocketBasePost): Post {
	// Parse body (stored as JSON string in PocketBase)
	let body: PortableTextBlock[] = [];
	if (pbPost.body) {
		if (Array.isArray(pbPost.body)) {
			body = pbPost.body;
		} else if (typeof pbPost.body === 'string') {
			try {
				const parsed = JSON.parse(pbPost.body);
				body = Array.isArray(parsed) ? parsed : [];
			} catch (e) {
				console.warn(`Failed to parse post body for ${pbPost.id}:`, e);
				body = [];
			}
		}
	}

	// Transform slug from string to object
	const slug = typeof pbPost.slug === 'string'
		? { current: pbPost.slug }
		: pbPost.slug || { current: '' };

	// Construct image URL and transform to mainImage structure
	let mainImage: Post['mainImage'] | undefined;
	const imageUrl = getImageUrl(pbPost);
	if (imageUrl) {
		mainImage = {
			asset: {
				url: imageUrl
			},
			mainImageUrl: imageUrl
		} as Post['mainImage'];
	}

	return {
		_type: 'post',
		_createdAt: pbPost.created || new Date().toISOString(),
		_updatedAt: pbPost.updated,
		title: pbPost.title,
		slug,
		excerpt: pbPost.excerpt,
		mainImage,
		tags: pbPost.tags || [],
		body
	};
}


async function fetchPocketBase<T>(endpoint: string, options?: RequestInit): Promise<T> {
	if (!POCKETBASE_URL) {
		throw new Error('PUBLIC_DB_URL environment variable is not set');
	}

	const url = `${POCKETBASE_URL}${endpoint}`;
	const start = Date.now();

	console.log(`[PocketBase] FETCH START: ${endpoint}`);
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal
		});
		clearTimeout(timeoutId);

		if (!response.ok) {
			const errorText = await response.text().catch(() => 'Unknown error');
			let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

			try {
				const errorJson = JSON.parse(errorText);
				errorMessage = errorJson.message || errorMessage;
			} catch {
				if (errorText && errorText !== 'Unknown error') {
					errorMessage = errorText;
				}
			}

			if (response.status === 404) {
				throw new Error(`Not found: ${endpoint}`);
			}

			throw new Error(errorMessage);
		}

		const data = await response.json();

		const itemCount = data.items?.length ?? 'N/A';
		console.log(`[PocketBase] FETCH SUCCESS: ${endpoint} (${Date.now() - start}ms) - Items: ${itemCount}`);
		return data;
	} catch (error) {
		clearTimeout(timeoutId);
		const duration = Date.now() - start;
		console.error(`[PocketBase] FETCH ERROR: ${endpoint} (${duration}ms):`, error instanceof Error ? error.message : error);

		if (error instanceof Error && error.name === 'AbortError') {
			throw new Error(`Connection to PocketBase timed out after 10s at ${POCKETBASE_URL}`);
		}

		throw error;
	}
}

export async function getPosts(limit = 60): Promise<Post[]> {
	const data = await fetchPocketBase<PocketBaseListResponse>(
		`/api/collections/${COLLECTION_NAME}/records?page=1&perPage=${limit}&sort=-created&filter=(status="Published" || status="")`
	);

	return data.items.map(transformPost);
}

export async function getFeaturedPosts(limit = 5): Promise<Post[]> {
	const data = await fetchPocketBase<PocketBaseListResponse>(
		`/api/collections/${COLLECTION_NAME}/records?page=1&perPage=${limit}&sort=-created&filter=(status="Published" || status="")`
	);

	return data.items.map(transformPost);
}

export async function getRelatedPosts(
	currentSlug: string,
	title = '',
	excerpt = '',
	limit = 4
): Promise<Post[]> {
	// For related posts, we only need a few latest ones to filter, or we search
	// Using a smaller set for better performance
	const allPosts = await getPosts(100);
	const filtered = allPosts.filter(post => post.slug.current !== currentSlug);

	// Simple keyword matching
	if (title || excerpt) {
		const keywords = `${title} ${excerpt}`.toLowerCase()
			.split(/\s+/)
			.filter(word => word.length > 3)
			.slice(0, 5);

		const scored = filtered.map(post => {
			const postText = `${post.title || ''} ${post.excerpt || ''}`.toLowerCase();
			const score = keywords.reduce((acc, keyword) => {
				return acc + (postText.includes(keyword) ? 1 : 0);
			}, 0);
			return { post, score };
		});

		const sorted = scored.sort((a, b) => b.score - a.score);
		return sorted.slice(0, limit).map(item => item.post);
	}

	// Fallback to recent posts
	return filtered.slice(0, limit);
}

export async function getPostsByTag(tag: string, limit = 6): Promise<Post[]> {
	const encodedTag = encodeURIComponent(tag);
	const data = await fetchPocketBase<PocketBaseListResponse>(
		`/api/collections/${COLLECTION_NAME}/records?filter=tags~"${encodedTag}" && (status="Published" || status="")&sort=-created&perPage=${limit}`
	);

	return data.items.map(transformPost);
}

export async function getTrendingPosts(limit = 5): Promise<Post[]> {
	return getFeaturedPosts(limit);
}

export async function getTags(): Promise<string[]> {
	// Fetch only what's necessary for tags (only published posts)
	const data = await fetchPocketBase<PocketBaseListResponse>(
		`/api/collections/${COLLECTION_NAME}/records?perPage=200&filter=(status="Published" || status="")`
	);

	const allTags: string[] = [];
	data.items.forEach(post => {
		if (post.tags) {
			allTags.push(...post.tags);
		}
	});

	const uniqueTags = [...new Set(allTags)];
	return uniqueTags;
}

export async function getTaggedPosts(tag: string, limit = 100): Promise<Post[]> {
	const encodedTag = encodeURIComponent(tag);
	const data = await fetchPocketBase<PocketBaseListResponse>(
		`/api/collections/${COLLECTION_NAME}/records?filter=tags~"${encodedTag}" && (status="Published" || status="")&sort=-created&perPage=${limit}`
	);

	return data.items.map(transformPost);
}

export async function getPost(slug: string): Promise<Post | null> {
	try {
		const encodedSlug = encodeURIComponent(slug);
		const data = await fetchPocketBase<PocketBaseListResponse>(
			`/api/collections/${COLLECTION_NAME}/records?filter=slug="${encodedSlug}" && (status="Published" || status="")&perPage=1`
		);

		if (data.items && data.items.length > 0) {
			return transformPost(data.items[0]);
		}
		return null;
	} catch (error) {
		console.error('Error fetching post:', error);
		return null;
	}
}

export async function searchPosts(query: string): Promise<Post[]> {
	// Fetch all posts and filter client-side
	// This is a simple implementation - you may want to enhance with better search
	const allPosts = await getPosts();
	const queryLower = query.toLowerCase();

	return allPosts.filter(post => {
		const titleMatch = post.title?.toLowerCase().includes(queryLower);
		const excerptMatch = post.excerpt?.toLowerCase().includes(queryLower);

		// Also search in body text
		let bodyMatch = false;
		if (post.body) {
			const bodyText = post.body
				.map(block => {
					if (block._type === 'block' && 'children' in block && block.children) {
						const children = block.children as Array<{ text?: string }>;
						return children
							.map(child => child.text || '')
							.join(' ');
					}
					return '';
				})
				.join(' ')
				.toLowerCase();
			bodyMatch = bodyText.includes(queryLower);
		}

		return titleMatch || excerptMatch || bodyMatch;
	});
}

// Export a dummy client for compatibility (used by image.ts)
export const client = {
	fetch: async () => {
		throw new Error('Sanity client.fetch is not available. Use the new PocketBase functions instead.');
	}
};