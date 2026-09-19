<script lang="ts">
	import type { Post } from '$lib/types';
	import type { EditionTheme } from '$lib/utils/editions';
	import { urlFor } from '$lib/utils/image';
	import { formatDate } from '$lib/utils/index';

	interface Props {
		col1: Post[];
		col2: Post[];
		col3: Post[];
		theme: EditionTheme;
		onOpenReader: (post: Post) => void;
	}

	let { col1, col2, col3, theme, onOpenReader }: Props = $props();

	function getImg(post: Post) {
		if (!post.mainImage) return '';
		return urlFor(post.mainImage).width(600).quality(85).url();
	}
</script>

{#if col1.length > 0 || col2.length > 0 || col3.length > 0}
	<section class="broadsheet-section mt-10 sm:mt-16 pt-8 border-t-2 border-black/80">
	<!-- Section Header / Broadsheet Kicker (Free Press broadsheet styling) -->
	<div class="flex flex-wrap items-end justify-between gap-4 mb-6 pb-3 border-b border-black/15">
		<div>
			<span class="text-[11px] font-mono uppercase font-bold tracking-widest text-zinc-500 block mb-1">
				THE SPORTS UNLIMITED GAZETTE
			</span>
			<h3 class="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-zinc-950 uppercase">
				The Weekly Broadsheet
			</h3>
		</div>
		<div class="text-xs font-mono text-zinc-500">
			<span>SECTION B // INVESTIGATIONS, MATCHUPS & CULTURE</span>
		</div>
	</div>

	<!-- 3-Column Broadsheet Grid with Hairline Dividers -->
	<div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/15">
		<!-- COLUMN 1: Front Page Leads & League Matchups -->
		<div class="md:pr-6 space-y-8 py-6 md:py-0">
			{#each col1 as post, index}
				{@const stats = getEngagement(post.title)}
				<article class="group relative flex flex-col justify-between pb-6 {index !== col1.length - 1 ? 'border-b border-black/10' : ''}">
					{#if index === 1 && getImg(post)}
						<!-- Photo card in column 1 -->
						<div class="mb-4 overflow-hidden rounded-xl border border-black/10 aspect-[16/10] bg-zinc-100">
							<img
								src={getImg(post)}
								alt={post.title}
								class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
							/>
						</div>
					{/if}

					<div>
						<!-- Tag / Kicker -->
						<div class="flex items-center gap-2 mb-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
							<span class="font-bold text-zinc-900">{(post.tags && post.tags[0]) || 'Matchday'}</span>
						</div>

						<a href={`/post/${post.slug?.current}`} class="group-hover:text-blue-900 transition-colors">
							<h4 class="text-lg sm:text-xl font-bold font-serif leading-snug tracking-tight text-zinc-900 mb-2">
								{post.title}
							</h4>
						</a>

						{#if post.excerpt}
							<p class="text-xs sm:text-sm text-zinc-600 font-serif leading-relaxed line-clamp-3 mb-3">
								{post.excerpt}
							</p>
						{/if}
					</div>

					<!-- Date -->
					<div class="mt-2 flex items-center justify-between text-[11px] font-mono text-zinc-500">
						<span class="font-semibold uppercase tracking-wider">
							{formatDate(post._createdAt)}
						</span>
					</div>

					<button
						type="button"
						onclick={() => onOpenReader(post)}
						class="mt-2 text-[10px] font-mono uppercase font-bold text-left hover:underline text-zinc-700"
					>
						Read Article ↗
					</button>
				</article>
			{/each}
		</div>

		<!-- COLUMN 2: Center Feature & Tactical Deep Dives (Dominant Column) -->
		<div class="md:px-6 space-y-8 py-6 md:py-0">
			{#each col2 as post, index}
				{@const stats = getEngagement(post.title)}
				<article class="group relative flex flex-col justify-between pb-6 {index !== col2.length - 1 ? 'border-b border-black/10' : ''}">
					<!-- Center lead gets full graphic treatment with sticker badge -->
					{#if index === 0}
						<div class="relative mb-4 overflow-hidden rounded-xl border border-black/10 aspect-[16/10] bg-zinc-900">
							{#if getImg(post)}
								<img
									src={getImg(post)}
									alt={post.title}
									class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
									loading="lazy"
								/>
							{:else}
								<div class="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 font-display font-black text-2xl">
									ESSAY
								</div>
							{/if}
							<!-- Free Press Sticker Badge -->
							<div class="absolute top-3 left-3">
								<span
									class="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-widest shadow-md text-white"
									style="background-color: {theme.accent};"
								>
									DEEP DIVE
								</span>
							</div>
						</div>

						<a href={`/post/${post.slug?.current}`} class="group-hover:text-blue-900 transition-colors">
							<h4 class="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-zinc-950 mb-2 leading-tight">
								{post.title}
							</h4>
						</a>
					{:else}
						<div class="flex items-center gap-2 mb-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
							<span class="font-bold text-zinc-900">{(post.tags && post.tags[0]) || 'Analysis'}</span>
						</div>

						<a href={`/post/${post.slug?.current}`} class="group-hover:text-blue-900 transition-colors">
							<h4 class="text-lg sm:text-xl font-bold font-serif leading-snug tracking-tight text-zinc-900 mb-2">
								{post.title}
							</h4>
						</a>
					{/if}

					{#if post.excerpt}
						<p class="text-xs sm:text-sm text-zinc-700 font-serif leading-relaxed line-clamp-3 mb-3">
							{post.excerpt}
						</p>
					{/if}

					<div class="mt-2 flex items-center justify-between text-[11px] font-mono text-zinc-500">
						<span class="font-semibold uppercase tracking-wider">
							{formatDate(post._createdAt)}
						</span>
					</div>

					<button
						type="button"
						onclick={() => onOpenReader(post)}
						class="mt-2 text-[10px] font-mono uppercase font-bold text-left hover:underline text-zinc-700"
					>
						Read Article ↗
					</button>
				</article>
			{/each}
		</div>

		<!-- COLUMN 3: Culture, Locker Room Wire & Trending Sports Personalities -->
		<div class="md:pl-6 space-y-8 py-6 md:py-0">
			{#each col3 as post, index}
				{@const stats = getEngagement(post.title)}
				<article class="group relative flex flex-col justify-between pb-6 {index !== col3.length - 1 ? 'border-b border-black/10' : ''}">
					{#if (index === 0 || index === 2) && getImg(post)}
						<div class="mb-4 overflow-hidden rounded-xl border border-black/10 aspect-[16/10] bg-zinc-100">
							<img
								src={getImg(post)}
								alt={post.title}
								class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
							/>
						</div>
					{/if}

					<div>
						<div class="flex items-center gap-2 mb-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
							<span class="font-bold text-zinc-900">{(post.tags && post.tags[0]) || 'People & Culture'}</span>
						</div>

						<a href={`/post/${post.slug?.current}`} class="group-hover:text-blue-900 transition-colors">
							<h4 class="text-lg sm:text-xl font-bold font-serif leading-snug tracking-tight text-zinc-900 mb-2">
								{post.title}
							</h4>
						</a>

						{#if post.excerpt}
							<p class="text-xs sm:text-sm text-zinc-600 font-serif leading-relaxed line-clamp-3 mb-3">
								{post.excerpt}
							</p>
						{/if}
					</div>

					<div class="mt-2 flex items-center justify-between text-[11px] font-mono text-zinc-500">
						<span class="font-semibold uppercase tracking-wider">
							{formatDate(post._createdAt)}
						</span>
					</div>

					<button
						type="button"
						onclick={() => onOpenReader(post)}
						class="mt-2 text-[10px] font-mono uppercase font-bold text-left hover:underline text-zinc-700"
					>
						Read Article ↗
					</button>
				</article>
			{/each}
		</div>
	</div>
	</section>
{/if}
