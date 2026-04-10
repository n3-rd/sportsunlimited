import { getPosts } from "$lib/utils/sanity.server";

export const prerender = false;

const site = 'https://www.sportsunlimited.ng';

export async function GET({ setHeaders }) {
	setHeaders({
		'Content-Type': 'application/xml',
		'Cache-Control': 'public, max-age=3600'
	});

	let posts: any[] = [];
	try {
		// Fetch 100 latest posts
		posts = await getPosts(100);
	} catch (error) {
		console.error('Sitemap news generation error:', error);
		return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
	}

	// Filter posts from the last 2 days (48 hours)
	const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
	const recentPosts = posts.filter(post => new Date(post._createdAt) >= twoDaysAgo);

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${recentPosts.map(post => {
	const escapeXml = (str: string | undefined) => {
		if (str == null || str === '') return '';
		return String(str)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');
	};

	return `<url>
    <loc>${site}/post/${post.slug.current}</loc>
    <news:news>
        <news:publication>
            <news:name>Sports Unlimited</news:name>
            <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${new Date(post._createdAt).toISOString()}</news:publication_date>
        <news:title>${escapeXml(post.title)}</news:title>
    </news:news>
</url>`;
}).join('\n')}
</urlset>`;

	return new Response(sitemap);
}
