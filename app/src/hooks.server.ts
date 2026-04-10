import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Add caching headers for static assets
	const pathname = event.url.pathname;

	// Cache static assets (images, fonts, etc.) for 1 year
	if (
		pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|eot|css|js)$/i)
	) {
		response.headers.set(
			'Cache-Control',
			'public, max-age=31536000, immutable'
		);
	}
	// Improved caching strategy for better performance
	// Home page and post pages: cache for 1 minute on CDN, but check frequently
	if (pathname === '/' || pathname.startsWith('/post/')) {
		response.headers.set(
			'Cache-Control',
			'public, max-age=10, s-maxage=60, stale-while-revalidate=3600'
		);
	}
	// Cache other HTML pages for 1 hour
	else if (pathname.endsWith('.html') || !pathname.includes('.')) {
		response.headers.set(
			'Cache-Control',
			'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
		);
	}
	// For SvelteKit data requests, allow short caching
	else if (pathname.includes('__data.json')) {
		response.headers.set(
			'Cache-Control',
			'public, max-age=10, s-maxage=60, stale-while-revalidate=3600'
		);
	}

	// Add performance headers
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('X-XSS-Protection', '1; mode=block');

	return response;
};













