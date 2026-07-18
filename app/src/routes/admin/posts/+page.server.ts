import { DB_URL } from '$env/static/private';

export async function load({ fetch }) {
	try {
		// Fetch directly from PocketBase for the admin
		const res = await fetch(`${DB_URL}/api/collections/posts/records?sort=-created&perPage=100`);
		const data = await res.json();
		
		const posts = (data.items || []).map((post: any) => {
			if (post.mainImage) {
				post.mainImageUrl = `${DB_URL}/api/files/posts/${post.id}/${post.mainImage}`;
			}
			return post;
		});

		return { posts };
	} catch (e) {
		console.error(e);
		return { posts: [] };
	}
}
