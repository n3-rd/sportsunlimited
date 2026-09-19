<script lang="ts">
	import type { Post } from '$lib/types';
	import type { EditionTheme } from '$lib/utils/editions';
	import { urlFor } from '$lib/utils/image';
	import { formatDate } from '$lib/utils/index';

	interface Props {
		post: Post;
		theme: EditionTheme;
		onOpenReader: (post: Post) => void;
	}

	let { post, theme, onOpenReader }: Props = $props();

	const imageUrl = $derived(
		post?.mainImage ? urlFor(post.mainImage).width(1400).quality(92).url() : ''
	);

	const mainTag = $derived((post?.tags && post.tags[0]) || 'Feature');
</script>

<div class="cover-hero group relative rounded-2xl md:rounded-3xl overflow-hidden border border-black/10 bg-zinc-950 text-white shadow-xl transition-all duration-300 hover:shadow-2xl">
	<!-- High Impact Visual Background -->
	<div class="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/11] lg:aspect-[16/10] overflow-hidden">
		{#if imageUrl}
			<img
				src={imageUrl}
				alt={post.title}
				class="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
				loading="eager"
				fetchpriority="high"
			/>
		{:else}
			<!-- High-energy graphic fallback -->
			<div class="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-black flex items-center justify-center p-8 text-center">
				<span class="text-7xl sm:text-9xl font-display font-black text-white/10 uppercase select-none">
					SPORTS
				</span>
			</div>
		{/if}

		<!-- Vignette gradient overlay for cinematic contrast and razor-sharp readability -->
		<div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
		<div class="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20"></div>

		<!-- Top Header Pills (Inspo 1 House of Heat style) -->
		<div class="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-10">
			<!-- Tag / Sticker Pill -->
			<div class="flex items-center gap-2">
				<span
					class="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider shadow-md backdrop-blur-md"
					style="background-color: {theme.accent}; color: {theme.accentForeground};"
				>
					★ COVER STORY
				</span>
				<span class="px-2.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-black/60 text-white/90 border border-white/20 backdrop-blur-md">
					{mainTag}
				</span>
			</div>

			<!-- Quick Reader Trigger -->
			<button
				type="button"
				onclick={() => onOpenReader(post)}
				class="px-3 py-1 text-[11px] font-mono uppercase tracking-wider font-semibold rounded-full bg-white/90 hover:bg-white text-black transition-all shadow-md backdrop-blur-md flex items-center gap-1.5"
			>
				<span>Quick Read</span>
				<span class="text-xs">↗</span>
			</button>
		</div>

		<!-- Bottom Story Editorial Overlay -->
		<div class="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-10 z-10 flex flex-col justify-end">
			<a
				href={`/post/${post.slug?.current}`}
				class="block group-hover:underline decoration-2 underline-offset-4"
			>
				<h2
					class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-display leading-[1.08] tracking-tight text-white mb-3 max-w-3xl drop-shadow-sm"
				>
					{post.title}
				</h2>
			</a>

			{#if post.excerpt}
				<p class="text-sm sm:text-base md:text-lg text-zinc-200 line-clamp-2 md:line-clamp-3 max-w-2xl font-normal leading-relaxed mb-4 text-shadow-sm">
					{post.excerpt}
				</p>
			{/if}

			<!-- Author Line & Meta Row -->
			<div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/15 text-xs font-mono text-zinc-300">
				<div class="flex items-center gap-3">
					<span class="text-white font-medium uppercase tracking-wider">
						WRITTEN BY SPORTS UNLIMITED
					</span>
					<span class="text-white/40">•</span>
					<span>{formatDate(post._createdAt)}</span>
				</div>

				<div class="flex items-center gap-4">
					<button
						type="button"
						onclick={() => onOpenReader(post)}
						class="text-xs font-mono font-semibold uppercase tracking-wider text-white hover:text-emerald-400 flex items-center gap-1 transition-colors"
					>
						Split Screen Reader →
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
