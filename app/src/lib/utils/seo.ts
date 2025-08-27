/**
 * SEO utility functions for generating structured data and meta tags
 */

export interface SEOData {
	title: string;
	description: string;
	url: string;
	image?: string;
	type?: 'website' | 'article';
	keywords?: string;
	author?: string;
	publishedTime?: string;
	modifiedTime?: string;
	tags?: string[];
}

/**
 * Generate comprehensive meta tags for SEO
 */
export function generateMetaTags(data: SEOData): string {
	const {
		title,
		description,
		url,
		image = 'https://i.postimg.cc/CLVXPt7j/SU.png',
		type = 'website',
		keywords,
		author = 'Sports Unlimited',
		publishedTime,
		modifiedTime,
		tags
	} = data;

	let metaTags = `
		<title>${title}</title>
		<meta name="description" content="${description}" />
		
		<!-- Open Graph / Facebook -->
		<meta property="og:type" content="${type}" />
		<meta property="og:url" content="${url}" />
		<meta property="og:title" content="${title}" />
		<meta property="og:description" content="${description}" />
		<meta property="og:image" content="${image}" />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta property="og:image:alt" content="${title}" />
		<meta property="og:site_name" content="Sports Unlimited" />
		<meta property="og:locale" content="en_NG" />
		
		<!-- Twitter -->
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:url" content="${url}" />
		<meta name="twitter:title" content="${title}" />
		<meta name="twitter:description" content="${description}" />
		<meta name="twitter:image" content="${image}" />
		<meta name="twitter:image:alt" content="${title}" />
	`;

	// Add article-specific meta tags
	if (type === 'article') {
		metaTags += `
		<meta property="article:author" content="${author}" />
		<meta property="article:section" content="Sports" />`;
		
		if (publishedTime) {
			metaTags += `<meta property="article:published_time" content="${publishedTime}" />`;
		}
		
		if (modifiedTime) {
			metaTags += `<meta property="article:modified_time" content="${modifiedTime}" />`;
		}
		
		if (tags && tags.length > 0) {
			tags.forEach(tag => {
				metaTags += `<meta property="article:tag" content="${tag}" />`;
			});
		}
	}

	// Add additional SEO meta tags
	metaTags += `
		<meta name="author" content="${author}" />
		<meta name="publisher" content="Sports Unlimited" />
		<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
		<meta name="googlebot" content="index, follow" />
		<meta name="language" content="English" />
		<meta name="geo.region" content="NG" />
		<meta name="geo.country" content="Nigeria" />
		<link rel="canonical" href="${url}" />
	`;

	if (keywords) {
		metaTags += `<meta name="keywords" content="${keywords}" />`;
	}

	return metaTags.trim();
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
}): string {
	const {
		title,
		description,
		url,
		image = 'https://i.postimg.cc/CLVXPt7j/SU.png',
		author = 'Sports Unlimited',
		publishedTime,
		modifiedTime,
		keywords = 'Nigerian sports news'
	} = data;

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'NewsArticle',
		headline: title.replace(/"/g, '\\"'),
		description: description.replace(/"/g, '\\"'),
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
		articleSection: 'Sports',
		keywords: keywords,
		url: url
	};

	return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationStructuredData(): string {
	const structuredData = {
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
		sameAs: []
	};

	return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
}

/**
 * Generate JSON-LD structured data for website
 */
export function generateWebsiteStructuredData(): string {
	const structuredData = {
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

	return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
}

/**
 * Clean and escape text for safe HTML output
 */
export function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;');
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>): string {
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: item.url
		}))
	};

	return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
}
