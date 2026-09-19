import { json } from '@sveltejs/kit';
import { fetchNpflTable, NPFL_TABLE_URL } from '$lib/npfl';

export async function GET({ fetch }) {
	try {
		const table = await fetchNpflTable(fetch);

		const data = {
			ok: table.length > 0,
			count: table.length,
			table,
			source: NPFL_TABLE_URL,
			fetchedAt: new Date().toISOString()
		};

		return json(data, { headers: { 'cache-control': 'public, max-age=60' } });
	} catch (error: any) {
		console.error('[GET] /api/npfl/table error:', error);
		return json({ ok: false, error: error.message || 'Failed to fetch table' }, { status: 500 });
	}
}
