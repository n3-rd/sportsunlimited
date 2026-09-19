<script lang="ts">
	import { MagnifyingGlass } from 'svelte-radix';
	import * as Dialog from '$lib/components/ui/dialog';
	import { urlFor } from '$lib/utils/image';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import Spinner from './Spinner.svelte';
	import { onMount } from 'svelte';
	dayjs.extend(relativeTime);

	let search = $state('');
	let results = $state<any[]>([]);
	let loading = $state(false);
	let hasSearched = $state(false);
	let open = $state(false);

	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	function handleSearch(value: string) {
		search = value;

		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		if (value.trim().length < 2) {
			results = [];
			hasSearched = false;
			loading = false;
			return;
		}

		debounceTimer = setTimeout(async () => {
			loading = true;
			hasSearched = true;
			try {
				const response = await fetch(`/api/posts/search?q=${encodeURIComponent(value.trim())}`);
				if (response.ok) {
					const searchResults = await response.json();
					results = searchResults || [];
				} else {
					results = [];
				}
			} catch (error) {
				console.error('Search error:', error);
				results = [];
			} finally {
				loading = false;
			}
		}, 250);
	}

	function highlightText(text: string, query: string): string {
		if (!query || !text) return text;
		const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		if (!escaped) return text;
		const regex = new RegExp(`(${escaped})`, 'gi');
		return text.replace(regex, '<mark class="highlight">$1</mark>');
	}

	function handleKeydown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
			event.preventDefault();
			open = true;
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}
		};
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<button
			class="search-button flex items-center justify-center p-2 text-zinc-300 hover:text-white bg-transparent border-0 hover:bg-white/10 active:bg-white/15 rounded-lg transition-colors md:px-3 md:py-1.5 md:gap-2 md:text-zinc-400 md:hover:text-white text-xs font-mono"
			aria-label="Search articles"
		>
			<MagnifyingGlass size="20" class="text-zinc-300" />
			<span class="hidden md:inline">Search</span>
			<span
				class="hidden rounded bg-zinc-800/80 border border-zinc-700/60 px-1.5 py-0.5 text-[10px] text-zinc-400 md:inline-block font-mono"
			>
				⌘K
			</span>
		</button>
	</Dialog.Trigger>

	<Dialog.Content class="p-0 overflow-hidden max-w-2xl bg-white border border-zinc-200/80 shadow-2xl rounded-2xl gap-0">
		<Dialog.Title class="sr-only">Search Articles</Dialog.Title>
		<Dialog.Description class="sr-only">Search latest sports news and dispatches</Dialog.Description>

		<!-- Search Input Bar -->
		<div class="relative flex items-center border-b border-zinc-100 px-4 py-3">
			<MagnifyingGlass class="text-zinc-400 flex-shrink-0" size="18" />
			<input
				type="text"
				placeholder="Search stories, teams, athletes..."
				bind:value={search}
				oninput={(e) => handleSearch(e.currentTarget.value)}
				class="w-full bg-transparent border-0 py-1 pl-3 pr-10 text-base text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-0"
				autofocus
			/>
			{#if search}
				<button 
					type="button" 
					onclick={() => { search = ''; results = []; hasSearched = false; }}
					class="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors mr-6"
					aria-label="Clear search"
				>
					<span class="text-xs font-mono">✕</span>
				</button>
			{/if}
		</div>

		<!-- Dialog Body -->
		<div class="max-h-[60vh] min-h-[140px] overflow-y-auto p-2 sm:p-3">
			{#if loading}
				<div class="py-12 flex flex-col items-center justify-center gap-2 text-zinc-400">
					<Spinner />
					<span class="text-xs font-mono">Searching articles...</span>
				</div>
			{:else if hasSearched && search.trim().length >= 2}
				{#if results.length > 0}
					<div class="space-y-1">
						{#each results as post}
							<a
								href={`/post/${post.slug.current}`}
								class="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-zinc-100/70 transition-colors group"
								onclick={() => (open = false)}
							>
								{#if post.mainImage}
									<div class="w-14 h-14 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
										<img
											src={urlFor(post.mainImage.asset)
												.width(120)
												.height(120)
												.quality(80)
												.url()}
											alt={post.title}
											class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
											loading="lazy"
										/>
									</div>
								{/if}
								<div class="flex-1 min-w-0">
									<h4 class="text-sm font-bold text-zinc-950 group-hover:text-rose-600 transition-colors line-clamp-1 leading-snug">
										{@html highlightText(post.title || '', search)}
									</h4>
									{#if post.excerpt}
										<p class="text-xs text-zinc-500 line-clamp-1 mt-0.5">
											{@html highlightText(post.excerpt, search)}
										</p>
									{/if}
									<div class="flex items-center gap-2 text-[10.5px] font-mono text-zinc-400 mt-1">
										<span>{dayjs(post._createdAt).fromNow()}</span>
										{#if post.tags && post.tags[0]}
											<span>•</span>
											<span class="text-rose-600 font-medium">{post.tags[0]}</span>
										{/if}
									</div>
								</div>
								<span class="text-zinc-300 group-hover:text-zinc-600 text-xs transition-colors pr-1">
									↗
								</span>
							</a>
						{/each}
					</div>
				{:else}
					<div class="py-12 text-center text-zinc-500">
						<p class="text-sm">No stories found for "<span class="text-zinc-900 font-semibold">{search}</span>"</p>
						<p class="text-xs font-mono text-zinc-400 mt-1">Try searching a different team, player, or sport</p>
					</div>
				{/if}
			{:else}
				<!-- Clean Suggestions -->
				<div class="p-3">
					<p class="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-2.5">Trending Searches</p>
					<div class="flex flex-wrap gap-1.5">
						{#each ['NPFL', 'Super Eagles', 'Transfers', 'Basketball', 'Athletics', 'Enyimba', 'Remo Stars'] as topic}
							<button
								type="button"
								onclick={() => {
									search = topic;
									handleSearch(topic);
								}}
								class="px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 text-xs font-mono transition-colors"
							>
								{topic}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<!-- Minimal Footer -->
		<div class="px-4 py-2 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono text-zinc-400">
			<span>{results.length > 0 ? `${results.length} results` : 'Quick search'}</span>
			<span class="hidden sm:inline">ESC to close</span>
		</div>
	</Dialog.Content>
</Dialog.Root>

<style>
	:global(.highlight) {
		background-color: transparent;
		color: #e11d48;
		font-weight: 700;
	}
</style>
