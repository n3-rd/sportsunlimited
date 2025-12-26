import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pb } from '$lib/pocketbase';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const limit = parseInt(url.searchParams.get('limit') || '1');
		
		const records = await pb.collection('posts').getList(1, limit, {
			sort: '-created'
		});
		
		// Add image URLs to each post
		const postsWithImages = records.items.map((post: Record<string, unknown>) => {
			if (post.mainImage) {
				(post as Record<string, unknown>).mainImageUrl = pb.files.getURL(post, post.mainImage as string);
			}
			return post;
		});
		
		return json(postsWithImages);
	} catch (error: unknown) {
		console.error('Error fetching latest posts:', error);
		
		// Handle PocketBase auto-cancellation errors
		if (error && typeof error === 'object' && 'isAbort' in error && (error as { isAbort: boolean }).isAbort) {
			return json(
				{ error: 'Request was cancelled. Please ensure PocketBase is running.' },
				{ status: 503 }
			);
		}
		
		const message = error instanceof Error ? error.message : 'Failed to fetch latest posts';
		let status = 500;
		if (error && typeof error === 'object' && 'status' in error) {
			const errorStatus = error.status as number;
			// Ensure status is in valid range (200-599)
			if (errorStatus > 0) {
				status = Math.max(200, Math.min(599, errorStatus));
			}
		}
		return json(
			{ error: message },
			{ status }
		);
	}
};

