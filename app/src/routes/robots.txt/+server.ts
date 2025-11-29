export async function GET() {
	const robots = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://www.sportsunlimited.ng/sitemap.xml
Sitemap: https://www.sportsunlimited.ng/rss.xml

# Disallow admin paths (if any)
Disallow: /admin/
Disallow: /api/private/

# Allow crawling of important pages
Allow: /post/
Allow: /tags/
Allow: /about
Allow: /contact
Allow: /privacy
Allow: /terms
Allow: /disclaimer

# Crawl-delay for respectful crawling
Crawl-delay: 1`;

	return new Response(robots, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
