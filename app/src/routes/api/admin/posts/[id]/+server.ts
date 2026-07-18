import { DB_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function PUT({ params, request, fetch }) {
	try {
		const formData = await request.formData();
		
		const res = await fetch(`${DB_URL}/api/collections/posts/records/${params.id}`, {
			method: 'PATCH', // PocketBase uses PATCH for updates
			body: formData
		});
		
		if (!res.ok) {
			const errorData = await res.text();
			console.error('Failed to update post in PocketBase:', errorData);
			return json({ error: 'Failed to update post' }, { status: 500 });
		}
		
		const data = await res.json();
		return json(data);
	} catch (e) {
		console.error('Error in update post API:', e);
		return json({ error: 'Failed to update post' }, { status: 500 });
	}
}

export async function DELETE({ params, fetch }) {
	try {
		const res = await fetch(`${DB_URL}/api/collections/posts/records/${params.id}`, {
			method: 'DELETE'
		});
		
		if (!res.ok) {
			return json({ error: 'Failed to delete post' }, { status: 500 });
		}
		
		return json({ success: true });
	} catch (e) {
		console.error('Error in delete post API:', e);
		return json({ error: 'Failed to delete post' }, { status: 500 });
	}
}
