<script lang="ts">
	import { PortableText } from '@portabletext/svelte';
	import { formatDate } from '$lib/utils';
	import { urlFor } from '$lib/utils/image';
	import type { PageData } from './$types';

	export let data: PageData;
	console.log(data);
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.excerpt} />
	<meta property="og:title" content={data.title} />
	<meta property="og:description" content={data.excerpt} />
	{#if data.mainImage}
		<meta property="og:image" content={urlFor(data.mainImage).url()} />
		<meta name="twitter:image" content={urlFor(data.mainImage).url()} />
	{/if}
	<meta property="og:url" content={`https://www.sportsunlimited.ng/post/${data.slug}`} />
	<meta property="og:type" content="article" />
	<meta property="og:site_name" content="Sports Unlimited" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.title} />
	<meta name="twitter:description" content={data.excerpt} />
	<meta name="twitter:url" content={`https://www.sportsunlimited.ng/post/${data.slug}`} />
	<!-- add other meta tags -->
	<meta name="keywords" content={data.tags.join(', ')} />
	<meta name="author" content={data.tags.excerpt} />
	<link rel="canonical" href={`https://www.sportsunlimited.ng/post/${data.slug}`} />
</svelte:head>

<section class="post">
	{#if data.mainImage}
		<img
			class="post__cover"
			src={urlFor(data.mainImage).url()}
			alt="Cover image for {data.title}"
		/>
	{:else}
		<div class="post__cover--none" />
	{/if}
	<div class="post__container">
		<h1 class="post__title">{data.title}</h1>
		<p class="post__excerpt">{data.excerpt}</p>
		{#if data.tags}
			<p class="post__tags">
				{#each data.tags as tag}
					<a href={`/tags/${tag}`} class="post__tag">{tag}</a>
				{/each}
			</p>
		{/if}
		<p class="post__date">
			{formatDate(data._createdAt)}
		</p>
		<div class="post__content">
			<PortableText value={data.body} />
		</div>
	</div>
</section>
