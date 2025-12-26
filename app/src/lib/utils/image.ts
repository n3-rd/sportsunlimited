/**
 * Image URL utilities for Sanity Liberation API
 * The API provides direct image URLs, so we handle them differently than Sanity
 */

export function urlFor(source: { url?: string; asset?: { url?: string; _ref?: string; _type?: string }; mainImageUrl?: string } | string | undefined) {
	if (!source) {
		return {
			width: () => urlBuilder(''),
			height: () => urlBuilder(''),
			quality: () => urlBuilder(''),
			format: () => urlBuilder(''),
			url: () => ''
		};
	}

	// Extract URL from various formats
	let url = '';
	if (typeof source === 'string') {
		url = source;
	} else if (source.mainImageUrl) {
		url = source.mainImageUrl;
	} else if (source.url) {
		url = source.url;
	} else if (source.asset?.url) {
		url = source.asset.url;
	}

	return urlBuilder(url);
}

function urlBuilder(baseUrl: string) {
	return {
		width: (w: number) => urlBuilder(baseUrl),
		height: (h: number) => urlBuilder(baseUrl),
		quality: (q: number) => urlBuilder(baseUrl),
		format: (f: string) => urlBuilder(baseUrl),
		url: () => baseUrl
	};
}

/**
 * Generate responsive image srcset for better performance
 * Note: API provides direct URLs, so we can't resize on the fly
 * This returns the same URL for all widths
 */
export function getResponsiveImageSrcset(
	source: { url?: string; asset?: { url?: string; _ref?: string; _type?: string }; mainImageUrl?: string } | string | undefined,
	baseWidth = 800
): string {
	const url = typeof source === 'string' 
		? source 
		: source?.mainImageUrl || source?.url || source?.asset?.url || '';
	
	if (!url) return '';
	
	// Return the same URL since we can't resize on the API side
	// Browsers will still use srcset hints for caching
	return `${url} ${baseWidth}w`;
}

/**
 * Get optimized image URL with size and quality
 * Note: API provides direct URLs, so we just return the URL as-is
 */
export function getOptimizedImageUrl(
	source: { url?: string; asset?: { url?: string; _ref?: string; _type?: string }; mainImageUrl?: string } | string | undefined,
	width: number,
	height?: number,
	quality = 85
): string {
	if (!source) return '';
	
	const url = typeof source === 'string' 
		? source 
		: source?.mainImageUrl || source?.url || source?.asset?.url || '';
	
	return url;
}