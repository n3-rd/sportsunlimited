import { json } from '@sveltejs/kit';
import { searchPosts } from '$lib/utils/sanity.server';

export async function GET({ url }) {
    const query = url.searchParams.get('q') || '';

    if (query.length < 2) {
        return json([]);
    }

    try {
        const results = await searchPosts(query);
        return json(results);
    } catch (error) {
        console.error('API Search error:', error);
        return json({ error: 'Failed to search posts' }, { status: 500 });
    }
}
