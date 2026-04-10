/**
 * SEO utility functions for generating structured data and meta tags
 */

export interface SEOData {
	title: string;
	description: string;
	url: string;
	image?: string;
	type?: 'website' | 'article' | 'profile';
	keywords?: string;
	author?: string;
	publishedTime?: string;
	modifiedTime?: string;
	tags?: string[];
}

/**
 * Clean and escape text for safe HTML output
 */
export function escapeHtml(text: string): string {
	if (!text) return '';
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;');
}

/**
 * Generate JSON-LD structured data for articles
 */
export function generateArticleStructuredData(data: {
	title: string;
	description: string;
	url: string;
	image?: string;
	author?: string;
	publishedTime: string;
	modifiedTime?: string;
	keywords?: string;
	section?: string;
}): any {
	const {
		title,
		description,
		url,
		image = 'https://i.postimg.cc/CLVXPt7j/SU.png',
		author = 'Sports Unlimited',
		publishedTime,
		modifiedTime,
		keywords = 'Nigerian sports news',
		section = 'Sports'
	} = data;

	return {
		'@context': 'https://schema.org',
		'@type': 'NewsArticle',
		headline: title,
		description: description,
		image: {
			'@type': 'ImageObject',
			url: image,
			width: 1200,
			height: 630
		},
		author: {
			'@type': 'Organization',
			name: author,
			url: 'https://www.sportsunlimited.ng'
		},
		publisher: {
			'@type': 'Organization',
			name: 'Sports Unlimited',
			logo: {
				'@type': 'ImageObject',
				url: 'https://i.postimg.cc/CLVXPt7j/SU.png',
				width: 600,
				height: 60
			}
		},
		datePublished: publishedTime,
		dateModified: modifiedTime || publishedTime,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': url
		},
		articleSection: section,
		keywords: keywords,
		url: url
	};
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationStructuredData(): any {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Sports Unlimited',
		url: 'https://www.sportsunlimited.ng',
		logo: 'https://i.postimg.cc/CLVXPt7j/SU.png',
		description: "Nigeria's premier sports news website covering NPFL, Football, Basketball, Athletics and more.",
		address: {
			'@type': 'PostalAddress',
			addressCountry: 'Nigeria'
		},
		sameAs: [
			'https://twitter.com/SportsUnlimNG',
			'https://facebook.com/SportsUnlimitedNG'
		]
	};
}

/**
 * Generate JSON-LD structured data for website
 */
export function generateWebsiteStructuredData(): any {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Sports Unlimited',
		url: 'https://www.sportsunlimited.ng',
		description: 'Get the latest Nigerian sports news on Football, NPFL, Basketball, Athletics, and more.',
		publisher: {
			'@type': 'Organization',
			name: 'Sports Unlimited'
		},
		potentialAction: {
			'@type': 'SearchAction',
			target: 'https://www.sportsunlimited.ng/search?q={search_term_string}',
			'query-input': 'required name=search_term_string'
		}
	};
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>): any {
	const baseUrl = 'https://www.sportsunlimited.ng';
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => {
			let absoluteUrl = item.url;
			if (absoluteUrl.startsWith('/')) {
				absoluteUrl = `${baseUrl}${absoluteUrl === '/' ? '' : absoluteUrl}`;
			} else if (!absoluteUrl.startsWith('http')) {
				absoluteUrl = `${baseUrl}/${absoluteUrl}`;
			}

			return {
				'@type': 'ListItem',
				position: index + 1,
				name: item.name,
				item: absoluteUrl
			};
		})
	};
}

/**
 * Generate CollectionPage structured data
 */
export function generateCollectionPageStructuredData(data: {
	name: string;
	description: string;
	url: string;
	posts: any[];
}): any {
	const baseUrl = 'https://www.sportsunlimited.ng';
	return {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: data.name,
		description: data.description,
		url: data.url,
		mainEntity: {
			'@type': 'ItemList',
			numberOfItems: data.posts.length,
			itemListElement: data.posts.map((post, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': 'NewsArticle',
					headline: post.title,
					url: `${baseUrl}/post/${post.slug?.current}`,
					datePublished: post._createdAt,
					image: post.mainImage ? post.mainImage : 'https://i.postimg.cc/CLVXPt7j/SU.png'
				}
			}))
		}
	};
}
