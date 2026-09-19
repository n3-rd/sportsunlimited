<script lang="ts">
	import { urlFor, getResponsiveImageSrcset } from "$lib/utils/image";
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { Clock } from "svelte-radix";
	import { calculateReadingTime } from "$lib/utils/index";
	dayjs.extend(relativeTime);

	interface Props {
		post: any;
	}

	let { post }: Props = $props();
	
	const readingTime = calculateReadingTime(post.body || []);
</script>

<a href={`/post/${post.slug.current}`} class="compact-post-card group block">
	<article class="flex gap-4 p-4 rounded-xl hover:bg-zinc-50 hover:-translate-y-0.5 transition-all duration-300 border border-transparent hover:border-zinc-200/60 hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
		<div class="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shadow-sm">
			<img 
				src={urlFor(post.mainImage.asset).width(300).height(300).quality(80).url()} 
				srcset={getResponsiveImageSrcset(post.mainImage.asset, 300)}
				sizes="(max-width: 768px) 96px, 128px"
				alt={post.title}
				class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
				loading="lazy"
				fetchpriority="low"
				decoding="async"
			/>
		</div>
		
		<div class="flex-1 min-w-0 flex flex-col justify-center">
			<h3 class="text-base md:text-lg font-bold text-zinc-900 mb-2 group-hover:text-rose-600 transition-colors line-clamp-2 leading-tight">
				{post.title}
			</h3>
			<div class="flex items-center gap-2 text-xs text-zinc-500 font-medium">
				<Clock size="12" />
				<span>{dayjs(post._createdAt).fromNow()}</span>
				<span class="text-zinc-300">•</span>
				<span>{readingTime} min</span>
				{#if post.tags && post.tags[0]}
					<span class="text-zinc-300">•</span>
					<span class="text-rose-600 font-bold text-[10px] uppercase tracking-wider">{post.tags[0]}</span>
				{/if}
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

