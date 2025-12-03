<script lang="ts">
	import { urlFor } from "$lib/utils/image";
	import { Clock } from "svelte-radix";
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { truncateText } from "$lib/utils/index";
	import * as Carousel from "$lib/components/ui/carousel/index.js";
	import Autoplay from "embla-carousel-autoplay";
	dayjs.extend(relativeTime);

	interface Props {
		posts: any[];
	}

	let { posts }: Props = $props();

	const autoplayPlugin = Autoplay({ delay: 4000, stopOnInteraction: true });
</script>

<!-- Mobile Carousel -->
<div class="md:hidden relative">
	<Carousel.Root
		plugins={[autoplayPlugin]}
		opts={{
			align: "start",
			loop: true,
		}}
		class="relative"
		on:mousenter={autoplayPlugin.stop}
		on:mouseleave={autoplayPlugin.reset}
	>
		<Carousel.Content>
			{#each posts as post}
				<Carousel.Item class="pl-4">
					<a href={`/post/${post.slug.current}`} class="related-post-card group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden block">
						{#if post.mainImage}
							<div class="related-post-image w-full h-48 overflow-hidden">
								<img 
									src={urlFor(post.mainImage.asset).width(400).height(300).quality(80).url()} 
									alt={post.title}
									class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
									loading="lazy"
									width="400"
									height="300"
								/>
							</div>
						{/if}
						<div class="related-post-content p-4">
							<h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-600 line-clamp-2">
								{truncateText(post.title, 60)}
							</h3>
							{#if post.excerpt}
								<p class="text-sm text-gray-600 mb-3 line-clamp-2">
									{truncateText(post.excerpt, 100)}
								</p>
							{/if}
							<div class="flex items-center gap-2 text-xs text-gray-500">
								<Clock size="14" />
								<span>{dayjs(post._createdAt).fromNow()}</span>
							</div>
						</div>
					</a>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous class="md:hidden" />
		<Carousel.Next class="md:hidden" />
	</Carousel.Root>
</div>

<!-- Desktop Grid -->
<div class="hidden md:grid related-posts-grid grid-cols-2 lg:grid-cols-4 gap-6">
	{#each posts as post}
		<a href={`/post/${post.slug.current}`} class="related-post-card group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
			{#if post.mainImage}
				<div class="related-post-image w-full h-48 overflow-hidden">
					<img 
						src={urlFor(post.mainImage.asset).width(400).height(300).quality(80).url()} 
						alt={post.title}
						class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						loading="lazy"
						width="400"
						height="300"
					/>
				</div>
			{/if}
			<div class="related-post-content p-4">
				<h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-600 line-clamp-2">
					{truncateText(post.title, 60)}
				</h3>
				{#if post.excerpt}
					<p class="text-sm text-gray-600 mb-3 line-clamp-2">
						{truncateText(post.excerpt, 100)}
					</p>
				{/if}
				<div class="flex items-center gap-2 text-xs text-gray-500">
					<Clock size="14" />
					<span>{dayjs(post._createdAt).fromNow()}</span>
				</div>
			</div>
		</a>
	{/each}
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>

