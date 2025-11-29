<script lang="ts">
	const mainLinks = [
		{ name: 'Home', url: '/' },
		{ name: 'Categories', url: '/tags' },
		{ name: 'About', url: '/about' },
		{ name: 'Contact', url: '/contact' }
	];

	const legalLinks = [
		{ name: 'Privacy Policy', url: '/privacy' },
		{ name: 'Terms & Conditions', url: '/terms' },
		{ name: 'Disclaimer', url: '/disclaimer' }
	];

	const resourcesLinks = [
		{ name: 'Sitemap', url: '/sitemap.xml' },
		{ name: 'RSS Feed', url: '/rss.xml' }
	];
</script>

<footer class="footer bg-gray-900 text-white mt-auto">
	<div class="footer-container container max-w-6xl mx-auto px-4 py-12">
		<div class="footer-content grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
			<!-- Brand Section -->
			<div class="footer-brand">
				<h3 class="text-2xl font-bold mb-3">Sports Unlimited</h3>
				<p class="text-gray-400 text-sm mb-4">
					Nigeria's premier destination for the latest sports news, interviews, and analysis covering NPFL, Football, Basketball, Athletics, and more.
				</p>
			</div>

			<!-- Navigation Links -->
			<div class="footer-links">
				<h4 class="text-lg font-semibold mb-4">Quick Links</h4>
				<nav class="flex flex-col gap-2">
					{#each mainLinks as link}
						<a href={link.url} class="footer-link text-gray-400 hover:text-white transition-colors text-sm">
							{link.name}
						</a>
					{/each}
				</nav>
			</div>

			<!-- Legal & Resources -->
			<div class="footer-legal">
				<h4 class="text-lg font-semibold mb-4">Resources</h4>
				<nav class="flex flex-col gap-2 mb-4">
					{#each resourcesLinks as link}
						<a href={link.url} class="footer-link text-gray-400 hover:text-white transition-colors text-sm">
							{link.name}
						</a>
					{/each}
				</nav>
				<h4 class="text-lg font-semibold mb-4 mt-4">Legal</h4>
				<nav class="flex flex-col gap-2">
					{#each legalLinks as link}
						<a href={link.url} class="footer-link text-gray-400 hover:text-white transition-colors text-sm">
							{link.name}
						</a>
					{/each}
				</nav>
			</div>
		</div>

		<!-- Copyright -->
		<div class="footer-bottom border-t border-gray-800 pt-8">
			<div class="flex flex-col md:flex-row justify-between items-center gap-4">
				<p class="text-gray-400 text-sm text-center md:text-left">
					© {new Date().getFullYear()} Trustymike Communications. All rights reserved.
				</p>
				<p class="text-gray-500 text-xs text-center md:text-right">
					Covering Nigerian Sports Since {new Date().getFullYear() - 5}
				</p>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer {
		margin-top: auto;
	}
</style>
