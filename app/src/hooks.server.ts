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
	// Cache HTML pages for 1 hour
	else if (pathname.endsWith('.html') || !pathname.includes('.')) {
		response.headers.set(
			'Cache-Control',
			'public, max-age=3600, must-revalidate'
		);
	}
	// Cache API endpoints and data for 5 minutes, but not SvelteKit data requests
	else if (pathname.startsWith('/api/') || pathname.endsWith('.xml') || (pathname.endsWith('.json') && !pathname.includes('__data.json'))) {
		response.headers.set(
			'Cache-Control',
			'public, max-age=300, must-revalidate'
		);
	}
	// For SvelteKit data requests, ensure freshness
	else if (pathname.includes('__data.json')) {
		response.headers.set(
			'Cache-Control',
			'no-store, no-cache, must-revalidate, proxy-revalidate'
		);
	}

	// Add performance headers
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('X-XSS-Protection', '1; mode=block');

	return response;
};













