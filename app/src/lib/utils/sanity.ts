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
