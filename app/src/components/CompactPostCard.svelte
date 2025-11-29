<script lang="ts">
	import { urlFor } from "$lib/utils/image";
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { Clock } from "svelte-radix";
	dayjs.extend(relativeTime);

	interface Props {
		post: any;
	}

	let { post }: Props = $props();
</script>

<a href={`/post/${post.slug.current}`} class="compact-post-card group block">
	<article class="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-sm">
		<div class="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden">
			<img 
				src={urlFor(post.mainImage.asset).width(300).height(300).quality(80).url()} 
				alt={post.title}
				class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
				loading="lazy"
			/>
		</div>
		
		<div class="flex-1 min-w-0 flex flex-col justify-center">
			<h3 class="text-base md:text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
				{post.title}
			</h3>
			<div class="flex items-center gap-2 text-xs text-gray-500">
				<Clock size="12" />
				<span>{dayjs(post._createdAt).fromNow()}</span>
				{#if post.tags && post.tags[0]}
					<span class="text-gray-400">•</span>
					<span class="text-red-600 font-semibold text-xs uppercase">{post.tags[0]}</span>
				{/if}
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

