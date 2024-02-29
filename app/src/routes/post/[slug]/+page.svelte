<script lang="ts">
	import { PortableText } from '@portabletext/svelte';
	import { formatDate } from '$lib/utils/index';
	import { urlFor } from '$lib/utils/image';
	import type { PageData } from './$types';
	import { MetaTags } from 'svelte-meta-tags';

	export let data: PageData;
	console.log(data);
</script>

{#if data}
	<MetaTags
		title={data.title}
		description={data.excerpt}
		canonical={`https://www.sportsunlimited.ng/post/${data.slug.current}`}
		robots="index, follow"
		openGraph={{
			url: `https://www.sportsunlimited.ng/post/${data.slug.current}`,
			title: data.title,
			description: data.excerpt,
			images: data.mainImage ? [{ url: urlFor(data.mainImage).url() }] : [],
			siteName: 'Sports Unlimited'
		}}
		twitter={{
			cardType: 'summary_large_image',
			title: data.title,
			description: data.excerpt,

			image: data.mainImage ? urlFor(data.mainImage).url() : undefined
		}}
		keywords={data.tags ?? [].join(', ')}
		
	/>
{/if}

<!-- Rest of your code -->
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
		{#if data.excerpt}
			<p class="post__excerpt">{data.excerpt}</p>
		{/if}

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
			<PortableText value={data.body} components={{}} />
		</div>
	</div>
</section>
