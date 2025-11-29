<script lang="ts">
	import { urlFor, getResponsiveImageSrcset } from "$lib/utils/image";
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { Clock } from "svelte-radix";
	import { calculateReadingTime } from "$lib/utils/index";
	dayjs.extend(relativeTime);

	interface Props {
		post: any;
		size?: 'small' | 'medium' | 'large';
	}

	let { post, size = 'medium' }: Props = $props();

	const sizeClasses = {
		small: 'h-48',
		medium: 'h-64',
		large: 'h-80'
	};

	const readingTime = calculateReadingTime(post.body || []);
</script>

<a href={`/post/${post.slug.current}`} class="post-card group block h-full">
	<article class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100 group-hover:border-red-200">
		<div class="relative {sizeClasses[size]} overflow-hidden">
			<img 
				src={urlFor(post.mainImage.asset).width(800).height(600).quality(85).url()} 
				srcset={getResponsiveImageSrcset(post.mainImage.asset, 800)}
				sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
				alt={post.title}
				class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
				loading="lazy"
				fetchpriority="low"
			/>
			<div class="absolute top-4 left-4">
				{#if post.tags && post.tags[0]}
					<span class="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
						{post.tags[0]}
					</span>
				{/if}
			</div>
		</div>
		
		<div class="p-5 flex-1 flex flex-col">
			<h3 class="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2 leading-tight">
				{post.title}
			</h3>
			
			{#if post.excerpt && size !== 'small'}
				<p class="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
					{post.excerpt}
				</p>
			{/if}
			
			<div class="flex items-center gap-2 text-xs text-gray-500 mt-auto">
				<Clock size="14" />
				<span>{dayjs(post._createdAt).fromNow()}</span>
				<span class="text-gray-400">•</span>
				<span>{readingTime} min read</span>
			</div>
		</div>
	</article>
</a>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>

