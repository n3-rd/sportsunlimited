export const load = async ({ fetch }) => {
	try {
		const res = await fetch('/api/npfl/table');
		if (!res.ok) {
			return { table: [], error: 'Failed to fetch table' };
		}
		const data = await res.json();
		return {
			table: data.table || [],
			source: data.source
		};
	} catch (error) {
		console.error('Error loading NPFL table:', error);
		return { table: [], error: 'Failed to load table' };
	}
};

