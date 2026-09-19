<script lang="ts">
	import '../app.pcss';
	import Footer from '../components/Footer.svelte';
	import Header from '../components/Header.svelte';
	// Import the Analytics package, and the SvelteKit dev variable.
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import Sidebar from '../components/Sidebar.svelte';
	import MobileBottomNav from '../components/MobileBottomNav.svelte';
	import { fade } from 'svelte/transition';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import Spinner from '../components/Spinner.svelte';
	import { page } from '$app/stores';
	let { data, children } = $props();

	let isLoading = $state(false);

	beforeNavigate(() => (isLoading = true));
	afterNavigate(() => (isLoading = false));

	// Inject the Analytics functionality
	inject();
	let pathname = $derived($page.url.pathname);
	let isNpflMode = $derived(pathname?.startsWith('/npfl'));
</script>

{#if isLoading}
	<div
		class="fixed z-[999] flex h-screen w-screen items-center justify-center bg-[#0000009d] mix-blend-darken"
	>
		<Spinner />
	</div>
{/if}
<Header />
<div class="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 {isNpflMode ? 'pb-20 md:pb-0' : ''}">
	{#if isNpflMode}
		<!-- Dedicated Full-Width Sports Layout for NPFL Pages -->
		<main class="w-full py-6 md:py-8">
			{#key pathname}
				<div in:fade={{ duration: 250 }} out:fade={{ duration: 150 }}>
					{@render children?.()}
				</div>
			{/key}
		</main>
	{:else}
		<!-- Editorial Blog Layout with Sidebar -->
		<div class="flex flex-col gap-8 py-8 md:flex-row">
			<main class="w-full md:w-3/4">
				{#key pathname}
					<div in:fade={{ duration: 300, delay: 400 }} out:fade={{ duration: 300 }}>
						{@render children?.()}
					</div>
				{/key}
			</main>
			<aside class="h-full w-full md:w-1/4" aria-label="Sidebar">
				<Sidebar
					trendingPosts={data?.featuredPosts}
					tags={data?.tags}
					npflTable={data?.npflTable}
					npflFixtures={data?.npflFixtures}
				/>
			</aside>
		</div>
	{/if}
</div>
<footer class="mt-auto {isNpflMode ? 'pb-16 md:pb-0' : ''}">
	<Footer></Footer>
</footer>
{#if isNpflMode}
	<MobileBottomNav />
{/if}
