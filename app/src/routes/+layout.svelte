<script lang="ts">
	import "../app.pcss";
    import Footer from '../components/Footer.svelte';
    import Header from '../components/Header.svelte';
    // Import the Analytics package, and the SvelteKit dev variable.
    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';
	import Sidebar from "../components/Sidebar.svelte";
    import { fade } from 'svelte/transition';
    import { beforeNavigate, afterNavigate } from '$app/navigation';
	import Spinner from "../components/Spinner.svelte";
    let { data, children } = $props();

    let isLoading = $state(false);

    beforeNavigate(() => (isLoading = true));
    afterNavigate(() => (isLoading = false));

    // Inject the Analytics functionality
    inject();
    let pathname = $derived(data.pathname);
</script>
{#if isLoading}
<div class="h-screen w-screen fixed z-[999] bg-[#0000009d] flex justify-center items-center mix-blend-darken">
        <Spinner/>
</div>
{/if}
<Header />
<div class="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row gap-8 py-8">
        <main class="w-full md:w-3/4" role="main">
            {#key pathname}
                <div in:fade={{ duration: 300, delay: 400 }} out:fade={{ duration: 300 }}>
                    {@render children?.()}
                </div>
            {/key}
        </main>
        <aside class="w-full md:w-1/4 h-full" role="complementary" aria-label="Sidebar">
            <Sidebar trendingPosts={data?.trendingPosts} tags={data?.tags} />
        </aside>
    </div>
</div>
<footer class="mt-auto">
    <Footer></Footer>
</footer>

