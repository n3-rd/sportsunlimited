import { getPosts } from "$lib/utils/sanity.server";
import { urlFor } from "$lib/utils/image";

export async function GET({ setHeaders }) {
	setHeaders({
		'Content-Type': 'application/rss+xml; charset=utf-8',
		'Cache-Control': 'public, max-age=3600'
	});

	const site = 'https://www.sportsunlimited.ng';
	const siteName = 'Sports Unlimited';
	const siteDescription = "Nigeria's premier sports news website covering NPFL, Football, Basketball, Athletics, and more.";

	try {
		const posts = await getPosts();

		if (!posts || posts.length === 0) {
			return new Response("No posts found", {
				status: 404,
				headers: {
					'Content-Type': 'text/plain'
				}
			});
		}

		// Get latest 50 posts
		const latestPosts = posts.slice(0, 50);

		const escapeXml = (str: string | undefined): string => {
			if (!str) return '';
			return str
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&apos;');
		};

		const stripHtml = (html: string | undefined): string => {
			if (!html) return '';
			return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
		};

		const getExcerpt = (post: { excerpt?: string; body?: unknown }): string => {
			if (post.excerpt) {
				return stripHtml(post.excerpt);
			}
			if (post.body && Array.isArray(post.body) && post.body[0]) {
				const firstBlock = post.body[0] as { children?: Array<{ text?: string }> };
				if (firstBlock.children) {
					const text = firstBlock.children
						.map((child) => child.text || '')
						.join(' ')
						.substring(0, 300);
					return text + (text.length >= 300 ? '...' : '');
				}
			}
			return '';
		};

		const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
	<channel>
		<title>${escapeXml(siteName)}</title>
		<link>${site}</link>
		<description>${escapeXml(siteDescription)}</description>
		<language>en-NG</language>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		<pubDate>${new Date().toUTCString()}</pubDate>
		<ttl>60</ttl>
		<atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml"/>
		<image>
			<url>https://i.postimg.cc/CLVXPt7j/SU.png</url>
			<title>${escapeXml(siteName)}</title>
			<link>${site}</link>
		</image>
		${latestPosts.map(post => {
			const pubDate = new Date(post._createdAt).toUTCString();
			const link = `${site}/post/${post.slug.current}`;
			const title = escapeXml(post.title || 'Untitled');
			const description = escapeXml(getExcerpt(post));
			const imageUrl = post.mainImage 
				? urlFor(post.mainImage).width(1200).height(630).url() 
				: 'https://i.postimg.cc/CLVXPt7j/SU.png';
			const author = 'Sports Unlimited';
			const category = post.tags && post.tags[0] ? escapeXml(post.tags[0]) : 'Sports';

			return `
		<item>
			<title>${title}</title>
			<link>${link}</link>
			<guid isPermaLink="true">${link}</guid>
			<description>${description}</description>
			<content:encoded><![CDATA[
				${post.excerpt ? `<p>${post.excerpt}</p>` : ''}
				${post.mainImage ? `<img src="${imageUrl}" alt="${title}" />` : ''}
				<p><a href="${link}">Read full article</a></p>
			]]></content:encoded>
			<pubDate>${pubDate}</pubDate>
			<dc:creator>${escapeXml(author)}</dc:creator>
			<category>${category}</category>
			${post.tags ? post.tags.map((tag: string) => `<category>${escapeXml(tag)}</category>`).join('\n\t\t\t') : ''}
			<media:content url="${imageUrl}" type="image/jpeg" medium="image">
				<media:title>${title}</media:title>
				<media:description>${description}</media:description>
			</media:content>
		</item>`;
		}).join('')}
	</channel>
</rss>`;

		return new Response(rss);
	} catch (error) {
		console.error('RSS feed generation error:', error);
		return new Response("Internal Server Error", {
			status: 500,
			headers: {
				'Content-Type': 'text/plain'
			}
		});
	}
}

