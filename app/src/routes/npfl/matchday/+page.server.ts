import { redirect } from '@sveltejs/kit';
import { fetchNpflFixtures, pickCurrentMatchday } from '$lib/npfl';

export async function load({ fetch }) {
	const fixtures = await fetchNpflFixtures(fetch);
	const current = pickCurrentMatchday(fixtures) || 1;
	throw redirect(307, `/npfl/matchday/${current}`);
}
