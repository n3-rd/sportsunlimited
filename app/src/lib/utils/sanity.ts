import type { PortableTextBlock } from '@portabletext/types';
import { env } from '$env/dynamic/public';

// Base URL for Sanity Liberation API
const API_BASE_URL = env.PUBLIC_SANITY_LIBERATION_API_URL || 'http://localhost:5173/api';

export interface Post {
	_type: 'post';
	_createdAt: string;
	_updatedAt?: string;
	title?: string;
	slug: { current: string };
	excerpt?: string;
	mainImage?: {
		asset: {
			url: string;
		};
		mainImageUrl?: string; // For compatibility
	};
	tags?: string[];
	body: PortableTextBlock[];
}

interface ApiPost {
	id: string;
	created: string;
	updated?: string;
	title?: string;
	slug: string;
	excerpt?: string;
	mainImageUrl?: string;
	tags?: string[];
	body?: string | PortableTextBlock[];
}

/**
 * Transform API response to match Post interface
 */
function transformPost(apiPost: ApiPost): Post {
	// Parse body if it's a string
	let body: PortableTextBlock[] = [];
	if (apiPost.body) {
		if (typeof apiPost.body === 'string') {
			// Only try to parse if it looks like JSON (starts with [ or {)
			const trimmed = apiPost.body.trim();
			if ((trimmed.startsWith('[') || trimmed.startsWith('{')) && trimmed.length > 2) {
				try {
					const parsed = JSON.parse(apiPost.body);
					body = Array.isArray(parsed) ? parsed : [];
				} catch (e) {
					// If parsing fails, body is probably plain text or invalid JSON
					// Return empty array - we can't use plain text for PortableText
					body = [];
				}
			} else {
				// Plain text body - not valid PortableText, return empty array
				body = [];
			}
		} else if (Array.isArray(apiPost.body)) {
			body = apiPost.body;
		}
	}

	// Transform slug from string to object
	const slug = typeof apiPost.slug === 'string' 
		? { current: apiPost.slug }
		: apiPost.slug || { current: '' };

	// Transform image URL to mainImage structure
	// Components expect post.mainImage.asset structure
	let mainImage: Post['mainImage'] | undefined;
	if (apiPost.mainImageUrl) {
		mainImage = {
			asset: {
				url: apiPost.mainImageUrl
			},
			mainImageUrl: apiPost.mainImageUrl
		} as Post['mainImage'];
	}

	return {
		_type: 'post',
		_createdAt: apiPost.created || new Date().toISOString(),
		_updatedAt: apiPost.updated,
		title: apiPost.title,
		slug,
		excerpt: apiPost.excerpt,
		mainImage,
		tags: apiPost.tags || [],
		body
	};
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
	const url = `${API_BASE_URL}${endpoint}`;
	
	try {
		const response = await fetch(url, options);
		
		if (!response.ok) {
			const errorText = await response.text().catch(() => 'Unknown error');
			let errorMessage = `HTTP ${response.status}`;
			
			try {
				const errorJson = JSON.parse(errorText);
				errorMessage = errorJson.error || errorMessage;
			} catch {
				errorMessage = errorText || errorMessage;
			}
			
			if (response.status === 404) {
				throw new Error('Not found');
			}
			
			throw new Error(errorMessage);
		}
		
		return response.json();
	} catch (error) {
		// If it's already our custom error, re-throw it
		if (error instanceof Error && error.message !== 'fetch failed') {
			throw error;
		}
		// Network or connection error
		throw new Error(`Failed to fetch from API: ${error instanceof Error ? error.message : 'Unknown error'}. Make sure the Sanity Liberation API is running at ${url}`);
	}
}

export async function getPosts(): Promise<Post[]> {
	const data = await fetchAPI<{ items: ApiPost[] } | { error?: string }>('/posts?perPage=1000&sort=-created');
	
	// Check if response is an error object
	if (!data || typeof data !== 'object' || !('items' in data)) {
		if (data && typeof data === 'object' && 'error' in data) {
			throw new Error(data.error || 'Failed to fetch posts');
		}
		throw new Error('Invalid response format: expected object with items array');
	}
	
	return data.items.map(transformPost);
}

export async function getFeaturedPosts(limit = 5): Promise<Post[]> {
	const data = await fetchAPI<ApiPost[] | { error?: string }>('/posts/latest?limit=' + limit);
	
	// Check if response is an error object
	if (!Array.isArray(data)) {
		if (data && typeof data === 'object' && 'error' in data) {
			throw new Error(data.error || 'Failed to fetch featured posts');
		}
		throw new Error('Invalid response format: expected array');
	}
	
	return data.map(transformPost);
}

export async function getRelatedPosts(
	currentSlug: string, 
	title = '', 
	excerpt = '', 
	limit = 4
): Promise<Post[]> {
	// Get all posts and filter client-side for related posts
	// This is a simplified version - you may want to enhance with better matching logic
	const allPosts = await getPosts();
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
	const allPosts = await getPosts();
	const filtered = allPosts.filter(post => post.tags?.includes(tag));
	return filtered.slice(0, limit);
}

export async function getTrendingPosts(limit = 5): Promise<Post[]> {
	return getFeaturedPosts(limit);
}

export async function getTags(): Promise<string[]> {
	const posts = await getPosts();
	const allTags: string[] = [];
	posts.forEach(post => {
		if (post.tags) {
			allTags.push(...post.tags);
		}
	});
	return allTags;
}

export async function getTaggedPosts(tag: string): Promise<Post[]> {
	const allPosts = await getPosts();
	return allPosts.filter(post => post.tags?.includes(tag));
}

export async function getPost(slug: string): Promise<Post | null> {
	try {
		// Try to fetch by slug using query parameter
		const data = await fetchAPI<{ items: ApiPost[] } | { error?: string }>(`/posts?slug=${encodeURIComponent(slug)}`);
		
		// Check if response is an error object
		if (!data || typeof data !== 'object' || !('items' in data)) {
			if (data && typeof data === 'object' && 'error' in data) {
				return null;
			}
			return null;
		}
		
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
		throw new Error('Sanity client.fetch is not available. Use the new API functions instead.');
	}
};