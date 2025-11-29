<script lang="ts">
	import { PortableText } from '@portabletext/svelte';
	import { formatDate, calculateReadingTime } from '$lib/utils/index';
	import { urlFor, getResponsiveImageSrcset } from '$lib/utils/image';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { Clock, Copy, Check } from 'svelte-radix';

	import RelatedPosts from '../../../components/RelatedPosts.svelte';
	import Breadcrumbs from '../../../components/Breadcrumbs.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Calculate reading time
	const readingTime = calculateReadingTime(data.body || []);
	
	// Reading progress
	let readingProgress = $state(0);
	let showBackToTop = $state(false);
	let linkCopied = $state(false);

	const articleUrl = `https://www.sportsunlimited.ng/post/${data.slug.current}`;

	function copyLink() {
		navigator.clipboard.writeText(articleUrl).then(() => {
			linkCopied = true;
			setTimeout(() => {
				linkCopied = false;
			}, 2000);
		});
	}

	onMount(() => {
		// Reading progress calculation
		function updateReadingProgress() {
			const article = document.querySelector('.post__content');
			if (!article) return;

			const articleTop = article.getBoundingClientRect().top + window.scrollY;
			const articleHeight = article.offsetHeight;
			const windowHeight = window.innerHeight;
			const scrollPosition = window.scrollY;

			if (scrollPosition >= articleTop - 100) {
				const scrolled = scrollPosition - articleTop + 100;
				const progress = Math.min((scrolled / (articleHeight - windowHeight + 200)) * 100, 100);
				readingProgress = Math.max(0, progress);
			} else {
				readingProgress = 0;
			}

			// Show back to top button after scrolling down
			showBackToTop = window.scrollY > 500;
		}

		window.addEventListener('scroll', updateReadingProgress);
		updateReadingProgress();

		return () => {
			window.removeEventListener('scroll', updateReadingProgress);
		};
	});

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	const socialInfo = [
		{
			name: 'Whatsapp',
			url: `https://wa.me/?text= read this article ${data.title} ${articleUrl}`,
			icon: '/whatsapp.svg',
		},
		{
			name: 'Facebook',
			url: `https://www.facebook.com/sharer/sharer.php?u=${articleUrl}`,
			icon: '/facebook.svg',
		},
		{
			name: 'X',
			url: `https://x.com/intent/tweet?text=${encodeURIComponent(data.title)}&url=${articleUrl}`,
			icon: '/x.svg',
		},
		{
			name: 'Email',
			url: `mailto:?subject=${encodeURIComponent(data.title)}&body=${encodeURIComponent(`Read this article: ${data.title} ${articleUrl}`)}`,
			icon: '/mail.svg',
		}
	];
