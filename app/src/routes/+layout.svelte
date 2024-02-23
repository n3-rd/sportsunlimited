<script>
	import Footer from '../components/Footer.svelte';
	import Header from '../components/Header.svelte';
	import { inject } from '@vercel/analytics';
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
