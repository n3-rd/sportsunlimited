/**
 * Image URL utilities for PocketBase (formerly Sanity Liberation API)
 */

export function urlFor(source: { url?: string; asset?: { url?: string; _ref?: string; _type?: string }; mainImageUrl?: string } | string | undefined) {
	if (!source) {
		return {
			width: (w: number) => urlBuilder('', { width: w }),
			height: (h: number) => urlBuilder('', { height: h }),
			quality: (q: number) => urlBuilder('', { quality: q }),
			format: (f: string) => urlBuilder('', { format: f }),
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

function urlBuilder(baseUrl: string, options: { width?: number; height?: number; quality?: number; format?: string } = {}) {
	return {
		width: (w: number) => urlBuilder(baseUrl, { ...options, width: w }),
		height: (h: number) => urlBuilder(baseUrl, { ...options, height: h }),
		quality: (q: number) => urlBuilder(baseUrl, { ...options, quality: q }),
		format: (f: string) => urlBuilder(baseUrl, { ...options, format: f }),
		url: () => {
			if (!baseUrl) return '';
			
			// PocketBase thumbnail support
			// Format: ?thumb=WxH or ?thumb=WxHc (center crop)
			if (options.width || options.height) {
				const w = options.width || 0;
				const h = options.height || 0;
				const thumb = `${w}x${h}`;
				
				// Handle both clean URLs and URLs that already have query params
				const urlObj = new URL(baseUrl);
				urlObj.searchParams.set('thumb', thumb);
				return urlObj.toString();
			}
			
			return baseUrl;
		}
	};
}

/**
 * Generate responsive image srcset for better performance
 */
export function getResponsiveImageSrcset(
	source: { url?: string; asset?: { url?: string; _ref?: string; _type?: string }; mainImageUrl?: string } | string | undefined,
	baseWidth = 800
): string {
	const baseUrl = typeof source === 'string' 
		? source 
		: source?.mainImageUrl || source?.url || source?.asset?.url || '';
	
	if (!baseUrl) return '';
	
	// Define a standard set of widths for responsive images
	const widths = [400, 600, 800, 1000, 1200];
	
	try {
		return widths
			.map(w => {
				const urlObj = new URL(baseUrl);
				// Using Wx0 for auto height maintaining aspect ratio
				urlObj.searchParams.set('thumb', `${w}x0`);
				return `${urlObj.toString()} ${w}w`;
			})
			.join(', ');
	} catch (e) {
		// Fallback for invalid URLs
		return `${baseUrl} ${baseWidth}w`;
	}
}

/**
 * Get optimized image URL with size and quality
 */
export function getOptimizedImageUrl(
	source: { url?: string; asset?: { url?: string; _ref?: string; _type?: string }; mainImageUrl?: string } | string | undefined,
	width: number,
	height?: number,
	quality = 85
): string {
	if (!source) return '';
	
	const baseUrl = typeof source === 'string' 
		? source 
		: source?.mainImageUrl || source?.url || source?.asset?.url || '';
	
	if (!baseUrl) return '';

	try {
		const urlObj = new URL(baseUrl);
		urlObj.searchParams.set('thumb', `${width}x${height || 0}`);
		return urlObj.toString();
	} catch (e) {
		return baseUrl;
	}
}