<script>
	import "../app.pcss";
    import Footer from '../components/Footer.svelte';
    import Header from '../components/Header.svelte';
    // Import the Analytics package, and the SvelteKit dev variable.
    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';
	import Sidebar from "../components/Sidebar.svelte";
    import { fade } from 'svelte/transition';
    export let data;
    $: pathname = data.pathname;
    import { beforeNavigate, afterNavigate } from '$app/navigation';
	import Spinner from "../components/Spinner.svelte";

let isLoading = false;

beforeNavigate(() => (isLoading = true));
afterNavigate(() => (isLoading = false));

    // Inject the Analytics functionality
    inject();
</script>
{#if isLoading}
<div class="h-screen w-screen fixed z-[999] bg-[#0000009d] flex justify-center items-center mix-blend-darken">
        <Spinner/>
</div>
{/if}
<Header ></Header>
<div class="container flex flex-col md:flex-row gap-7">
    <main class="w-full md:w-3/4">
        {#key pathname}
        <div in:fade={{ duration: 300, delay: 400 }} out:fade={{ duration: 300 }}>
            <slot />
        </div>
    {/key}
     
    </main>
    <aside class="w-full md:w-1/4 h-full  py-20 px-2">
      <Sidebar/>
    </aside>

</div>
<footer class="mt-auto">
    <!-- adsterra ads -->
		<script type="text/javascript">
			atOptions = {
				'key' : '9c0a98721ef6156f24a0918dc48d0e65',
				'format' : 'iframe',
				'height' : 50,
				'width' : 320,
				'params' : {}
			};
			document.write('<scr' + 'ipt type="text/javascript" src="//www.topcreativeformat.com/9c0a98721ef6156f24a0918dc48d0e65/invoke.js"></scr' + 'ipt>');
		</script>
		<script type='text/javascript' src='//pl22857845.profitablegatecpm.com/ee/ef/dd/eeefdd17558a7fc96cbe36a64f550c84.js'></script>
    <Footer></Footer>

</footer>

