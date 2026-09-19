<script lang="ts">
	import SEO from '../../components/SEO.svelte';
	import NPFLTable from '../../components/NPFLTable.svelte';
	import NPFLFixtures from '../../components/NPFLFixtures.svelte';
	import PostCard from '../../components/PostCard.svelte';
	import { clubToSlug, getClubLogo, KNOWN_CLUB_SLUGS } from '$lib/npfl';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Robust club list: prefer live table rows, fallback to known club slugs so it is NEVER empty
	const clubsList = $derived.by(() => {
		if (data.table && data.table.length > 0) {
			return data.table.map((r: any) => ({
				name: r.club,
				slug: r.slug || clubToSlug(r.club),
				logo: r.logo || getClubLogo(r.slug || clubToSlug(r.club))
			}));
		}
		return KNOWN_CLUB_SLUGS.slice(0, 20).map((slug) => ({
			name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
			slug,
			logo: getClubLogo(slug)
		}));
	});

	const leaderClub = $derived(data.table && data.table.length > 0 ? data.table[0] : null);

	// High-ranking SEO Schemas
	const siteUrl = 'https://www.sportsunlimited.ng';

	const npflOrgSchema = {
		'@context': 'https://schema.org',
		'@type': 'SportsOrganization',
		name: 'Nigeria Premier Football League',
		alternateName: ['NPFL', 'Nigerian Premier League', 'Nigeria Premier League', 'NPFL Nigeria', 'Nigerian Top Flight'],
		sport: 'Soccer',
		url: `${siteUrl}/npfl`,
		logo: 'https://i.postimg.cc/CLVXPt7j/SU.png',
		description: 'Official real-time coverage of the Nigeria Premier Football League (NPFL), featuring live standings, upcoming fixtures, matchday results, club profiles, and sports journalism.'
	};

	const leagueSeriesSchema = {
		'@context': 'https://schema.org',
		'@type': 'SportsEventSeries',
		name: 'Nigeria Premier Football League 2025/2026 Season',
		sport: 'Soccer',
		url: `${siteUrl}/npfl`,
		organizer: {
			'@type': 'SportsOrganization',
			name: 'Nigeria Premier Football League (NPFL)'
		}
	};

	const faqSchema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: 'How many clubs compete in the Nigeria Premier Football League (NPFL)?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'The Nigeria Premier Football League (NPFL) consists of 20 elite professional football clubs competing across 38 matchdays in a home-and-away round-robin format.'
				}
			},
			{
				'@type': 'Question',
				name: 'Which NPFL teams qualify for the CAF Champions League?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'The champion (1st position) and the runner-up (2nd position) in the final NPFL table qualify directly to represent Nigeria in the prestigious CAF Champions League.'
				}
			},
			{
				'@type': 'Question',
				name: 'Which NPFL teams qualify for the CAF Confederation Cup?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'The team finishing 3rd in the NPFL standings, alongside the winner of the President Federation Cup (formerly Aiteo Cup / FA Cup), qualifies for the CAF Confederation Cup.'
				}
			},
			{
				'@type': 'Question',
				name: 'How many teams are relegated from the NPFL each season?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'The bottom four teams (positions 17, 18, 19, and 20) at the end of the 38-game season are automatically relegated to the Nigeria National League (NNL).'
				}
			},
			{
				'@type': 'Question',
				name: 'Where can I find live NPFL table standings and upcoming fixtures?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Sports Unlimited publishes live updated NPFL tables, matchday results, upcoming fixtures, club profiles, and in-depth match previews at https://www.sportsunlimited.ng/npfl.'
				}
			}
		]
	};

	const breadcrumbSchema = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Home',
				item: siteUrl
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'NPFL Hub',
				item: `${siteUrl}/npfl`
			}
		]
	};

	const combinedSchemas = [npflOrgSchema, leagueSeriesSchema, faqSchema, breadcrumbSchema];
</script>

<SEO
	title="NPFL Live Hub - Nigeria Premier Football League Standings, Fixtures, Scores & Clubs | Sports Unlimited"
	description="Official Nigeria Premier Football League (NPFL) hub on Sports Unlimited. Real-time 2025/2026 NPFL table standings, upcoming matchday fixtures, live scores, 20 club profiles, stadiums, and Nigerian football journalism."
	keywords="NPFL, Nigeria Premier Football League, NPFL table, NPFL standings, NPFL fixtures, NPFL results, Nigerian football league, NPFL live scores, NPFL matchday, Enyimba FC, Remo Stars, Rangers International, Shooting Stars 3SC, Kano Pillars, Rivers United"
	schemaorg={combinedSchemas}
/>