</script>
<svelte:head>
	<title>{data.title} | Sports Unlimited</title>
	<meta name="description" content={data.excerpt || data.title} />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="article" />
	<meta property="og:url" content={`https://www.sportsunlimited.ng/post/${data.slug.current}`} />
	<meta property="og:title" content={data.title} />
	<meta property="og:description" content={data.excerpt || data.title} />
	<meta property="og:image" content={data.mainImage ? urlFor(data.mainImage).url() : 'https://i.postimg.cc/CLVXPt7j/SU.png'} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={data.title} />
	<meta property="og:site_name" content="Sports Unlimited" />
	<meta property="og:locale" content="en_NG" />
	<meta property="article:author" content="Sports Unlimited" />
	<meta property="article:published_time" content={data._createdAt} />
	<meta property="article:modified_time" content={data._updatedAt || data._createdAt} />
	<meta property="article:section" content="Sports" />
	{#if data.tags}
		{#each data.tags as tag}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}
	
	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={`https://www.sportsunlimited.ng/post/${data.slug.current}`} />
	<meta name="twitter:title" content={data.title} />
	<meta name="twitter:description" content={data.excerpt || data.title} />
	<meta name="twitter:image" content={data.mainImage ? urlFor(data.mainImage).url() : 'https://i.postimg.cc/CLVXPt7j/SU.png'} />
	<meta name="twitter:image:alt" content={data.title} />
	
	<!-- Additional SEO meta tags -->
	<meta name="keywords" content={data.tags ? data.tags.join(', ') + ', Nigerian sports news, sports unlimited' : 'Nigerian sports news, sports unlimited'} />
	<meta name="author" content="Sports Unlimited" />
	<meta name="publisher" content="Sports Unlimited" />
	<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	<meta name="googlebot" content="index, follow" />
	<meta name="language" content="English" />
	<meta name="geo.region" content="NG" />
	<meta name="geo.country" content="Nigeria" />
	
	<!-- Canonical URL -->
	<link rel="canonical" href={`https://www.sportsunlimited.ng/post/${data.slug.current}`} />
	
	<!-- Structured Data for Article -->
	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "NewsArticle",
		"headline": "${data.title.replace(/"/g, '\\"')}",
		"description": "${(data.excerpt || data.title).replace(/"/g, '\\"')}",
		"image": {
			"@type": "ImageObject",
			"url": "${data.mainImage ? urlFor(data.mainImage).url() : 'https://i.postimg.cc/CLVXPt7j/SU.png'}",
			"width": 1200,
			"height": 630
		},
		"author": {
			"@type": "Organization",
			"name": "Sports Unlimited",
			"url": "https://www.sportsunlimited.ng"
		},
		"publisher": {
			"@type": "Organization",
			"name": "Sports Unlimited",
			"logo": {
				"@type": "ImageObject",
				"url": "https://i.postimg.cc/CLVXPt7j/SU.png",
				"width": 600,
				"height": 60
			}
		},
		"datePublished": "${data._createdAt}",
		"dateModified": "${data._updatedAt || data._createdAt}",
		"mainEntityOfPage": {
			"@type": "WebPage",
			"@id": "https://www.sportsunlimited.ng/post/${data.slug.current}"
		},
		"articleSection": "Sports",
		"keywords": "${data.tags ? data.tags.join(', ') : 'Nigerian sports news'}",
		"url": "https://www.sportsunlimited.ng/post/${data.slug.current}",
		"wordCount": "${data.body ? JSON.stringify(data.body).split(' ').length : 0}"
	}
	</script>`}
	
	<!-- Breadcrumb Structured Data -->
	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		"itemListElement": [
			{
				"@type": "ListItem",
				"position": 1,
				"name": "Home",
				"item": "https://www.sportsunlimited.ng/"
			},
			{
				"@type": "ListItem",
				"position": 2,
				"name": "Articles",
				"item": "https://www.sportsunlimited.ng/"
			},
			{
				"@type": "ListItem",
				"position": 3,
				"name": "${data.title.replace(/"/g, '\\"')}",
				"item": "https://www.sportsunlimited.ng/post/${data.slug.current}"
			}
		]
	}
	</script>`}
</svelte:head>

<!-- Reading Progress Bar -->
<div class="reading-progress-bar fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
	<div 
		class="reading-progress h-full bg-red-600 transition-all duration-150"
		style="width: {readingProgress}%"
	></div>
</div>

<!-- Breadcrumbs -->
<Breadcrumbs 
	items={[
		{ name: 'Home', url: '/' },
		{ name: 'Articles', url: '/' },
		{ name: data.title, url: `/post/${data.slug.current}` }
	]} 
/>

