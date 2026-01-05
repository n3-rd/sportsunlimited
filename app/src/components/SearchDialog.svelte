<script lang="ts">
	import { MagnifyingGlass } from 'svelte-radix';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import { urlFor } from '$lib/utils/image';
	import { Clock } from 'svelte-radix';
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
				const response = await fetch(`/api/posts/search?q=${encodeURIComponent(value)}`);
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
			class="search-button relative rounded-lg p-2 transition-colors hover:bg-gray-800"
			aria-label="Search articles"
		>
			<MagnifyingGlass />
			<span
				class="absolute -right-1 -top-1 hidden rounded bg-gray-700 px-1.5 py-0.5 text-xs text-gray-300 md:inline-block"
			>
				⌘K
			</span>
		</button>
	</Dialog.Trigger>
	<Dialog.Content class="flex max-h-[80vh] max-w-3xl flex-col">
		<Dialog.Header class="pb-4">
			<Dialog.Title class="text-2xl font-bold">Search Articles</Dialog.Title>
			<Dialog.Description class="text-gray-600">
				Find the latest sports news and stories. Type at least 2 characters to search.
			</Dialog.Description>
			<div class="relative mt-4">
				<MagnifyingGlass class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size="20" />
				<Input
					type="text"
					placeholder="Search for articles, players, teams..."
					bind:value={search}
					oninput={(e) => handleSearch((e.target as HTMLInputElement).value)}
					class="py-3 pl-10 pr-4 text-base"
					autofocus
				/>
			</div>
		</Dialog.Header>

		<div class="mt-4 min-h-0 flex-1 overflow-y-auto">
			{#if loading}
				<div class="flex w-full flex-col items-center justify-center py-12">
					<Spinner />
					<p class="mt-4 text-gray-500">Searching articles...</p>
				</div>
			{:else if hasSearched && search.length >= 2}
				{#if results.length > 0}
					<div class="search-results">
						<div class="mb-4 px-1">
							<p class="text-sm text-gray-600">
								Found <strong class="text-gray-900">{results.length}</strong>
								{results.length === 1 ? 'article' : 'articles'} for "<strong class="text-gray-900"
									>{search}</strong
								>"
							</p>
						</div>
						<div class="space-y-2">
							{#each results as post}
								<a
									href={`/post/${post.slug.current}`}
									class="search-result-item group block rounded-lg border border-gray-200 p-4 transition-all hover:border-red-600 hover:shadow-md"
									onclick={() => (open = false)}
								>
									<div class="flex gap-4">
										{#if post.mainImage}
											<div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
												<img
													src={urlFor(post.mainImage.asset)
														.width(200)
														.height(200)
														.quality(80)
														.url()}
													alt={post.title}
													class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
													loading="lazy"
												/>
											</div>
										{/if}
										<div class="min-w-0 flex-1">
											<h3
												class="mb-2 line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-red-600"
											>
												{@html highlightText(post.title || '', search)}
											</h3>
											{#if post.excerpt}
												<p class="mb-2 line-clamp-2 text-sm text-gray-600">
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
													<span
														class="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold uppercase text-red-700"
													>
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
					<div class="py-12 text-center">
						<div class="mb-4">
							<MagnifyingGlass size="48" class="mx-auto text-gray-300" />
						</div>
						<h3 class="mb-2 text-lg font-semibold text-gray-900">No articles found</h3>
						<p class="mb-4 text-gray-600">
							We couldn't find any articles matching "<strong>{search}</strong>"
						</p>
						<div class="text-sm text-gray-500">
							<p class="mb-2">Try:</p>
							<ul class="list-inside list-disc space-y-1">
								<li>Checking your spelling</li>
								<li>Using different keywords</li>
								<li>Searching for a more general term</li>
							</ul>
						</div>
					</div>
				{/if}
			{:else if search.length > 0 && search.length < 2}
				<div class="py-12 text-center">
					<p class="text-gray-500">Type at least 2 characters to search</p>
				</div>
			{:else}
				<div class="py-12 text-center">
					<div class="mb-4">
						<MagnifyingGlass size="48" class="mx-auto text-gray-300" />
					</div>
					<h3 class="mb-2 text-lg font-semibold text-gray-900">Start searching</h3>
					<p class="mb-6 text-gray-600">
						Enter keywords to find articles about Nigerian sports news, players, teams, and more.
					</p>
					<div class="mx-auto max-w-md text-left">
						<p class="mb-2 text-sm font-semibold text-gray-700">Popular searches:</p>
						<div class="flex flex-wrap gap-2">
							{#each ['NPFL', 'Super Eagles', 'Football', 'Basketball', 'Athletics'] as popular}
								<button
									onclick={() => {
										search = popular;
										handleSearch(popular);
									}}
									class="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200"
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
