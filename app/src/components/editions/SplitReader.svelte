<script lang="ts">
	import type { Post } from '$lib/types';
	import type { EditionTheme } from '$lib/utils/editions';
	import { urlFor } from '$lib/utils/image';
	import { formatDate } from '$lib/utils/index';
	import { PortableText } from '@portabletext/svelte';
	import PortableTextImage from '$lib/components/PortableTextImage.svelte';
	import PortableTextVideo from '$lib/components/PortableTextVideo.svelte';
	import PortableTextLink from '$lib/components/PortableTextLink.svelte';
	import { onMount } from 'svelte';

	interface Props {
		post: Post | null;
		theme: EditionTheme;
		onClose: () => void;
	}

	let { post, theme, onClose }: Props = $props();

	let shareCopied = $state(false);

	const portableTextComponents = {
		types: {
			image: PortableTextImage,
			video: PortableTextVideo
		},
		marks: {
			link: PortableTextLink
		}
	};

	const imageUrl = $derived(
		post?.mainImage ? urlFor(post.mainImage).width(1400).quality(95).url() : ''
	);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}

	function handleShare() {
		if (!post) return;
		const url = `${window.location.origin}/post/${post.slug?.current}`;
		if (navigator.clipboard) {
			navigator.clipboard.writeText(url);
			shareCopied = true;
			setTimeout(() => (shareCopied = false), 2500);
		}
	}

	onMount(() => {
		document.body.style.overflow = 'hidden';
		window.addEventListener('keydown', handleKeydown);

		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if post}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
		role="dialog"
		aria-modal="true"
		aria-label={post.title}
	>
		<!-- Split Reader Canvas -->
		<div
			class="relative w-full h-full md:h-[94vh] md:max-w-[96vw] lg:max-w-[1500px] md:rounded-2xl overflow-hidden shadow-2xl bg-[#09111e] flex flex-col md:flex-row border border-white/10"
		>
			<!-- LEFT COLUMN: Deep dark editorial panel (House of Heat Inspo 2) -->
			<div
				class="w-full md:w-1/2 h-full overflow-y-auto p-6 sm:p-10 lg:p-14 flex flex-col justify-between text-white scrollbar-thin scrollbar-thumb-white/20"
			>
				<div>
					<!-- Top Branding Header -->
					<div class="flex items-center justify-between gap-4 pb-8 mb-6 border-b border-white/10">
						<div class="flex items-center gap-3">
							<div class="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">
								≡
							</div>
							<span class="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
								•Sports Unlimited°
							</span>
						</div>

						<span
							class="text-[11px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
							style="background-color: {theme.accent};"
						>
							EDITION READER
						</span>
					</div>

					<!-- Colossal Headline -->
					<h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display leading-[1.08] tracking-tight text-white mb-6">
						{post.title}
					</h1>

					{#if post.excerpt}
						<p class="text-base sm:text-lg text-zinc-300 font-serif leading-relaxed mb-8">
							{post.excerpt}
						</p>
					{/if}

					<!-- Follow & Share Row (Inspo 2 styling) -->
					<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 my-6 border-y border-white/10 text-[11px] font-mono uppercase tracking-wider">
						<div>
							<span class="text-zinc-500 block text-[10px] mb-1">SECTION</span>
							<span class="font-bold text-white px-2 py-0.5 rounded border border-white/20 inline-block">
								{(post.tags && post.tags[0]) || 'FOOTBALL'} +
							</span>
						</div>

						<div>
							<span class="text-zinc-500 block text-[10px] mb-1">SHARE</span>
							<button
								type="button"
								onclick={handleShare}
								class="font-bold text-white px-2 py-0.5 rounded border border-white/20 hover:bg-white hover:text-black transition-colors"
							>
								{shareCopied ? 'COPIED!' : 'SHARE ↗'}
							</button>
						</div>

						<div>
							<span class="text-zinc-500 block text-[10px] mb-1">WRITTEN BY</span>
							<span class="text-zinc-300 font-semibold truncate block">SPORTS UNLIMITED</span>
						</div>

						<div>
							<span class="text-zinc-500 block text-[10px] mb-1">DATE</span>
							<span class="text-zinc-300">{formatDate(post._createdAt)}</span>
						</div>
					</div>

					<!-- Story Body / PortableText Content -->
					{#if post.body && post.body.length > 0}
						<div class="prose prose-invert prose-lg max-w-none font-serif text-zinc-300 leading-relaxed pt-2">
							<PortableText value={post.body} components={portableTextComponents as any} />
						</div>
					{/if}
				</div>

				<!-- Left Column Footer: Navigation to Full Canonical Page -->
				<div class="pt-8 mt-12 border-t border-white/10 flex items-center justify-between text-xs font-mono">
					<a
						href={`/post/${post.slug?.current}`}
						class="px-4 py-2 rounded-lg bg-white text-black font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
					>
						Open Full Canonical Page →
					</a>

					<button
						type="button"
						onclick={onClose}
						class="text-zinc-400 hover:text-white uppercase tracking-wider font-semibold"
					>
						Back to Issue
					</button>
				</div>
			</div>

			<!-- RIGHT COLUMN: Full-Bleed Vertical Photo & Close Button (Inspo 2) -->
			<div class="relative w-full md:w-1/2 h-72 md:h-full bg-black overflow-hidden select-none">
				{#if imageUrl}
					<img
						src={imageUrl}
						alt={post.title}
						class="w-full h-full object-cover object-center"
					/>
				{:else}
					<div class="w-full h-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center text-zinc-700 font-display font-black text-6xl">
						SPUN
					</div>
				{/if}

				<!-- Close Button (White circle 'X' at top-right exactly like Inspo 2) -->
				<button
					type="button"
					onclick={onClose}
					class="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-white hover:bg-zinc-200 text-black shadow-2xl flex items-center justify-center text-lg font-black transition-transform hover:scale-105 active:scale-95"
					aria-label="Close reader"
				>
					✕
				</button>

				<!-- Subtle bottom gradient for image metadata -->
				<div class="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent hidden md:block">
					<span class="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
						SPORTS UNLIMITED EDITORIAL ARCHIVE // {post.title}
					</span>
				</div>
			</div>
		</div>
	</div>
{/if}
