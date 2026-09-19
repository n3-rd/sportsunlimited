<script lang="ts">
	import { urlFor, getResponsiveImageSrcset } from "$lib/utils/image";
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { Clock } from "svelte-radix";
	import { calculateReadingTime } from "$lib/utils/index";
	dayjs.extend(relativeTime);

	interface Props {
		post: any;
		size?: 'small' | 'medium' | 'large';
		loading?: 'lazy' | 'eager';
		fetchpriority?: 'high' | 'low' | 'auto';
	}

	let { post, size = 'medium', loading = 'lazy', fetchpriority = 'low' }: Props = $props();

	const sizeClasses = {
		small: 'aspect-[16/9]',
		medium: 'aspect-[4/3]',
		large: 'aspect-[5/4]'
	};

	const readingTime = calculateReadingTime(post.body || []);
</script>

<a href={`/post/${post.slug.current}`} class="post-card group block h-full">
	<article class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 h-full flex flex-col border border-zinc-100/80 group-hover:border-rose-200/60">
		<div class="relative {sizeClasses[size]} overflow-hidden">
			<img 
				src={urlFor(post.mainImage.asset).width(800).height(600).quality(85).url()} 
				srcset={getResponsiveImageSrcset(post.mainImage.asset, 800)}
				sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
				alt={post.title}
				class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
				{loading}
				{fetchpriority}
				decoding="async"
			/>
			<div class="absolute top-4 left-4">
				{#if post.tags && post.tags[0]}
					<span class="bg-rose-600/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
						{post.tags[0]}
					</span>
				{/if}
			</div>
		</div>
		
		<div class="p-5 flex-1 flex flex-col">
			<h3 class="text-lg md:text-xl font-bold text-zinc-900 mb-3 group-hover:text-rose-600 transition-colors line-clamp-2 leading-tight">
				{post.title}
			</h3>
			
			{#if post.excerpt && size !== 'small'}
				<p class="text-sm text-zinc-600 mb-4 line-clamp-2 flex-1 leading-relaxed">
					{post.excerpt}
				</p>
			{/if}
			
			<div class="flex items-center gap-2 text-xs text-zinc-500 mt-auto font-medium">
				<Clock size="14" />
				<span>{dayjs(post._createdAt).fromNow()}</span>
				<span class="text-zinc-300">•</span>
				<span>{readingTime} min read</span>
			</div>
		</div>
	</article>
</a>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>

