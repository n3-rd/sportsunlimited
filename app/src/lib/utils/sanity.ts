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

export async function getRelatedPosts(currentSlug: string, tags: string[] = [], limit: number = 4): Promise<Post[]> {
	if (!tags || tags.length === 0) {
		return await client.fetch(
			groq`*[_type == "post" && defined(slug.current) && slug.current != $currentSlug] | order(_createdAt desc) [0...$limit]`,
			{ currentSlug, limit }
		);
	}
	return await client.fetch(
		groq`*[_type == "post" && defined(slug.current) && slug.current != $currentSlug && count((tags[])[@ in $tags]) > 0] | order(_createdAt desc) [0...$limit]`,
		{ currentSlug, tags, limit }
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
