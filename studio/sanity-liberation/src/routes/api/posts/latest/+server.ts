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
				(post as Record<string, unknown>).mainImageUrl = pb.files.getUrl(post, post.mainImage as string);
			}
			return post;
		});
		
		return json(postsWithImages);
	} catch (error: unknown) {
		console.error('Error fetching latest posts:', error);
		const message = error instanceof Error ? error.message : 'Failed to fetch latest posts';
		const status = error && typeof error === 'object' && 'status' in error ? (error.status as number) : 500;
		return json(
			{ error: message },
			{ status }
		);
	}
};

