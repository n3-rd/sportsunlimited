<script lang="ts">
	import { MagnifyingGlass } from "svelte-radix";
	import * as Dialog from "$lib/components/ui/dialog";
	import Input from "$lib/components/ui/input/input.svelte";
	import { searchPosts } from "$lib/utils/sanity";
	import { urlFor } from "$lib/utils/image";
	import { Clock } from "svelte-radix";
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import Spinner from "./Spinner.svelte";
	import { onMount } from "svelte";
	dayjs.extend(relativeTime);

	let search = $state("");
	let results = $state<any[]>([]);
	let loading = $state(false);
	let hasSearched = $state(false);
	let open = $state(false);

	// Debounce function
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	function handleSearch(value: string) {
		search = value;
		
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		if (value.length < 2) {
			results = [];
			hasSearched = false;
			return;
		}

		debounceTimer = setTimeout(async () => {
			loading = true;
			hasSearched = true;
			try {
				const searchResults = await searchPosts(value);
				results = searchResults || [];
			} catch (error) {
				console.error('Search error:', error);
				results = [];
			} finally {
				loading = false;
			}
		}, 300);
	}

	function highlightText(text: string, query: string): string {
		if (!query || !text) return text;
		const regex = new RegExp(`(${query})`, 'gi');
		return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
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
			class="search-button p-2 hover:bg-gray-800 rounded-lg transition-colors relative" 
			aria-label="Search articles"
		>
			<MagnifyingGlass />
			<span class="hidden md:inline-block absolute -top-1 -right-1 bg-gray-700 text-xs px-1.5 py-0.5 rounded text-gray-300">
				⌘K
			</span>
		</button>
	</Dialog.Trigger>
	<Dialog.Content class="max-w-3xl max-h-[80vh] flex flex-col">
		<Dialog.Header class="pb-4">
			<Dialog.Title class="text-2xl font-bold">Search Articles</Dialog.Title>
			<Dialog.Description class="text-gray-600">
				Find the latest sports news and stories. Type at least 2 characters to search.
			</Dialog.Description>
			<div class="mt-4 relative">
				<MagnifyingGlass class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size="20" />
				<Input 
					type="text" 
					placeholder="Search for articles, players, teams..." 
					bind:value={search}
					oninput={(e) => handleSearch((e.target as HTMLInputElement).value)}
					class="pl-10 pr-4 py-3 text-base"
					autofocus
				/>
			</div>
		</Dialog.Header>

		<div class="flex-1 overflow-y-auto mt-4 min-h-0">
			{#if loading}
				<div class="w-full flex flex-col justify-center items-center py-12">
					<Spinner />
					<p class="text-gray-500 mt-4">Searching articles...</p>
				</div>
			{:else if hasSearched && search.length >= 2}
				{#if results.length > 0}
					<div class="search-results">
						<div class="mb-4 px-1">
							<p class="text-sm text-gray-600">
								Found <strong class="text-gray-900">{results.length}</strong> {results.length === 1 ? 'article' : 'articles'} for "<strong class="text-gray-900">{search}</strong>"
							</p>
						</div>
						<div class="space-y-2">
							{#each results as post}
								<a 
									href={`/post/${post.slug.current}`}
									class="search-result-item block p-4 rounded-lg border border-gray-200 hover:border-red-600 hover:shadow-md transition-all group"
									onclick={() => open = false}
								>
									<div class="flex gap-4">
										{#if post.mainImage}
											<div class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
												<img 
													src={urlFor(post.mainImage.asset).width(200).height(200).quality(80).url()} 
													alt={post.title}
													class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
													loading="lazy"
												/>
											</div>
										{/if}
										<div class="flex-1 min-w-0">
											<h3 
												class="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-2 line-clamp-2"
											>
												{@html highlightText(post.title || '', search)}
											</h3>
											{#if post.excerpt}
												<p 
													class="text-sm text-gray-600 mb-2 line-clamp-2"
												>
													{@html highlightText(post.excerpt, search)}
												</p>
											{/if}
											<div class="flex items-center gap-3 text-xs text-gray-500">
												<div class="flex items-center gap-1">
													<Clock size="12" />
													<span>{dayjs(post._createdAt).fromNow()}</span>
												</div>
												{#if post.tags && post.tags[0]}
													<span class="text-gray-400">•</span>
													<span class="bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold text-xs uppercase">
														{post.tags[0]}
													</span>
												{/if}
											</div>
										</div>
									</div>
								</a>
							{/each}
						</div>
					</div>
				{:else}
					<div class="text-center py-12">
						<div class="mb-4">
							<MagnifyingGlass size="48" class="mx-auto text-gray-300" />
						</div>
						<h3 class="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
						<p class="text-gray-600 mb-4">
							We couldn't find any articles matching "<strong>{search}</strong>"
						</p>
						<div class="text-sm text-gray-500">
							<p class="mb-2">Try:</p>
							<ul class="list-disc list-inside space-y-1">
								<li>Checking your spelling</li>
								<li>Using different keywords</li>
								<li>Searching for a more general term</li>
							</ul>
						</div>
					</div>
				{/if}
			{:else if search.length > 0 && search.length < 2}
				<div class="text-center py-12">
					<p class="text-gray-500">Type at least 2 characters to search</p>
				</div>
			{:else}
				<div class="text-center py-12">
					<div class="mb-4">
						<MagnifyingGlass size="48" class="mx-auto text-gray-300" />
					</div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Start searching</h3>
					<p class="text-gray-600 mb-6">
						Enter keywords to find articles about Nigerian sports news, players, teams, and more.
					</p>
					<div class="text-left max-w-md mx-auto">
						<p class="text-sm font-semibold text-gray-700 mb-2">Popular searches:</p>
						<div class="flex flex-wrap gap-2">
							{#each ['NPFL', 'Super Eagles', 'Football', 'Basketball', 'Athletics'] as popular}
								<button
									onclick={() => {
										search = popular;
										handleSearch(popular);
									}}
									class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
								>
									{popular}
								</button>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	:global(.search-result-item mark) {
		background-color: #fef08a;
		padding: 0 2px;
		border-radius: 2px;
		font-weight: 600;
	}
</style>

