<script lang="ts">
	import * as Carousel from "$lib/components/ui/carousel/index.js";
	import { urlFor, getResponsiveImageSrcset } from "$lib/utils/image";
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { Clock } from "svelte-radix";
	import Autoplay from "embla-carousel-autoplay";
	dayjs.extend(relativeTime);

	interface Props {
		posts: any[];
	}

	let { posts = [] }: Props = $props();

	const plugin = Autoplay({ delay: 5000, stopOnInteraction: true });
</script>

{#if posts && posts.length > 0}
	<div class="hero-wrapper p-1.5 md:p-2 rounded-3xl bg-zinc-900/5 ring-1 ring-zinc-900/10 shadow-sm">
		<Carousel.Root
			plugins={[plugin]}
			opts={{
				align: "start",
				loop: true,
			}}
			on:mouseenter={plugin.stop}
			on:mouseleave={plugin.reset}
			class="hero-carousel"
		>
			<Carousel.Content>
				{#each posts as post, index}
					<Carousel.Item>
						<article class="hero-post group block">
							<a href={`/post/${post.slug.current}`} class="block">
								<div class="hero-container relative h-[340px] md:h-[420px] lg:h-[480px] overflow-hidden rounded-[1.25rem] bg-zinc-950 shadow-inner">
									<img 
										src={urlFor(post.mainImage.asset).width(1200).height(600).quality(85).url()} 
										srcset={getResponsiveImageSrcset(post.mainImage.asset, 1200)}
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
										alt={post.title}
										class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-90"
										loading={index === 0 ? "eager" : "lazy"}
										fetchpriority={index === 0 ? "high" : "low"}
										decoding="async"
									/>
									<div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/45 to-transparent"></div>
									
									<div class="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
										<div class="max-w-4xl">
											<div class="flex items-center gap-2.5 mb-3.5 flex-wrap">
												{#if post.tags && post.tags[0]}
													<span class="bg-rose-600 text-white px-3 py-1 rounded-full font-mono font-bold text-[10px] uppercase tracking-widest shadow-sm">
														{post.tags[0]}
													</span>
												{/if}
												<div class="flex items-center gap-2 text-xs font-mono text-zinc-300 bg-zinc-950/60 px-3 py-1 rounded-full backdrop-blur-md ring-1 ring-white/10">
													<Clock size="13" />
													<span>{dayjs(post._createdAt).fromNow()}</span>
												</div>
											</div>
											
											<h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] mb-3 text-white group-hover:text-rose-400 transition-colors duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
												{post.title}
											</h2>
											
											{#if post.excerpt}
												<p class="text-xs sm:text-sm md:text-base text-zinc-300 font-normal leading-relaxed line-clamp-2 max-w-3xl drop-shadow-md">
													{post.excerpt}
												</p>
											{/if}
										</div>
									</div>
								</div>
							</a>
						</article>
					</Carousel.Item>
				{/each}
			</Carousel.Content>

			<Carousel.Previous class="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-zinc-950/70 hover:bg-zinc-950 text-white border border-white/20 hover:border-white/40 backdrop-blur-md rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95" />
			<Carousel.Next class="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-zinc-950/70 hover:bg-zinc-950 text-white border border-white/20 hover:border-white/40 backdrop-blur-md rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95" />
		</Carousel.Root>
	</div>
{/if}

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	:global(.hero-carousel) {
		position: relative;
	}

	:global(.hero-carousel [data-embla-viewport]) {
		overflow: visible;
	}
</style>

