<script lang="ts">
	interface Props {
		variant?: 'landscape' | 'sidebar';
		isAlternative?: boolean;
		class?: string;
	}

	let { variant = 'landscape', isAlternative = false, class: className = '' }: Props = $props();

	const adUrl = 'https://www.ilotbet.com/worldcup2026/?c=WCunlimitedbanner';

	// Determine image paths
	const mobileImg = isAlternative 
		? '/ads/ILOT-WIN-A-HOUSE-FOOTBALL-IN-NIG-320X100-I.jpg' 
		: '/ads/ILOT-WIN-A-HOUSE-FOOTBALL-IN-NIG-320X100.jpg';
		
	const desktopImg = isAlternative 
		? '/ads/ILOT-WIN-A-HOUSE-SPORT%20IN%20NIG-728X90-I.jpg' 
		: '/ads/ILOT-WIN-A-HOUSE-SPORT%20IN%20NIG728X90.jpg';
</script>

<div class="banner-ad-wrapper flex justify-center w-full {className}">
	<a
		href={adUrl}
		target="_blank"
		rel="noopener noreferrer"
		class="group relative block overflow-hidden rounded-lg border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:opacity-95"
	>
		<!-- Ad Label -->
		<span class="absolute top-1 right-2 bg-black/40 text-[9px] font-bold text-white px-1.5 py-0.5 rounded backdrop-blur-xs z-10 pointer-events-none uppercase tracking-wider">
			Ad
		</span>

		{#if variant === 'sidebar'}
			<img
				src={mobileImg}
				alt="iLOT Bet World Cup 2026 Promo"
				class="w-full max-w-[320px] h-auto object-cover"
				loading="lazy"
			/>
		{:else}
			<picture class="block">
				<!-- Desktop / Tablet: 728x90 -->
				<source
					media="(min-width: 768px)"
					srcset={desktopImg}
				/>
				<!-- Mobile: 320x100 -->
				<img
					src={mobileImg}
					alt="iLOT Bet World Cup 2026 Promo"
					class="w-full max-w-[728px] md:max-w-full h-auto object-cover mx-auto"
					loading="lazy"
				/>
			</picture>
		{/if}
	</a>
</div>
