import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pb } from '$lib/pocketbase';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const record = await pb.collection('posts').getOne(params.id);
		
		// Add image URL if mainImage exists
		if (record.mainImage) {
			(record as any).mainImageUrl = pb.files.getUrl(record, record.mainImage);
		}
		
		return json(record);
	} catch (error: any) {
		console.error('Error fetching post:', error);
		return json(
			{ error: error.message || 'Failed to fetch post' },
			{ status: error.status || 500 }
		);
	}
};

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const formData = await request.formData();
		
		// Process FormData similar to POST
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
		
		// Add tags as individual entries
		for (const tag of tags) {
			processedFormData.append('tags', tag);
		}
		
		// Add keywords as JSON string
		processedFormData.append('keywords', JSON.stringify(keywords));
		
		const record = await pb.collection('posts').update(params.id, processedFormData);
		
		return json(record);
	} catch (error: any) {
		console.error('Error updating post:', error);
		return json(
			{ error: error.message || 'Failed to update post' },
			{ status: error.status || 500 }
		);
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		await pb.collection('posts').delete(params.id);
		return json({ success: true });
	} catch (error: any) {
		console.error('Error deleting post:', error);
		return json(
			{ error: error.message || 'Failed to delete post' },
			{ status: error.status || 500 }
		);
	}
};
