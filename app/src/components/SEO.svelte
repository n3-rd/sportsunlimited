<script lang="ts">
	import { page } from '$app/stores';

	export let title: string;
	export let description: string;
	export let type: 'website' | 'article' | 'profile' = 'website';
	export let image: string = 'https://i.postimg.cc/CLVXPt7j/SU.png';
	export let imageAlt: string = title;
	export let keywords: string =
		'Nigerian sports news, NPFL, football Nigeria, basketball Nigeria, athletics Nigeria, sports unlimited, Nigeria league';

	// Article specifics
	export let article:
		| {
				publishedTime?: string;
				modifiedTime?: string;
				author?: string;
				section?: string;
				tags?: string[];
		  }
		| undefined = undefined;

	// OpenGraph specifics
	export let siteName: string = 'Sports Unlimited';
	export let locale: string = 'en_NG';
	export let twitterCard: 'summary' | 'summary_large_image' = 'summary_large_image';
	export let twitterSite: string = '@sportsung'; // replace with actual handle if available
	export let twitterCreator: string = '@sportsung'; // replace with actual handle if available

	// Schema.org Structured Data
	export let schemaorg: any | undefined = undefined;

	// Google Verification
	export let googleSiteVerification: string | undefined = undefined;

	const canonicalUrl = $page.url.origin + $page.url.pathname;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />

	{#if googleSiteVerification}
		<meta name="google-site-verification" content={googleSiteVerification} />
	{/if}

	<!-- Canonical URL -->
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:image:alt" content={imageAlt} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content={locale} />

	<!-- Twitter -->
	<meta name="twitter:card" content={twitterCard} />
	<meta name="twitter:url" content={canonicalUrl} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={imageAlt} />
	<meta name="twitter:site" content={twitterSite} />
	<meta name="twitter:creator" content={twitterCreator} />

	{#if type === 'article' && article}
		{#if article.publishedTime}
			<meta property="article:published_time" content={article.publishedTime} />
		{/if}
		{#if article.modifiedTime}
			<meta property="article:modified_time" content={article.modifiedTime} />
		{/if}
		{#if article.author}
			<meta property="article:author" content={article.author} />
		{/if}
		{#if article.section}
			<meta property="article:section" content={article.section} />
		{/if}
		{#if article.tags}
			{#each article.tags as tag}
				<meta property="article:tag" content={tag} />
			{/each}
		{/if}
	{/if}

	<!-- Additional SEO Meta Tags -->
	<meta
		name="robots"
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>
	<meta name="googlebot" content="index, follow" />
	<meta name="language" content="English" />
	<meta name="geo.region" content="NG" />
	<meta name="geo.country" content="Nigeria" />
	<meta name="application-name" content="Sports Unlimited" />
	<meta name="apple-mobile-web-app-title" content="Sports Unlimited" />
	<meta name="theme-color" content="#ef4444" />

	<!-- Structured Data -->
	{#if schemaorg}
		{@html `<script type="application/ld+json">${JSON.stringify(schemaorg)}</script>`}
	{/if}
</svelte:head>
