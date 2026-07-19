import { DB_URL } from '$env/static/private';

export async function load({ fetch, url }) {
	const page = url.searchParams.get('page') || '1';
	const perPage = '20';

	try {
		// Fetch directly from PocketBase for the admin
		const res = await fetch(`${DB_URL}/api/collections/posts/records?sort=-created&page=${page}&perPage=${perPage}`);
		const data = await res.json();
		
		const posts = (data.items || []).map((post: any) => {
			if (post.mainImage) {
				post.mainImageUrl = `${DB_URL}/api/files/posts/${post.id}/${post.mainImage}`;
			}
			return post;
		});

		return { 
			posts,
			pagination: {
				page: data.page || 1,
				perPage: data.perPage || 20,
				totalItems: data.totalItems || 0,
				totalPages: data.totalPages || 1
			}
		};
	} catch (e) {
		console.error(e);
		return { posts: [], pagination: { page: 1, perPage: 20, totalItems: 0, totalPages: 1 } };
	}
}
