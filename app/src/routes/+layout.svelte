<script>
	import Footer from '../components/Footer.svelte';
	import Header from '../components/Header.svelte';
	// Import the Analytics package, and the SvelteKit dev variable.
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	// Inject the Analytics functionality
	inject({ mode: dev ? 'development' : 'production' });
</script>

<Header />
<div class="container">
	<main>
		<slot />
	</main>
	<footer class="footer">
		<Footer />
	</footer>
</div>
