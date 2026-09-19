<script lang="ts">
	import SEO from '../../../components/SEO.svelte';

	interface Props {
		data: {
			clubs: any[];
		};
	}

	let { data }: Props = $props();
</script>

<SEO
	title="NPFL Clubs & Teams | Sports Unlimited"
	description="Complete directory of Nigeria Premier Football League (NPFL) clubs, team profiles, standings, stadiums, and fixtures."
	canonical="https://www.sportsunlimited.ng/npfl/clubs"
/>

<main class="npfl-clubs-page max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
	<!-- Page Header -->
	<div class="mb-10 pb-6 border-b border-zinc-200/80">
		<div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
			<div>
				<div class="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-widest text-rose-600 font-semibold">
					<span>Nigeria Premier Football League</span>
				</div>
				<h1 class="text-3xl md:text-5xl font-black tracking-tight text-zinc-950">
					NPFL Clubs & Profiles
				</h1>
				<p class="text-zinc-500 text-sm md:text-base mt-2 max-w-2xl">
					Live profiles, official crests, current standings, home grounds, and fixture logs for all NPFL clubs.
				</p>
			</div>

			<!-- Quick Hub Nav -->
			<div class="flex items-center gap-2 flex-wrap">
				<a href="/npfl/standings" class="px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors">
					Standings
				</a>
				<a href="/npfl/fixtures" class="px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors">
					Fixtures
				</a>
				<a href="/npfl/matchday" class="px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors">
					Matchdays
				</a>
				<span class="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-white bg-zinc-950">
					All Clubs
				</span>
			</div>
		</div>
	</div>

	<!-- Clubs Grid -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
		{#each data.clubs as club}
			<a
				href={`/npfl/clubs/${club.slug}`}
				class="club-card group bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-400 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
			>
				<div>
					<!-- Top Row: Logo & Position -->
					<div class="flex items-start justify-between gap-3 mb-4">
						<div class="w-16 h-16 rounded-xl bg-zinc-50 border border-zinc-100 p-2 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
							{#if club.logo}
								<img
									src={club.logo}
									alt={`${club.club} logo`}
									class="max-w-full max-h-full object-contain"
									loading="lazy"
								/>
							{:else}
								<div class="w-full h-full rounded-lg bg-zinc-900 text-white flex items-center justify-center font-black text-sm font-mono">
									{club.club.slice(0, 3).toUpperCase()}
								</div>
							{/if}
						</div>

						<div class="text-right">
							<span class="inline-block px-2.5 py-1 rounded-full text-xs font-mono font-bold {club.pos <= 3 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : club.pos >= 18 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-zinc-100 text-zinc-700 border border-zinc-200'}">
								#{club.pos} in NPFL
							</span>
							<div class="text-lg font-mono font-black text-zinc-950 mt-1">
								{club.points} <span class="text-xs font-normal text-zinc-400 font-sans">pts</span>
							</div>
						</div>
					</div>

					<!-- Club Name -->
					<h3 class="text-lg font-bold text-zinc-950 group-hover:text-rose-600 transition-colors leading-snug mb-1.5">
						{club.club}
					</h3>

					<!-- Stadium -->
					<div class="flex items-center gap-1.5 text-xs text-zinc-500 mb-4">
						<span>📍</span>
						<span class="truncate">{club.stadium}</span>
					</div>
				</div>

				<!-- Stats Footer -->
				<div class="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-600">
					<div class="flex items-center gap-2.5">
						<span><strong class="text-zinc-900">{club.played}</strong> P</span>
						<span>•</span>
						<span><strong class="text-zinc-900">{club.win}</strong> W</span>
						<span>•</span>
						<span><strong class="text-zinc-900">{club.draw}</strong> D</span>
						<span>•</span>
						<span><strong class="text-zinc-900">{club.loss}</strong> L</span>
					</div>
					<span class="text-zinc-400 group-hover:text-rose-600 text-sm font-sans transition-transform group-hover:translate-x-0.5">
						↗
					</span>
				</div>
			</a>
		{/each}
	</div>
</main>
