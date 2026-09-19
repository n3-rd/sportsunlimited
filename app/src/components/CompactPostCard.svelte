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
	<article class="p-2.5 rounded-2xl bg-white hover:bg-zinc-50/80 border border-zinc-200/70 hover:border-zinc-300/90 shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex gap-4 items-center">
		<div class="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-zinc-100 shadow-sm">
			<img 
				src={urlFor(post.mainImage.asset).width(300).height(300).quality(80).url()} 
				srcset={getResponsiveImageSrcset(post.mainImage.asset, 300)}
				sizes="(max-width: 768px) 80px, 96px"
				alt={post.title}
				class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
				loading="lazy"
				fetchpriority="low"
				decoding="async"
			/>
		</div>
		
		<div class="flex-1 min-w-0 flex flex-col justify-center">
			<h3 class="text-sm sm:text-base font-bold tracking-tight text-zinc-950 mb-1.5 group-hover:text-rose-600 transition-colors duration-300 line-clamp-2 leading-snug">
				{post.title}
			</h3>
			<div class="flex items-center gap-2 text-[11px] font-mono text-zinc-500 flex-wrap">
				<div class="flex items-center gap-1">
					<Clock size="11" />
					<span>{dayjs(post._createdAt).fromNow()}</span>
				</div>
				<span class="text-zinc-300">•</span>
				<span>{readingTime}m</span>
				{#if post.tags && post.tags[0]}
					<span class="text-zinc-300">•</span>
					<span class="bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded text-[9.5px] uppercase font-mono tracking-wider font-medium">{post.tags[0]}</span>
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

