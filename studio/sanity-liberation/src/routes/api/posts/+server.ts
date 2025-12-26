import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pb } from '$lib/pocketbase';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		
		// Build new FormData with properly formatted data
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
				// Keep files as-is in FormData
				processedFormData.append(key, value);
			} else {
				// Add all other fields
				processedFormData.append(key, value as string);
			}
		}
		
		// Add tags as array (PocketBase handles arrays in FormData)
		for (const tag of tags) {
			processedFormData.append('tags', tag);
		}
		
		// Add keywords as JSON string
		if (keywords.length > 0) {
			processedFormData.append('keywords', JSON.stringify(keywords));
		}
		
		// Handle timestamps - ensure they're in correct format
		const created = processedFormData.get('created');
		if (created && typeof created === 'string') {
			processedFormData.set('created', new Date(created).toISOString());
		}
		const updated = processedFormData.get('updated');
		if (updated && typeof updated === 'string') {
			processedFormData.set('updated', new Date(updated).toISOString());
		}
		
		// Log for debugging
		const hasFile = Array.from(processedFormData.entries()).some(([_, v]) => v instanceof File);
		console.log('Creating post with FormData, has file:', hasFile);
		
		// Create record using FormData directly (PocketBase handles multipart/form-data)
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
				post.mainImageUrl = pb.files.getURL(post, post.mainImage);
			}
			return post;
		});
		
		return json({
			...records,
			items: postsWithImages
		});
	} catch (error: any) {
		console.error('Error fetching posts:', error);
		
		// Handle PocketBase auto-cancellation errors
		if (error?.isAbort) {
			return json(
				{ error: 'Request was cancelled. Please ensure PocketBase is running.' },
				{ status: 503 }
			);
		}
		
		const status = error?.status && error.status > 0 ? Math.max(200, Math.min(599, error.status)) : 500;
		return json(
			{ error: error.message || 'Failed to fetch posts' },
			{ status }
		);
	}
};
