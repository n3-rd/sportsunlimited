import type { PortableTextBlock } from '@portabletext/types';
import { createClient } from '@sanity/client';
import type { ImageAsset, Slug } from '@sanity/types';
import groq from 'groq';

import { PUBLIC_SANITY_DATASET, PUBLIC_SANITY_PROJECT_ID } from '$env/static/public';

if (!PUBLIC_SANITY_PROJECT_ID || !PUBLIC_SANITY_DATASET) {
	throw new Error('Did you forget to run sanity init --env?');
}

export const client = createClient({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET,
	useCdn: false, // `false` if you want to ensure fresh data
	apiVersion: '2023-03-20' // date of setup
});

export async function getPosts(): Promise<Post[]> {
	return await client.fetch(
		groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`
	);
}

export async function getFeaturedPosts(limit: number = 5): Promise<Post[]> {
	return await client.fetch(
		groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc) [0...$limit]`,
		{ limit }
	);
}

export async function getRelatedPosts(currentSlug: string, title: string = '', excerpt: string = '', limit: number = 4): Promise<Post[]> {
	// Extract keywords from title and excerpt for text matching
	// Get significant words (longer than 3 chars, exclude common words)
	const commonWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use']);
	const combinedText = `${title} ${excerpt}`.toLowerCase();
	const words = combinedText
		.split(/\s+/)
		.filter(word => word.length > 3 && !commonWords.has(word))
		.map(word => word.replace(/[^\w]/g, ''))
		.filter(word => word.length > 3);
	const searchTerms = [...new Set(words)].slice(0, 3);
	
	if (!title || searchTerms.length === 0) {
		// Fallback to recent posts if no title available
		return await client.fetch(
			groq`*[_type == "post" && defined(slug.current) && slug.current != $currentSlug] | order(_createdAt desc) [0...$limit] {
				_type,
				_createdAt,
				title,
				slug,
				excerpt,
				mainImage,
				tags
			}`,
			{ currentSlug, limit }
		);
	}

	// Use GROQ's match operator to find posts with similar text
	// Create a search pattern from the most significant terms
	// Match against title or excerpt fields
	const searchPattern = searchTerms.join(' ');
	
	return await client.fetch(
		groq`*[_type == "post" && defined(slug.current) && slug.current != $currentSlug && (title match $searchPattern || excerpt match $searchPattern)] | order(_createdAt desc) [0...$limit] {
			_type,
			_createdAt,
			title,
			slug,
			excerpt,
			mainImage,
			tags
		}`,
		{ currentSlug, searchPattern: `*${searchPattern}*`, limit }
	);
}

export async function getPostsByTag(tag: string, limit: number = 6): Promise<Post[]> {
	return await client.fetch(
		groq`*[_type == "post" && defined(slug.current) && $tag in tags[]] | order(_createdAt desc) [0...$limit]`,
		{ tag, limit }
	);
}

export async function getTrendingPosts(limit: number = 5): Promise<Post[]> {
	// Get the most recent posts as trending (can be enhanced with view counts later)
	return await client.fetch(
		groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc) [0...$limit]`,
		{ limit }
	);
}

export async function getTags(): Promise<string[]> {
	return await client.fetch(groq`*[_type == "post" && defined(tags)][].tags[] | order(value asc)`);
}

export async function getTaggedPosts(tag: string): Promise<Post[]> {
	return await client.fetch(groq`*[_type == "post" && defined(tags) && $tag in tags[]]`, {
		tag: tag
	});
}
export async function getPost(slug: string): Promise<Post> {
	return await client.fetch(groq`*[_type == "post" && slug.current == $slug][0]`, {
		slug
	});
}

export async function searchPosts(query: string): Promise<Post[]> {
	return await client.fetch(
		groq`*[_type == "post" && defined(slug.current) && (title match $query || body[].children[].text match $query || title match "*$query*" || body[].children[].text match "*$query*")] | order(_createdAt desc)`,
		{
			query: query
		}
	);
}

export interface Post {
	_type: 'post';
	_createdAt: string;
	title?: string;
	slug: Slug;
	excerpt?: string;
	mainImage?: ImageAsset;
	tags?: string[];
	body: PortableTextBlock[];
}
