<script>
	import Footer from '../components/Footer.svelte';
</script>

<div class="container">
	<header class="header">
		<a class="header__title" href="/">Sports Unlimited</a>
	</header>
	<main>
		<slot />
	</main>
	<footer class="footer">
		<Footer />
	</footer>
</div>