<div class="npfl-hub-page w-full">
	<!-- Page Header & Hub Navigation -->
	<header class="mb-8 pb-6 border-b border-zinc-200/80 flex flex-col md:flex-row md:items-end justify-between gap-5">
		<div>
			<div class="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-widest text-rose-600 font-semibold">
				<span class="w-2 h-2 rounded-full bg-rose-600"></span>
				<span>Official League Center</span>
			</div>
			<h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight">
				NPFL Football Hub
			</h1>
			<p class="text-zinc-600 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
				Live standings, upcoming fixtures, club profiles, and premier Nigerian football journalism across all 38 matchdays.
			</p>
		</div>

		<!-- Quick Hub Navigation Pills -->
		<nav class="flex items-center gap-2 flex-wrap" aria-label="NPFL Sections">
			<span class="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-white bg-zinc-950 shadow-sm">
				NPFL Hub
			</span>
			<a
				href="/npfl/standings"
				class="px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors"
			>
				Standings
			</a>
			<a
				href="/npfl/fixtures"
				class="px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors"
			>
				Fixtures
			</a>
			<a
				href="/npfl/matchday"
				class="px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors"
			>
				Matchday
			</a>
			<a
				href="/npfl/clubs"
				class="px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors"
			>
				Clubs
			</a>
		</nav>
	</header>

	<!-- Main Hub Grid Layout -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- Left 2 Cols: Spotlight Matches + News + SEO Content + FAQs -->
		<div class="lg:col-span-2 space-y-12">
			<!-- Spotlight Matches -->
			<section aria-labelledby="matches-heading">
				<div class="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100">
					<div class="flex items-center gap-2.5">
						<h2 id="matches-heading" class="text-lg md:text-xl font-black text-zinc-950 tracking-tight">
							Upcoming & Active Matches
						</h2>
						{#if data.currentMatchday}
							<span class="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-[11px] font-mono font-bold">
								Matchday {data.currentMatchday}
							</span>
						{/if}
					</div>
					<a
						href="/npfl/fixtures"
						class="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-rose-600 transition-colors flex items-center gap-1"
					>
						<span>All Fixtures</span>
						<span>↗</span>
					</a>
				</div>

				{#if data.fixtures && data.fixtures.length > 0}
					<NPFLFixtures fixtures={data.fixtures} limit={6} compact={false} />
				{:else}
					<div class="bg-zinc-50 rounded-2xl p-6 text-center border border-zinc-200/80">
						<p class="text-zinc-700 font-semibold text-sm mb-1">Upcoming Fixtures in Preparation</p>
						<p class="text-zinc-500 text-xs font-mono mb-4">Official match schedules and kickoff times are updated daily.</p>
						<a
							href="/npfl/fixtures"
							class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-mono font-bold transition-colors shadow-sm"
						>
							Explore Full Fixture Schedule →
						</a>
					</div>
				{/if}
			</section>

			<!-- NPFL News & Analysis -->
			{#if data.articles && data.articles.length > 0}
				<section aria-labelledby="dispatches-heading">
					<div class="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100">
						<h2 id="dispatches-heading" class="text-lg md:text-xl font-black text-zinc-950 tracking-tight">
							Latest League Dispatches
						</h2>
						<a
							href="/tags/npfl"
							class="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-rose-600 transition-colors flex items-center gap-1"
						>
							<span>More Stories</span>
							<span>↗</span>
						</a>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						{#each data.articles as article}
							<PostCard post={article} size="small" />
						{/each}
					</div>
				</section>
			{/if}

			<!-- Authoritative Editorial SEO Content: NPFL Guide & Regulations -->
			<section class="bg-zinc-50/80 rounded-3xl border border-zinc-200/80 p-6 md:p-8 space-y-6" aria-labelledby="npfl-guide-heading">
				<div>
					<span class="text-xs font-mono font-bold uppercase tracking-wider text-rose-600">Competition Guide</span>
					<h2 id="npfl-guide-heading" class="text-xl md:text-2xl font-black text-zinc-950 mt-1 tracking-tight">
						Nigeria Premier Football League (NPFL) Overview
					</h2>
					<p class="text-zinc-600 text-sm leading-relaxed mt-2.5">
						The <strong>Nigeria Premier Football League (NPFL)</strong> is the pinnacle of professional club football in Nigeria. Regulated under the Nigeria Football Federation (NFF), the league showcases 20 premier clubs battling over a grueling 38-game season for the national crown, continental tickets, and pride of Nigerian football.
					</p>
				</div>

				<!-- Key Competition Stakes Grid -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
					<div class="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-2xs">
						<div class="flex items-center gap-2 mb-1.5">
							<span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
							<h3 class="text-xs font-bold font-mono uppercase tracking-wider text-zinc-900">Champions</h3>
						</div>
						<p class="text-xs text-zinc-600 leading-normal">
							NPFL title winners lift the prestigious trophy and claim Nigeria's #1 seed in the <strong>CAF Champions League</strong>.
						</p>
					</div>

					<div class="bg-white rounded-2xl border border-emerald-200/80 p-4 shadow-2xs">
						<div class="flex items-center gap-2 mb-1.5">
							<span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
							<h3 class="text-xs font-bold font-mono uppercase tracking-wider text-zinc-900">Continental Berths</h3>
						</div>
						<p class="text-xs text-zinc-600 leading-normal">
							2nd place enters the <strong>CAF Champions League</strong>, while 3rd place and the Federation Cup champion qualify for the <strong>CAF Confederation Cup</strong>.
						</p>
					</div>

					<div class="bg-white rounded-2xl border border-rose-200/80 p-4 shadow-2xs">
						<div class="flex items-center gap-2 mb-1.5">
							<span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
							<h3 class="text-xs font-bold font-mono uppercase tracking-wider text-zinc-900">Relegation Zone</h3>
						</div>
						<p class="text-xs text-zinc-600 leading-normal">
							Teams finishing in positions 17th through 20th suffer automatic relegation to the second-tier <strong>Nigeria National League (NNL)</strong>.
						</p>
					</div>
				</div>
			</section>

			<!-- High-Intent NPFL FAQs (Targets Google FAQ Rich Snippets) -->
			<section class="space-y-4" aria-labelledby="faq-heading">
				<div class="border-b border-zinc-100 pb-2">
					<span class="text-xs font-mono font-bold uppercase tracking-wider text-rose-600">Search FAQ</span>
					<h2 id="faq-heading" class="text-lg md:text-xl font-black text-zinc-950 tracking-tight mt-0.5">
						Frequently Asked Questions About the NPFL
					</h2>
				</div>

				<div class="space-y-3">
					<details class="group bg-white rounded-2xl border border-zinc-200/80 p-4 open:shadow-sm transition-all">
						<summary class="flex items-center justify-between font-bold text-sm text-zinc-900 cursor-pointer list-none">
							<span>How many clubs participate in the NPFL?</span>
							<span class="text-zinc-400 group-open:rotate-180 transition-transform font-mono text-xs">▼</span>
						</summary>
						<p class="text-xs text-zinc-600 leading-relaxed mt-2.5 pt-2 border-t border-zinc-100">
							The NPFL features exactly 20 professional clubs representing states across all geopolitical zones in Nigeria. Each club plays every other team twice (home and away), resulting in a 38-game schedule with 380 total matches per season.
						</p>
					</details>

					<details class="group bg-white rounded-2xl border border-zinc-200/80 p-4 open:shadow-sm transition-all">
						<summary class="flex items-center justify-between font-bold text-sm text-zinc-900 cursor-pointer list-none">
							<span>Which NPFL teams qualify for African continental competitions?</span>
							<summary-icon class="text-zinc-400 group-open:rotate-180 transition-transform font-mono text-xs">▼</summary-icon>
						</summary>
						<p class="text-xs text-zinc-600 leading-relaxed mt-2.5 pt-2 border-t border-zinc-100">
							Nigeria receives four continental qualification slots: the 1st and 2nd placed clubs in the NPFL table qualify for the CAF Champions League, while the 3rd placed club and the winner of the President Federation Cup qualify for the CAF Confederation Cup.
						</p>
					</details>

					<details class="group bg-white rounded-2xl border border-zinc-200/80 p-4 open:shadow-sm transition-all">
						<summary class="flex items-center justify-between font-bold text-sm text-zinc-900 cursor-pointer list-none">
							<span>How does relegation work in the Nigerian League?</span>
							<summary-icon class="text-zinc-400 group-open:rotate-180 transition-transform font-mono text-xs">▼</summary-icon>
						</summary>
						<p class="text-xs text-zinc-600 leading-relaxed mt-2.5 pt-2 border-t border-zinc-100">
							At the end of Matchday 38, the bottom 4 teams (positions 17, 18, 19, and 20) are relegated to the Nigeria National League (NNL), replaced by the 4 promoted clubs from the NNL Super 8 playoff tournament.
						</p>
					</details>

					<details class="group bg-white rounded-2xl border border-zinc-200/80 p-4 open:shadow-sm transition-all">
						<summary class="flex items-center justify-between font-bold text-sm text-zinc-900 cursor-pointer list-none">
							<span>Who are the most successful clubs in NPFL history?</span>
							<summary-icon class="text-zinc-400 group-open:rotate-180 transition-transform font-mono text-xs">▼</summary-icon>
						</summary>
						<p class="text-xs text-zinc-600 leading-relaxed mt-2.5 pt-2 border-t border-zinc-100">
							Enyimba International FC of Aba leads Nigerian football with 9 league titles and 2 CAF Champions League crowns, followed by Rangers International FC of Enugu with 8 league titles. Other historic giants include Shooting Stars SC (3SC), Kano Pillars, and Heartland FC.
						</p>
					</details>
				</div>
			</section>
		</div>

		<!-- Right 1 Col: Standings Leaderboard + Clubs Directory + Quick Stats -->
		<div class="space-y-8">
			<!-- League Table Preview -->
			<section class="bg-white rounded-3xl border border-zinc-200/90 p-5 shadow-sm" aria-labelledby="table-preview-heading">
				<div class="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100">
					<div>
						<h3 id="table-preview-heading" class="text-base font-black text-zinc-950">League Table</h3>
						<p class="text-[11px] font-mono text-zinc-400">Top 6 Leaders</p>
					</div>
					<a
						href="/npfl/standings"
						class="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-rose-600 transition-colors flex items-center gap-1"
					>
						<span>Full Table</span>
						<span>↗</span>
					</a>
				</div>

				{#if data.table && data.table.length > 0}
					<NPFLTable table={data.table} limit={6} compact={true} />
					<div class="mt-3 pt-2 text-center">
						<a
							href="/npfl/standings"
							class="inline-block w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-mono font-bold transition-colors shadow-2xs text-center"
						>
							View Complete 20-Club Table →
						</a>
					</div>
				{:else}
					<div class="py-6 text-center space-y-2">
						<div class="w-6 h-6 border-2 border-zinc-300 border-t-rose-600 rounded-full animate-spin mx-auto"></div>
						<p class="text-zinc-500 text-xs font-mono">Fetching latest live standings...</p>
					</div>
				{/if}
			</section>

			<!-- All 20 NPFL Clubs Directory Grid -->
			<section class="bg-white rounded-3xl border border-zinc-200/90 p-5 shadow-sm" aria-labelledby="clubs-grid-heading">
				<div class="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100">
					<div>
						<h3 id="clubs-grid-heading" class="text-base font-black text-zinc-950">NPFL Clubs</h3>
						<p class="text-[11px] font-mono text-zinc-400">20 Premier Division Teams</p>
					</div>
					<a
						href="/npfl/clubs"
						class="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-rose-600 transition-colors flex items-center gap-1"
					>
						<span>Directory</span>
						<span>↗</span>
					</a>
				</div>

				<div class="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2 pt-1">
					{#each clubsList as club}
						<a
							href={`/npfl/clubs/${club.slug}`}
							title={club.name}
							class="aspect-square rounded-xl bg-zinc-50 hover:bg-rose-50/50 border border-zinc-200/80 hover:border-rose-200 p-2 flex items-center justify-center transition-all hover:scale-105 shadow-2xs group"
						>
							{#if club.logo}
								<img
									src={club.logo}
									alt={`${club.name} badge`}
									class="max-w-full max-h-full object-contain"
									loading="lazy"
								/>
							{:else}
								<span class="text-[10px] font-mono font-bold text-zinc-500 group-hover:text-rose-600">
									{club.name.slice(0, 3).toUpperCase()}
								</span>
							{/if}
						</a>
					{/each}
				</div>

				<div class="mt-4 pt-2 text-center border-t border-zinc-100">
					<a
						href="/npfl/clubs"
						class="text-xs font-mono font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center justify-center gap-1"
					>
						<span>Browse All 20 Club Profiles</span>
						<span>→</span>
					</a>
				</div>
			</section>

			<!-- League Quick Facts Card -->
			<section class="bg-zinc-950 text-white rounded-3xl p-5 shadow-sm space-y-4" aria-labelledby="facts-heading">
				<div class="border-b border-zinc-800 pb-2">
					<span class="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-400">League Snapshot</span>
					<h3 id="facts-heading" class="text-base font-bold text-white mt-0.5">NPFL Season Facts</h3>
				</div>

				<div class="grid grid-cols-2 gap-3 text-xs font-mono">
					<div class="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
						<span class="text-zinc-400 text-[10px] uppercase block">Clubs</span>
						<span class="text-lg font-black text-white">20 Teams</span>
					</div>
					<div class="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
						<span class="text-zinc-400 text-[10px] uppercase block">Total Fixtures</span>
						<span class="text-lg font-black text-white">380 Games</span>
					</div>
					<div class="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
						<span class="text-zinc-400 text-[10px] uppercase block">Current Matchday</span>
						<span class="text-lg font-black text-rose-400">
							{data.currentMatchday ? `MD ${data.currentMatchday}` : 'Active'}
						</span>
					</div>
					<div class="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
						<span class="text-zinc-400 text-[10px] uppercase block">Table Leader</span>
						<span class="text-xs font-bold text-amber-400 truncate block mt-1">
							{leaderClub ? leaderClub.club : 'Competitive'}
						</span>
					</div>
				</div>
			</section>
		</div>
	</div>
</div>
