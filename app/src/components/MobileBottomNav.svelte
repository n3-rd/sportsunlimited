<script lang="ts">
	import { page } from '$app/stores';

	const pathname = $derived($page.url.pathname);

	const isHubActive = $derived(pathname === '/npfl');
	const isTableActive = $derived(pathname.startsWith('/npfl/standings'));
	const isMatchesActive = $derived(pathname.startsWith('/npfl/fixtures') || pathname.startsWith('/npfl/matchday'));
	const isClubsActive = $derived(pathname.startsWith('/npfl/clubs'));
</script>

<!-- Mobile Bottom Navigation Bar - Only shown in NPFL Mode -->
<nav
	class="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50 md:hidden bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-800/90 px-3 py-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
	aria-label="NPFL Mobile Navigation"
>
	<div class="max-w-md mx-auto grid grid-cols-4 items-center gap-1">
		<!-- 1. Hub / Overview -->
		<a
			href="/npfl"
			class="flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 {isHubActive ? 'text-rose-500 bg-rose-500/10' : 'text-zinc-400 hover:text-zinc-200'}"
			aria-label="NPFL Hub"
		>
			<div class="relative flex items-center justify-center">
				<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={isHubActive ? "2.2" : "1.8"} stroke-linecap="round" stroke-linejoin="round">
					<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
					<polyline points="9 22 9 12 15 12 15 22"/>
				</svg>
				{#if isHubActive}
					<span class="absolute -bottom-1 w-1 h-1 rounded-full bg-rose-500"></span>
				{/if}
			</div>
			<span class="text-[10px] font-mono font-semibold tracking-tight mt-0.5">NPFL</span>
		</a>

		<!-- 2. Standings / Table -->
		<a
			href="/npfl/standings"
			class="flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 {isTableActive ? 'text-rose-500 bg-rose-500/10' : 'text-zinc-400 hover:text-zinc-200'}"
			aria-label="League Table"
		>
			<div class="relative flex items-center justify-center">
				<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={isTableActive ? "2.2" : "1.8"} stroke-linecap="round" stroke-linejoin="round">
					<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
					<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
					<path d="M4 22h16"/>
					<path d="M10 14.66V17c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-2.34"/>
					<path d="M18 14.66V17c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-2.34"/>
					<path d="M6 2v7a6 6 0 0 0 12 0V2H6Z"/>
				</svg>
				{#if isTableActive}
					<span class="absolute -bottom-1 w-1 h-1 rounded-full bg-rose-500"></span>
				{/if}
			</div>
			<span class="text-[10px] font-mono font-semibold tracking-tight mt-0.5">Table</span>
		</a>

		<!-- 3. Matches / Fixtures -->
		<a
			href="/npfl/fixtures"
			class="flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 {isMatchesActive ? 'text-rose-500 bg-rose-500/10' : 'text-zinc-400 hover:text-zinc-200'}"
			aria-label="Matches & Fixtures"
		>
			<div class="relative flex items-center justify-center">
				<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={isMatchesActive ? "2.2" : "1.8"} stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="10"/>
					<path d="m4.93 4.93 4.24 4.24"/>
					<path d="m14.83 9.17 4.24-4.24"/>
					<path d="m14.83 14.83 4.24 4.24"/>
					<path d="m9.17 14.83-4.24 4.24"/>
					<circle cx="12" cy="12" r="2"/>
				</svg>
				{#if isMatchesActive}
					<span class="absolute -bottom-1 w-1 h-1 rounded-full bg-rose-500"></span>
				{/if}
			</div>
			<span class="text-[10px] font-mono font-semibold tracking-tight mt-0.5">Matches</span>
		</a>

		<!-- 4. Clubs Directory -->
		<a
			href="/npfl/clubs"
			class="flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 {isClubsActive ? 'text-rose-500 bg-rose-500/10' : 'text-zinc-400 hover:text-zinc-200'}"
			aria-label="NPFL Clubs"
		>
			<div class="relative flex items-center justify-center">
				<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={isClubsActive ? "2.2" : "1.8"} stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
					<path d="M12 8v4"/>
					<path d="M12 16h.01"/>
				</svg>
				{#if isClubsActive}
					<span class="absolute -bottom-1 w-1 h-1 rounded-full bg-rose-500"></span>
				{/if}
			</div>
			<span class="text-[10px] font-mono font-semibold tracking-tight mt-0.5">Clubs</span>
		</a>
	</div>
</nav>

<style>
	.mobile-bottom-nav {
		-webkit-tap-highlight-color: transparent;
	}
</style>
