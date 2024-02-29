<script>
	import "../app.pcss";
    import Footer from '../components/Footer.svelte';
    import Header from '../components/Header.svelte';
    // Import the Analytics package, and the SvelteKit dev variable.
    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';

    // Inject the Analytics functionality
    inject();
</script>

<Header ></Header>
<div class="container flex md:flex-row gap-7">
    <main class="w-3/4">
        <slot></slot>
        <footer class="mt-auto">
            <Footer></Footer>
        </footer>
    </main>
    <aside class="w-1/4 h-[200vh] bg-violet-500">
        aside
    </aside>
  
</div>
