import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pb } from '$lib/pocketbase';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const record = await pb.collection('posts').getOne(params.id);
		
		// Add image URL if mainImage exists
		if (record.mainImage) {
			(record as any).mainImageUrl = pb.files.getURL(record, record.mainImage);
		}
		
		return json(record);
	} catch (error: any) {
		console.error('Error fetching post:', error);
		
		// Handle PocketBase auto-cancellation errors
		if (error?.isAbort) {
			return json(
				{ error: 'Request was cancelled. Please ensure PocketBase is running.' },
				{ status: 503 }
			);
		}
		
		const status = error?.status && error.status > 0 ? Math.max(200, Math.min(599, error.status)) : 500;
		return json(
			{ error: error.message || 'Failed to fetch post' },
			{ status }
		);
	}
};

export const PUT: RequestHandler = async ({ params, request }) => {
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
		
		// Add tags as array
		for (const tag of tags) {
			processedFormData.append('tags', tag);
		}
		
		// Add keywords as JSON string
		if (keywords.length > 0) {
			processedFormData.append('keywords', JSON.stringify(keywords));
		}
		
		// Handle timestamps
		const updated = processedFormData.get('updated');
		if (updated && typeof updated === 'string') {
			processedFormData.set('updated', new Date(updated).toISOString());
		}
		const created = processedFormData.get('created');
		if (created && typeof created === 'string') {
			processedFormData.set('created', new Date(created).toISOString());
		}
		
		// Update record using FormData directly
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
