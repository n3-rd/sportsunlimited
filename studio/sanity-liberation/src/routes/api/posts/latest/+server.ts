import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pb } from '$lib/pocketbase';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const limit = parseInt(url.searchParams.get('limit') || '1');
		
		const records = await pb.collection('posts').getList(1, limit, {
			sort: '-created'
		});
		
		return json(records.items);
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

