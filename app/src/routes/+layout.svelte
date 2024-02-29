<script>
	import "../app.pcss";
    import Footer from '../components/Footer.svelte';
    import Header from '../components/Header.svelte';
    // Import the Analytics package, and the SvelteKit dev variable.
    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';
	import Sidebar from "../components/Sidebar.svelte";

    // Inject the Analytics functionality
    inject();
</script>

<Header ></Header>
<div class="container flex flex-col md:flex-row gap-7">
    <main class="w-full md:w-3/4">
        <slot></slot>
     
    </main>
    <aside class="w-full md:w-1/4 h-full  py-20 px-2">
      <Sidebar/>
    </aside>

</div>
<footer class="mt-auto">
    <Footer></Footer>
</footer>