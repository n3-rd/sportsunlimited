import { DB_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request, fetch }) {
	try {
		const formData = await request.formData();
		
		const res = await fetch(`${DB_URL}/api/collections/posts/records`, {
			method: 'POST',
			body: formData
		});
		
		if (!res.ok) {
			const errorData = await res.text();
			console.error('Failed to create post in PocketBase:', errorData);
			return json({ error: 'Failed to create post' }, { status: 500 });
		}
		
		const data = await res.json();
		return json(data);
	} catch (e) {
		console.error('Error in create post API:', e);
		return json({ error: 'Failed to create post' }, { status: 500 });
	}
}
