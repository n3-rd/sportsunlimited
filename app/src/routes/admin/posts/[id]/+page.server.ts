import { DB_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
	try {
		// Try fetching by ID first
		let res = await fetch(`${DB_URL}/api/collections/posts/records/${params.id}`);
		
		if (!res.ok) {
			// Fallback: try by slug
			res = await fetch(`${DB_URL}/api/collections/posts/records?filter=(slug="${params.id}")`);
			const data = await res.json();
			if (data.items && data.items.length > 0) {
				const post = data.items[0];
				if (post.mainImage) post.mainImageUrl = `${DB_URL}/api/files/posts/${post.id}/${post.mainImage}`;
				return { post };
			}
			throw error(404, 'Post not found');
		}

		const post = await res.json();
		if (post.mainImage) post.mainImageUrl = `${DB_URL}/api/files/posts/${post.id}/${post.mainImage}`;
		return { post };
	} catch (e) {
		console.error(e);
		throw error(404, 'Post not found');
	}
}
