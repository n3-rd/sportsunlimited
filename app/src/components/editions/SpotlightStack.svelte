<script lang="ts">
	import type { Post } from '$lib/types';
	import type { EditionTheme } from '$lib/utils/editions';
	import { urlFor } from '$lib/utils/image';
	import { formatDate } from '$lib/utils/index';

	interface Props {
		postTop: Post | null;
		postBottom: Post | null;
		theme: EditionTheme;
		onOpenReader: (post: Post) => void;
	}

	let { postTop, postBottom, theme, onOpenReader }: Props = $props();

	function getImg(post: Post | null) {
		if (!post?.mainImage) return '';
		return urlFor(post.mainImage).width(800).quality(90).url();
	}
</script>

<div class="spotlight-stack flex flex-col gap-4 sm:gap-6 h-full">
	<!-- Card 1: Top Spotlight (Mbappé On style) -->
	{#if postTop}
		<div
			class="spotlight-card group relative flex-1 rounded-2xl md:rounded-3xl overflow-hidden border border-black/10 bg-[#0c1622] text-white flex flex-col justify-between transition-all duration-300 hover:shadow-xl shadow-md"
		>
			<!-- Image Section -->
			<div class="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-black/40">
				{#if getImg(postTop)}
					<img
						src={getImg(postTop)}
						alt={postTop.title}
						class="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
						loading="lazy"
					/>
				{:else}
					<div class="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-slate-700 font-display font-black text-4xl">
						SPOTLIGHT
					</div>
				{/if}

				<!-- Top left insignia / tag badge -->
				<div class="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5">
					<span
						class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md"
						style="background-color: {theme.accent}; color: {theme.accentForeground};"
					>
						SPOTLIGHT
					</span>
				</div>

				<!-- Quick reader button -->
				<button
					type="button"
					onclick={() => onOpenReader(postTop)}
					class="absolute top-3.5 right-3.5 z-10 w-7 h-7 rounded-full bg-black/60 hover:bg-white hover:text-black text-white flex items-center justify-center text-xs font-mono transition-colors border border-white/20"
					title="Quick Read"
				>
					↗
				</button>
			</div>

			<!-- Card Content Section (Deep Dark House of Heat finish) -->
			<div class="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-gradient-to-b from-[#0c1622] to-[#080f18]">
				<div>
					<a href={`/post/${postTop.slug?.current}`} class="group-hover:text-zinc-200">
						<h3 class="text-lg sm:text-xl font-bold font-display tracking-tight text-white leading-snug mb-2">
							{postTop.title}
						</h3>
					</a>
					{#if postTop.excerpt}
						<p class="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed">
							{postTop.excerpt}
						</p>
					{/if}
				</div>

				<!-- Meta Footer (Matching Inspo 1: POSTED YYYY.MM.DD on left, tags in pills on right) -->
				<div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-[10px] font-mono">
					<span class="text-zinc-400 uppercase tracking-wider">
						POSTED {formatDate(postTop._createdAt)}
					</span>

					<div class="flex items-center gap-1.5 overflow-hidden">
						{#each (postTop.tags || ['Football']).slice(0, 2) as tag}
							<span class="px-2 py-0.5 rounded-full border border-white/25 text-zinc-300 uppercase tracking-wider text-[9px]">
								{tag}
							</span>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Card 2: Bottom Spotlight (Culture / Gear / Match Action) -->
	{#if postBottom}
		<div
			class="spotlight-card group relative flex-1 rounded-2xl md:rounded-3xl overflow-hidden border border-black/10 bg-[#12141a] text-white flex flex-col justify-between transition-all duration-300 hover:shadow-xl shadow-md"
		>
			<div class="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-black/40">
				{#if getImg(postBottom)}
					<img
						src={getImg(postBottom)}
						alt={postBottom.title}
						class="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
						loading="lazy"
					/>
				{:else}
					<div class="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center text-zinc-700 font-display font-black text-4xl">
						CULTURE
					</div>
				{/if}

				<div class="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5">
					<span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/20">
						CULTURE & KICKS
					</span>
				</div>

				<button
					type="button"
					onclick={() => onOpenReader(postBottom)}
					class="absolute top-3.5 right-3.5 z-10 w-7 h-7 rounded-full bg-black/60 hover:bg-white hover:text-black text-white flex items-center justify-center text-xs font-mono transition-colors border border-white/20"
					title="Quick Read"
				>
					↗
				</button>
			</div>

			<div class="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-gradient-to-b from-[#12141a] to-[#0a0b0e]">
				<div>
					<a href={`/post/${postBottom.slug?.current}`} class="group-hover:text-zinc-200">
						<h3 class="text-lg sm:text-xl font-bold font-display tracking-tight text-white leading-snug mb-2">
							{postBottom.title}
						</h3>
					</a>
					{#if postBottom.excerpt}
						<p class="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed">
							{postBottom.excerpt}
						</p>
					{/if}
				</div>

				<div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-[10px] font-mono">
					<span class="text-zinc-400 uppercase tracking-wider">
						POSTED {formatDate(postBottom._createdAt)}
					</span>

					<div class="flex items-center gap-1.5">
						{#each (postBottom.tags || ['Feature']).slice(0, 2) as tag}
							<span class="px-2 py-0.5 rounded-full border border-white/25 text-zinc-300 uppercase tracking-wider text-[9px]">
								{tag}
							</span>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