<!-- Article Content -->
<section class="post py-7">
	{#if data.mainImage}
		<img
			class="post__cover
			object-cover object-top w-full h-[30rem] mb-8 rounded-lg shadow-lg
			"
			src={urlFor(data.mainImage).width(1200).height(630).quality(90).url()}
			srcset={getResponsiveImageSrcset(data.mainImage, 1200)}
			sizes="(max-width: 768px) 100vw, 1200px"
			alt="Cover image for {data.title}"
			loading="eager"
			fetchpriority="high"
		/>
	{:else}
		<div class="post__cover--none"></div>
	{/if}
	<div class="post__container max-w-4xl mx-auto">
		<header class="post-header mb-6">
			<h1 class="post__title text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">{data.title}</h1>
			{#if data.excerpt}
				<p class="post__excerpt text-xl text-gray-600 mb-4 leading-relaxed">{data.excerpt}</p>
			{/if}

			<div class="post-meta flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
				<span class="post__date">
					{formatDate(data._createdAt)}
				</span>
				<span class="separator">•</span>
				<div class="reading-time flex items-center gap-1.5">
					<Clock size="16" />
					<span>{readingTime} min read</span>
				</div>
				{#if data.tags && data.tags.length > 0}
					<span class="separator">•</span>
					<div class="post__tags flex flex-wrap gap-2">
						{#each data.tags as tag}
							<a href={`/tags/${tag}`} class="post__tag inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-xs font-medium transition-colors">
								{tag}
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<div class="share py-4 border-t border-b border-gray-200 my-6">
				<div class="flex flex-col md:flex-row md:items-center gap-4">
					<div class="share-label font-semibold text-gray-900">
						Share this article:
					</div>
					<div class="share-buttons flex gap-3 items-center">
						{#each socialInfo as { name, url, icon }}
							<a href={url} target="_blank" rel="noopener noreferrer" class="share-button inline-block hover:opacity-80 transition-opacity" aria-label={`Share on ${name}`}>
								<img src={icon} alt={name} class="h-8 w-8" />
							</a>
						{/each}
						<button
							onclick={copyLink}
							class="copy-link-button flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
							aria-label="Copy link"
						>
							{#if linkCopied}
								<Check size="16" class="text-green-600" />
								<span class="text-green-600">Copied!</span>
							{:else}
								<Copy size="16" />
								<span>Copy link</span>
							{/if}
						</button>
					</div>
				</div>
			</div>
		</header>

		<div class="post__content prose prose-lg max-w-none">
			<PortableText value={data.body} components={{}} />
		</div>
	</div>
</section>

<!-- Back to Top Button -->
{#if showBackToTop}
	<button
		onclick={scrollToTop}
		class="back-to-top fixed bottom-8 right-8 z-40 bg-gray-900 hover:bg-gray-800 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
		aria-label="Back to top"
	>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
			<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
		</svg>
	</button>
{/if}

<!-- Related Posts Section -->
{#if data.relatedPosts && data.relatedPosts.length > 0}
	<section class="related-posts py-12 bg-gray-50 mt-12">
		<div class="container max-w-6xl mx-auto">
			<h2 class="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
			<RelatedPosts posts={data.relatedPosts} />
		</div>
	</section>
{/if}


<style>
	:root {
		--space-0: 0;
	--space-1: 4px;
	--space-2: 8px;
	--space-3: 12px;
	--space-4: 20px;
	--space-5: 32px;
	--space-6: 52px;
	--space-7: 84px;
	--space-8: 136px;
	--space-9: 220px;
		--font-family-sans: Inter;
	--font-family-serif: PT Serif;
	--font-family-mono: IMB Plex Mono;

	--font-size-0: 12px;
	--font-size-1: 14px;
	--font-size-2: 16px;
	--font-size-3: 18px;
	--font-size-4: 20px;
	--font-size-5: 24px;
	--font-size-6: 30px;
	--font-size-7: 36px;
	--font-size-8: 48px;
	--font-size-9: 60px;
	--font-size-10: 72px;
	--line-height-0: 16px;
	--line-height-1: 20px;
	--line-height-2: 24px;
	--line-height-3: 28px;
	--line-height-4: 28px;
	--line-height-5: 32px;
	--line-height-6: 36px;
	--line-height-7: 40px;
	--line-height-8: 48px;
	--line-height-9: 60px;
	--line-height-10: 72px;
	--line-height-11: 96px;
	--line-height-12: 128px;

	--white: #fff;
	--black: #101112;
	--gray-200: #ced2d9;
	--gray-600: #6e7683;
	--blue-600: #1e61cd;
	--magenta-100: #f9d7eb;

	--max-width-0: 320px;
	--max-width-1: 768px;
	}
.post .post__content {
	font-family: var(--font-family-serif);
	font-weight: 400;
	font-size: var(--font-size-4);
	line-height: var(--line-height-5);
	letter-spacing: -0.02em;
	margin-top: var(--space-6);

	/* Targeting tags in PortableText */
}

.post .post__content blockquote {
	border-left: 5px solid var(--black);
	padding-left: var(--space-3);
	margin-left: var(--space-4);
}

.post .post__content a {
	color: var(--blue-600);
	text-decoration: none;
}

/* Reading Progress Bar */
.reading-progress-bar {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 3px;
	background-color: rgba(229, 231, 235, 0.5);
	z-index: 50;
}

.reading-progress {
	height: 100%;
	background: linear-gradient(90deg, #ef4444, #dc2626);
	transition: width 0.1s ease-out;
}

/* Back to Top Button */
.back-to-top {
	animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* Print Styles */
@media print {
	.navigation,
	.reading-progress-bar,
	.back-to-top,
	.share,
	.related-posts,
	footer,
	aside {
		display: none !important;
	}

	.post {
		max-width: 100%;
		padding: 0;
	}

	.post__cover {
		max-height: 300px;
	}

	.post__content {
		font-size: 12pt;
		line-height: 1.6;
		color: #000;
	}

	.post__content a {
		color: #000;
		text-decoration: underline;
	}

	.post__content a::after {
		content: " (" attr(href) ")";
		font-size: 10pt;
		color: #666;
	}

	.post__title {
		font-size: 24pt;
		page-break-after: avoid;
	}

	.post__content h2,
	.post__content h3 {
		page-break-after: avoid;
	}

	.post__content img {
		max-width: 100%;
		page-break-inside: avoid;
	}

	.post__content p,
	.post__content li {
		orphans: 3;
		widows: 3;
	}

	@page {
		margin: 2cm;
	}
}
</style>