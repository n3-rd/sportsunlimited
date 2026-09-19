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
		small: 'aspect-[16/10]',
		medium: 'aspect-[16/10]',
		large: 'aspect-[4/3]'
	};

	const readingTime = calculateReadingTime(post.body || []);

	// Extract excerpt fallback if post.excerpt is not populated
	function getExcerpt(p: any): string {
		if (p?.excerpt && typeof p.excerpt === 'string' && p.excerpt.trim()) {
			return p.excerpt.trim();
		}
		if (Array.isArray(p?.body)) {
			for (const block of p.body) {
				if (block?._type === 'block' && Array.isArray(block.children)) {
					const text = block.children.map((c: any) => c.text || '').join('').trim();
					if (text) return text;
				}
				if (typeof block === 'string' && block.trim()) {
					return block.trim();
				}
			}
		}
		return '';
	}

	const excerpt = $derived(getExcerpt(post));
</script>

<a href={`/post/${post.slug?.current || ''}`} class="post-card group block h-full">
	<article class="p-3 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-400/90 shadow-sm hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] h-full flex flex-col">
		<div class="relative {sizeClasses[size] || 'aspect-[16/10]'} overflow-hidden rounded-xl bg-zinc-100">
			{#if post.mainImage?.asset}
				<img 
					src={urlFor(post.mainImage.asset).width(800).height(500).quality(85).url()} 
					srcset={getResponsiveImageSrcset(post.mainImage.asset, 800)}
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					alt={post.title}
					class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
					{loading}
					{fetchpriority}
					decoding="async"
				/>
			{:else}
				<div class="w-full h-full bg-zinc-200/60 flex items-center justify-center text-zinc-400">
					<span class="font-mono text-xs uppercase">Sports Unlimited</span>
				</div>
			{/if}
			<div class="absolute top-3 left-3">
				{#if post.tags && post.tags[0]}
					<span class="bg-zinc-950/75 backdrop-blur-md text-white font-mono text-[9.5px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10 group-hover:bg-rose-600 group-hover:border-rose-500 transition-colors duration-300 shadow-sm">
						{post.tags[0]}
					</span>
				{/if}
			</div>
		</div>
		
		<div class="p-3.5 pt-4 flex-1 flex flex-col">
			<h3 class="text-base sm:text-lg font-bold tracking-tight text-zinc-950 mb-2 group-hover:text-rose-600 transition-colors duration-300 line-clamp-3 leading-snug">
				{post.title}
			</h3>
			
			{#if excerpt}
				<p class="text-xs sm:text-sm text-zinc-600 mb-3.5 line-clamp-2 sm:line-clamp-3 leading-relaxed flex-1">
					{excerpt}
				</p>
			{/if}
			
			<div class="flex items-center justify-between text-[11px] font-mono text-zinc-500 mt-auto pt-3 border-t border-zinc-100">
				<div class="flex items-center gap-1.5">
					<Clock size="12" />
					<span>{dayjs(post._createdAt).fromNow()}</span>
					<span class="text-zinc-300">•</span>
					<span>{readingTime}m</span>
				</div>
				<span class="w-6 h-6 rounded-full bg-zinc-100 group-hover:bg-rose-600 text-zinc-500 group-hover:text-white flex items-center justify-center text-[10px] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
					↗
				</span>
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
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
