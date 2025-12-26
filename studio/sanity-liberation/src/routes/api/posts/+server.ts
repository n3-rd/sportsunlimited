import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pb } from '$lib/pocketbase';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		
		// PocketBase can accept FormData directly, but we need to handle arrays properly
		// Convert tags array and keywords JSON
		const processedFormData = new FormData();
		const tags: string[] = [];
		let keywords: string[] = [];
		
		for (const [key, value] of formData.entries()) {
			if (key === 'tags') {
				tags.push(value as string);
			} else if (key === 'keywords') {
				try {
					keywords = JSON.parse(value as string);
				} catch {
					keywords = [];
				}
			} else if (value instanceof File) {
				processedFormData.append(key, value);
			} else {
				processedFormData.append(key, value);
			}
		}
		
		// Add tags as individual entries (PocketBase expects multiple entries with same key for arrays)
		for (const tag of tags) {
			processedFormData.append('tags', tag);
		}
		
		// Add keywords as JSON string
		processedFormData.append('keywords', JSON.stringify(keywords));
		
		const record = await pb.collection('posts').create(processedFormData);
		
		return json(record);
	} catch (error: any) {
		console.error('Error creating post:', error);
		return json(
			{ error: error.message || 'Failed to create post' },
			{ status: error.status || 500 }
		);
	}
};

export const GET: RequestHandler = async ({ url }) => {
	try {
		const page = parseInt(url.searchParams.get('page') || '1');
		const perPage = parseInt(url.searchParams.get('perPage') || '50');
		const sort = url.searchParams.get('sort') || '-created';
		const slug = url.searchParams.get('slug');
		
		let filter = '';
		if (slug) {
			filter = `slug="${slug}"`;
		}
		
		const records = await pb.collection('posts').getList(page, perPage, {
			sort,
			...(filter && { filter })
		});
		
		// Add image URLs to each post
		const postsWithImages = records.items.map((post: any) => {
			if (post.mainImage) {
				post.mainImageUrl = pb.files.getUrl(post, post.mainImage);
			}
			return post;
		});
		
		return json({
			...records,
			items: postsWithImages
		});
	} catch (error: any) {
		console.error('Error fetching posts:', error);
		return json(
			{ error: error.message || 'Failed to fetch posts' },
			{ status: error.status || 500 }
		);
	}
};
