export const load = async ({ fetch }) => {
	try {
		const res = await fetch('/api/npfl/matchday/current');
		if (!res.ok) {
			return { fixtures: [], currentMatchday: null, error: 'Failed to fetch fixtures' };
		}
		const data = await res.json();
		return {
			fixtures: data.fixtures || [],
			currentMatchday: data.currentMatchday,
			source: data.source
		};
	} catch (error) {
		console.error('Error loading NPFL fixtures:', error);
		return { fixtures: [], currentMatchday: null, error: 'Failed to load fixtures' };
	}
};

