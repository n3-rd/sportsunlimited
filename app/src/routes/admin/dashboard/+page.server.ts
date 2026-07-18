import { DB_URL } from '$env/static/private';

export async function load({ fetch }) {
	try {
		const res = await fetch(`${DB_URL}/api/collections/posts/records?sort=-created&perPage=5`);
		const data = await res.json();
		
		const recentPosts = (data.items || []).map((post: any) => {
			if (post.mainImage) {
				post.mainImageUrl = `${DB_URL}/api/files/posts/${post.id}/${post.mainImage}`;
			}
			return post;
		});

		// Fetch total counts using a lightweight request
		const allRes = await fetch(`${DB_URL}/api/collections/posts/records?perPage=1&fields=id,status`);
		const allData = await allRes.json();
		
		return { 
			recentPosts,
			totalPosts: allData.totalItems || 0
		};
	} catch (e) {
		console.error('Error loading dashboard data:', e);
		return { 
			recentPosts: [],
			totalPosts: 0
		};
	}
}
