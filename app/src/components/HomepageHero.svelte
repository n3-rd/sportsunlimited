<script lang="ts">
	import * as Carousel from "$lib/components/ui/carousel/index.js";
	import { urlFor } from "$lib/utils/image";
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
	<Carousel.Root
		plugins={[plugin]}
		opts={{
			align: "start",
			loop: true,
		}}
		on:mousenter={plugin.stop}
		on:mouseleave={plugin.reset}
		class="hero-carousel"
	>
		<Carousel.Content>
			{#each posts as post, index}
				<Carousel.Item>
					<article class="hero-post group block">
						<a href={`/post/${post.slug.current}`} class="block">
							<div class="hero-container relative h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden rounded-xl shadow-lg">
								<img 
									src={urlFor(post.mainImage.asset).width(1200).height(600).quality(90).url()} 
									alt={post.title}
									class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									loading={index === 0 ? "eager" : "lazy"}
								/>
								<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10"></div>
								
								<div class="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
									<div class="max-w-4xl">
										<div class="flex items-center gap-3 mb-4 flex-wrap">
											{#if post.tags && post.tags[0]}
												<span class="bg-red-600 px-3 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg">
													{post.tags[0]}
												</span>
											{/if}
											<div class="flex items-center gap-2 text-xs opacity-90 bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-sm">
												<Clock size="14" />
												<span>{dayjs(post._createdAt).fromNow()}</span>
											</div>
										</div>
										
										<h1 class="text-2xl md:text-3xl lg:text-4xl font-black leading-tight mb-3 group-hover:text-red-500 transition-colors duration-300 drop-shadow-lg">
											{post.title}
										</h1>
										
										{#if post.excerpt}
											<p class="text-sm md:text-base lg:text-lg text-gray-100 leading-relaxed line-clamp-2 max-w-3xl drop-shadow">
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

		<Carousel.Previous class="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-900 shadow-lg" />
		<Carousel.Next class="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-900 shadow-lg" />
	</Carousel.Root>
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

