<script lang="ts">
	import { PortableText } from '@portabletext/svelte';
	import { formatDate } from '$lib/utils/index';
	import { urlFor } from '$lib/utils/image';
	import type { PageData } from './$types';
	

	export let data: PageData;
	console.log(data);

	const socialInfo = [
		{
			name: 'Whatsapp',
			url: `https://wa.me/?text= read this article ${data.title} https://www.sportsunlimited.ng/post/${data.slug.current}`,
			icon: '/whatsapp.svg',
		},
		{
			name: 'Facebook',
			url: `https://www.facebook.com/sharer/sharer.php?u=https://www.sportsunlimited.ng/post/${data.slug.current}`,
			icon: '/facebook.svg',
		},
		{
			name: 'X',
			url: `https://x.com/intent/tweet?text= read this article ${data.title} https://www.sportsunlimited.ng/post/${data.slug.current}`,
			icon: '/x.svg',
		},
		// {
		// 	name: 'Linkedin',
		// 	url: `https://www.linkedin.com/shareArticle?mini=true&url=https://www.sportsunlimited.ng/post/${data.slug.current}&title=${data.title}&summary=${data.excerpt || data.title}&source=Sports Unlimited`,
		// 	icon: '/linkedin.svg',
		// },
		{
			name: 'Email',
			url: `mailto:?subject=${data.title}&body= read this article ${data.title} https://www.sportsunlimited.ng/post/${data.slug.current}`,
			icon: '/mail.svg',
		},
		// {
		// 	name: 'Copy link',
		// 	url: `https://www.sportsunlimited.ng/post/${data.slug.current}`,
		// 	icon: '/link.svg',
		// }
	]
</script>
<svelte:head>
	<title>{data.title || 'sports unlimited'}</title>
	<meta name="description" content={data.excerpt || data.title} />
	<meta property="og:url" content={`https://www.sportsunlimited.ng/post/${data.slug.current}`} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.title} />
	<meta property="og:description" content={data.excerpt || data.title} />
	<meta property="og:image" content={data.mainImage ? urlFor(data.mainImage).url() : undefined} />
	<meta property="og:site_name" content="Sports Unlimited" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.title} />
	<meta name="twitter:description" content={data.excerpt || data.title} />
	<meta name="twitter:image" content={data.mainImage ? urlFor(data.mainImage).url() : undefined} />
	<meta name="keywords" content={data.tags ? data.tags.join(', ') : 'sportsunlimited '} />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={`https://www.sportsunlimited.ng/post/${data.slug.current}`} />
</svelte:head>

<!-- Rest of your code -->
<section class="post py-7">
	{#if data.mainImage}
		<img
			class="post__cover
			object-cover object-top w-full h-[30rem] mb-8 rounded-lg shadow-lg
			"
			src={urlFor(data.mainImage).url()}
			alt="Cover image for {data.title}"
		/>
	{:else}
		<div class="post__cover--none" />
	{/if}
	<div class="post__container">
		<h1 class="post__title text-4xl font-bold mb-4">{data.title}</h1>
		{#if data.excerpt}
			<p class="post__excerpt text-gray-600 mb-4">{data.excerpt}</p>
		{/if}

		{#if data.tags}
			<p class="post__tags mb-4">
				{#each data.tags as tag}
					<a href={`/tags/${tag}`} class="post__tag inline-block bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm mr-2 mb-2">{tag}</a>
				{/each}
			</p>
		{/if}

		<div class="share py-4 flex-col md:flex-row gap-3">
			<div class="share">
				Share:
			</div>
			<div>
				{#each socialInfo as { name, url, icon }}
				<a href = {url} target="_blank" rel="noopener noreferrer" class="inline-block mr-4">
					<img src={icon} alt={name} class="h-9 w-9" />
				</a>
			{/each}
			</div>
			
		</div>
		<p class="post__date text-gray-500 mb-4">
			{formatDate(data._createdAt)}
		</p>

		<div class="share">
			
		</div>
		<div class="post__content
		prose 
		">
			<PortableText value={data.body} components={{}} />
		</div>

	</div>
	
	
</section>


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
</style>