<script>
	export let links = [
		{ name: 'Home', url: '/' },
		{ name: 'About', url: '/about' },

		{ name: 'Tags', url: '/tags' },
		{ name: 'Contact', url: '/contact' },
		{ name: 'Admin', url: 'https://sportsunlimited-studio.vercel.app' },
		{ name: 'Privacy Policy', url: '/privacy' },
	
	];
</script>

<footer>
	<nav>
		{#each links as link}
			<a href={link.url}>{link.name}</a>
		{/each}
	</nav>
	<p>© {new Date().getFullYear()} Trustymike Communications. All rights reserved.</p>
</footer>

<style>
	footer {
		background-color: #fff;
		padding: 2rem;
		text-align: center;
		color: #333;
		font-family: Arial, sans-serif;
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		margin-bottom: 1rem;
	}

	a {
		margin: 0.5rem;
		padding: 0.5rem;
		color: #333;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	a:hover {
		color: #007bff;
	}

	p {
		font-size: 0.875rem;
	}
</style>
