export async function GET() {
	const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://www.sportsunlimited.ng/sitemap.xml

# Disallow admin paths (if any)
Disallow: /admin/
Disallow: /api/private/

# Allow crawling of important pages
Allow: /post/
Allow: /tags/
Allow: /about
Allow: /contact

# Crawl-delay for respectful crawling
Crawl-delay: 1`;

	return new Response(robots, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
