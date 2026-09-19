<script lang="ts">
	import SearchDialog from "./SearchDialog.svelte";
	import { page } from "$app/stores";
	import { fade, fly } from "svelte/transition";

	let isMobileMenuOpen = $state(false);

	const pathname = $derived($page.url.pathname);

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isMobileMenuOpen) {
			closeMobileMenu();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Main Navigation -->
<header class="navigation w-full sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-xl shadow-sm border-b border-zinc-800/80 transition-all duration-300">
	<div class="nav-container max-w-7xl mx-auto flex flex-row items-center justify-between text-white py-3.5 px-4 md:px-8">
		<!-- Brand Lockup -->
		<div class="brand-container flex items-center">
			<a href="/" class="brand group flex items-center gap-3" aria-label="Sports Unlimited Home">
				<div class="relative p-1 rounded-xl bg-zinc-900 ring-1 ring-zinc-800 transition-transform duration-300 group-hover:scale-105">
					<img 
						src="/android-chrome-512x512.png" 
						alt="Sports Unlimited Logo" 
						class="w-9 h-9 object-contain"
					/>
				</div>
				<div class="flex flex-col">
					<span class="font-extrabold text-lg md:text-xl tracking-tight text-white group-hover:text-rose-400 transition-colors duration-300">
						SPORTS UNLIMITED
					</span>
					<p class="brand-tagline hidden md:block text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-400 -mt-0.5">
						Nigeria's Premier Sports Journalism
					</p>
				</div>
			</a>
		</div>

		<div class="flex items-center gap-2 md:gap-6">
			<!-- Desktop Navigation -->
			<nav class="nav flex-row items-center gap-5 lg:gap-6 hidden md:flex" aria-label="Main navigation">
				<a href="/" class="nav-link text-xs uppercase tracking-widest font-mono text-zinc-300 hover:text-white transition-colors relative py-1 {pathname === '/' ? 'text-white font-bold' : ''}">Home</a>
				<a href="/tags" class="nav-link text-xs uppercase tracking-widest font-mono text-zinc-300 hover:text-white transition-colors relative py-1 {pathname.startsWith('/tags') ? 'text-white font-bold' : ''}">Categories</a>
				<a href="/npfl" class="nav-link text-xs uppercase tracking-widest font-mono text-zinc-300 hover:text-white transition-colors relative py-1 {pathname === '/npfl' ? 'text-white font-bold' : ''}">NPFL</a>
				<a href="/npfl/standings" class="nav-link text-xs uppercase tracking-widest font-mono text-zinc-300 hover:text-white transition-colors relative py-1 {pathname.startsWith('/npfl/standings') ? 'text-white font-bold' : ''}">Table</a>
				<a href="/npfl/fixtures" class="nav-link text-xs uppercase tracking-widest font-mono text-zinc-300 hover:text-white transition-colors relative py-1 {pathname.startsWith('/npfl/fixtures') || pathname.startsWith('/npfl/matchday') ? 'text-white font-bold' : ''}">Fixtures</a>
				<a href="/npfl/clubs" class="nav-link text-xs uppercase tracking-widest font-mono text-zinc-300 hover:text-white transition-colors relative py-1 {pathname.startsWith('/npfl/clubs') ? 'text-white font-bold' : ''}">Clubs</a>
				<a href="/advertising" class="nav-link text-xs uppercase tracking-widest font-mono text-zinc-300 hover:text-white transition-colors relative py-1 {pathname.startsWith('/advertising') ? 'text-white font-bold' : ''}">Advertising</a>
				<a href="/about" class="nav-link text-xs uppercase tracking-widest font-mono text-zinc-300 hover:text-white transition-colors relative py-1 {pathname.startsWith('/about') ? 'text-white font-bold' : ''}">About</a>
				<a href="/contact" class="nav-link text-xs uppercase tracking-widest font-mono text-zinc-300 hover:text-white transition-colors relative py-1 {pathname.startsWith('/contact') ? 'text-white font-bold' : ''}">Contact</a>
			</nav>

			<!-- Search Dialog -->
			<div class="flex items-center">
				<SearchDialog />
			</div>

			<!-- Mobile Flat Menu Toggle Button -->
			<div class="mobile-menu-wrapper block md:hidden">
				<button
					type="button"
					onclick={toggleMobileMenu}
					class="p-2 rounded-xl text-zinc-300 hover:text-white bg-white/5 active:bg-white/10 transition-colors flex items-center justify-center border-0"
					aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
					aria-expanded={isMobileMenuOpen}
				>
					{#if isMobileMenuOpen}
						<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					{:else}
						<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="3" y1="12" x2="21" y2="12"></line>
							<line x1="3" y1="6" x2="21" y2="6"></line>
							<line x1="3" y1="18" x2="21" y2="18"></line>
						</svg>
					{/if}
				</button>
			</div>
		</div>
	</div>
</header>

<!-- Mobile Slide-Out Drawer Navigation -->
{#if isMobileMenuOpen}
	<!-- Backdrop Overlay -->
	<div
		class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs md:hidden"
		transition:fade={{ duration: 200 }}
		onclick={closeMobileMenu}
		role="presentation"
	></div>

	<!-- Slide-Over Drawer -->
	<aside
		class="fixed top-0 right-0 bottom-0 w-[82vw] max-w-sm z-50 bg-zinc-950/98 backdrop-blur-2xl border-l border-zinc-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto md:hidden"
		transition:fly={{ x: 320, duration: 250 }}
		aria-label="Mobile Navigation Drawer"
	>
		<!-- Drawer Header -->
		<div>
			<div class="flex items-center justify-between pb-5 border-b border-zinc-800/80 mb-6">
				<a href="/" onclick={closeMobileMenu} class="flex items-center gap-2.5">
					<img 
						src="/android-chrome-512x512.png" 
						alt="Sports Unlimited" 
						class="w-8 h-8 object-contain"
					/>
					<span class="font-extrabold text-base tracking-tight text-white">
						SPORTS UNLIMITED
					</span>
				</a>
				<button
					type="button"
					onclick={closeMobileMenu}
					class="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors border-0"
					aria-label="Close menu"
				>
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>

			<!-- Nav Groups -->
			<div class="space-y-6">
				<!-- Section 1: General -->
				<div>
					<span class="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 px-3 block mb-2">
						Main
					</span>
					<div class="space-y-1">
						<a
							href="/"
							onclick={closeMobileMenu}
							class="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors {pathname === '/' ? 'bg-rose-500/10 text-rose-400 font-bold border-l-2 border-rose-500' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'}"
						>
							<span>Home</span>
							<span class="text-zinc-600 text-xs">›</span>
						</a>
						<a
							href="/tags"
							onclick={closeMobileMenu}
							class="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors {pathname.startsWith('/tags') ? 'bg-rose-500/10 text-rose-400 font-bold border-l-2 border-rose-500' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'}"
						>
							<span>Categories</span>
							<span class="text-zinc-600 text-xs">›</span>
						</a>
					</div>
				</div>

				<!-- Section 2: NPFL Football -->
				<div>
					<span class="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 px-3 block mb-2">
						NPFL League
					</span>
					<div class="space-y-1">
						<a
							href="/npfl"
							onclick={closeMobileMenu}
							class="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors {pathname === '/npfl' ? 'bg-rose-500/10 text-rose-400 font-bold border-l-2 border-rose-500' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'}"
						>
							<span>NPFL Hub</span>
							<span class="text-zinc-600 text-xs">›</span>
						</a>
						<a
							href="/npfl/standings"
							onclick={closeMobileMenu}
							class="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors {pathname.startsWith('/npfl/standings') ? 'bg-rose-500/10 text-rose-400 font-bold border-l-2 border-rose-500' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'}"
						>
							<span>Standings Table</span>
							<span class="text-zinc-600 text-xs">›</span>
						</a>
						<a
							href="/npfl/fixtures"
							onclick={closeMobileMenu}
							class="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors {pathname.startsWith('/npfl/fixtures') || pathname.startsWith('/npfl/matchday') ? 'bg-rose-500/10 text-rose-400 font-bold border-l-2 border-rose-500' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'}"
						>
							<span>Fixtures & Scores</span>
							<span class="text-zinc-600 text-xs">›</span>
						</a>
						<a
							href="/npfl/clubs"
							onclick={closeMobileMenu}
							class="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors {pathname.startsWith('/npfl/clubs') ? 'bg-rose-500/10 text-rose-400 font-bold border-l-2 border-rose-500' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'}"
						>
							<span>Clubs Directory</span>
							<span class="text-zinc-600 text-xs">›</span>
						</a>
					</div>
				</div>

				<!-- Section 3: Company & Information -->
				<div>
					<span class="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 px-3 block mb-2">
						Information
					</span>
					<div class="space-y-1">
						<a
							href="/advertising"
							onclick={closeMobileMenu}
							class="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors {pathname.startsWith('/advertising') ? 'bg-rose-500/10 text-rose-400 font-bold border-l-2 border-rose-500' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'}"
						>
							<span>Advertising</span>
							<span class="text-zinc-600 text-xs">›</span>
						</a>
						<a
							href="/about"
							onclick={closeMobileMenu}
							class="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors {pathname.startsWith('/about') ? 'bg-rose-500/10 text-rose-400 font-bold border-l-2 border-rose-500' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'}"
						>
							<span>About</span>
							<span class="text-zinc-600 text-xs">›</span>
						</a>
						<a
							href="/contact"
							onclick={closeMobileMenu}
							class="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors {pathname.startsWith('/contact') ? 'bg-rose-500/10 text-rose-400 font-bold border-l-2 border-rose-500' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'}"
						>
							<span>Contact</span>
							<span class="text-zinc-600 text-xs">›</span>
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Drawer Footer -->
		<div class="pt-6 border-t border-zinc-800/80 mt-6 text-zinc-500 text-[10px] font-mono">
			<p class="font-semibold text-zinc-400 mb-1">Sports Unlimited</p>
			<p>© 2026 Trustymike Communications</p>
		</div>
	</aside>
{/if}

<style>
	.nav-link:hover::after {
		width: 100%;
	}
	.nav-link::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		height: 2px;
		width: 0;
		background-color: #f43f5e;
		transition: width 0.3s ease;
	}
</style>
