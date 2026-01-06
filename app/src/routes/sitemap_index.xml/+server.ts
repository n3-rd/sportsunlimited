import { getPosts, getTags } from "$lib/utils/sanity.server";

export async function GET({ setHeaders }) {
	setHeaders({
		'Content-Type': 'application/xml; charset=utf-8',
		'Cache-Control': 'public, max-age=3600'
	});

	const site = 'https://www.sportsunlimited.ng';
	const now = new Date().toISOString().split('T')[0];

	const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<sitemap>
		<loc>${site}/sitemap.xml</loc>
		<lastmod>${now}</lastmod>
	</sitemap>
	<sitemap>
		<loc>${site}/rss.xml</loc>
		<lastmod>${now}</lastmod>
	</sitemap>
</sitemapindex>`;

	return new Response(sitemapIndex);
}













