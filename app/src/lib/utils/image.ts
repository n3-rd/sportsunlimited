import imageUrlBuilder from '@sanity/image-url';
import type { Image } from '@sanity/types';
import { client } from './sanity';

const builder = imageUrlBuilder(client);

export function urlFor(source: Image) {
	return builder.image(source).format('webp');
}

/**
 * Generate responsive image srcset for better performance
 */
export function getResponsiveImageSrcset(source: Image, baseWidth: number = 800): string {
	if (!source) return '';
	
	const widths = [400, 600, 800, 1200, 1600];
	const srcset = widths
		.map(width => {
			const url = urlFor(source).width(width).quality(85).url();
			return `${url} ${width}w`;
		})
		.join(', ');
	
	return srcset;
}

/**
 * Get optimized image URL with size and quality
 */
export function getOptimizedImageUrl(
	source: Image,
	width: number,
	height?: number,
	quality: number = 85
): string {
	if (!source) return '';
	
	let image = urlFor(source).width(width).quality(quality);
	if (height) {
		image = image.height(height);
	}
	return image.url();
}
