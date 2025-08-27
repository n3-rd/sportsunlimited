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

<div class="navigation w-full">
	<div class="nav-container w-full flex flex-row items-center justify-between bg-gray-900 text-white py-5 px-5">
		<div>
			<h2 class="brand font-bold text-2xl">
				<a href="/">Sports Unlimited</a>
			</h2>
		</div>

		<div class="flex gap-3">
			<Dialog.Root class="px-2">
				<Dialog.Trigger>
					<button class="search">
						<MagnifyingGlass />
					</button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Search for an article</Dialog.Title>
						<Input type="text" placeholder="Search" bind:value={search} on:keypress={() => debouncedSearch()} />
					</Dialog.Header>
					<div class="max-h-80 overflow-y-scroll">
						{#if loading}
						<div class="w-full flex justify-center items-center">
							<Spinner />

						</div>
						{:else if results.length > 0}
					
						<div class="w-full"
						
						>
						
							<PostThumbs posts={results} />

						</div>
					
						{:else if results.length === 0 && search.length > 0}
						<p>No results found</p>

						{/if}
					</div>

				</Dialog.Content>
			</Dialog.Root>

			<div class="nav flex-row gap-4 hidden md:flex">
				<ul>
					<a href="/">Home</a>
				</ul>
				<ul>
					<a href="/about">About</a>
				</ul>
				<ul>
					<a href="/contact">Contact</a>
				</ul>
			</div>

			<div class="mobile-menu block md:hidden">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<HamburgerMenu />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Item>
								<a href="/">Home</a>
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
