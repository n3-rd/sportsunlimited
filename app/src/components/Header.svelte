<script>
	import pkg from "lodash";
	const { debounce } = pkg;

	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { HamburgerMenu, MagnifyingGlass } from "svelte-radix";
	import * as Dialog from "$lib/components/ui/dialog";
	import Input from "$lib/components/ui/input/input.svelte";
	import { searchPosts } from "$lib/utils/sanity";
	import PostThumbs from "./PostThumbs.svelte";
	import Spinner from "./Spinner.svelte";

	let results = $state([]);
	let search = $state("");
	let loading = $state(false);

	const debouncedSearch = debounce(() => {
		fetchSearchResults();
	}, 300);

	async function fetchSearchResults() {
		loading = true;
		searchPosts(search).then((res) => {
			results = res;
			console.log(results);
			loading = false;
		});
	}
</script>

<div class="navigation w-full sticky top-0 z-50 bg-gray-900 shadow-lg">
	<div class="nav-container w-full flex flex-row items-center justify-between text-white py-4 px-4 md:px-8">
		<div class="brand-container">
			<h1 class="brand font-bold text-xl md:text-2xl">
				<a href="/" class="hover:text-gray-300 transition-colors" aria-label="Sports Unlimited Home">
					Sports Unlimited
				</a>
			</h1>
			<p class="brand-tagline hidden md:block text-xs text-gray-400 mt-0.5">
				Nigeria's Premier Sports News
			</p>
		</div>

		<div class="flex items-center gap-4">
			<!-- Desktop Navigation -->
			<nav class="nav flex-row gap-6 hidden md:flex" aria-label="Main navigation">
				<a href="/" class="nav-link hover:text-gray-300 transition-colors font-medium">Home</a>
				<a href="/tags" class="nav-link hover:text-gray-300 transition-colors font-medium">Categories</a>
				<a href="/about" class="nav-link hover:text-gray-300 transition-colors font-medium">About</a>
				<a href="/contact" class="nav-link hover:text-gray-300 transition-colors font-medium">Contact</a>
			</nav>

			<!-- Search Dialog -->
			<Dialog.Root>
				<Dialog.Trigger>
					<button class="search-button p-2 hover:bg-gray-800 rounded-lg transition-colors" aria-label="Search articles">
						<MagnifyingGlass />
					</button>
				</Dialog.Trigger>
				<Dialog.Content class="max-w-2xl">
					<Dialog.Header>
						<Dialog.Title>Search Articles</Dialog.Title>
						<Dialog.Description>Find the latest sports news and stories</Dialog.Description>
						<Input 
							type="text" 
							placeholder="Search articles..." 
							bind:value={search} 
							on:keypress={() => debouncedSearch()}
							class="mt-4"
						/>
					</Dialog.Header>
					<div class="max-h-96 overflow-y-auto mt-4">
						{#if loading}
							<div class="w-full flex justify-center items-center py-8">
								<Spinner />
							</div>
						{:else if results.length > 0}
							<div class="w-full">
								<PostThumbs posts={results} />
							</div>
						{:else if results.length === 0 && search.length > 0}
							<div class="text-center py-8 text-gray-500">
								<p>No articles found matching "{search}"</p>
							</div>
						{/if}
					</div>
				</Dialog.Content>
			</Dialog.Root>

			<!-- Mobile Menu -->
			<div class="mobile-menu block md:hidden">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<button class="p-2 hover:bg-gray-800 rounded-lg transition-colors" aria-label="Menu">
							<HamburgerMenu />
						</button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Item>
								<a href="/">Home</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<a href="/tags">Categories</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<a href="/about">About</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<a href="/contact">Contact</a>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</div>
</div>
