import { error } from '@sveltejs/kit';
import { fetchClubData } from '$lib/npfl';
import { searchPosts } from '$lib/utils/sanity.server';

export async function load({ params, fetch }) {
	const slug = params.slug;

	const clubData = await fetchClubData(slug, fetch);

	if (!clubData.standing && clubData.totalMatches === 0) {
		throw error(404, `Club "${slug}" not found in current NPFL records`);
	}

	let relatedArticles: any[] = [];
	try {
		// Clean search term (e.g. "Enyimba", "Shooting Stars", "Rivers United")
		const searchTerm = clubData.clubName
			.replace(/\s*\(\s*3sc\s*\)\s*/i, '')
			.replace(/\b(fc|sports club)\b/gi, '')
			.trim();

		relatedArticles = await searchPosts(searchTerm);
	} catch (err) {
		console.warn('[club page] Error fetching related articles:', err);
		relatedArticles = [];
	}

	return {
		clubData,
		relatedArticles: relatedArticles.slice(0, 6)
	};
}
