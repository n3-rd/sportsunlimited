
<script lang="ts">
	import { truncateText } from "$lib/utils/index";
	import { urlFor, getResponsiveImageSrcset } from "$lib/utils/image";
	import { Clock } from "svelte-radix";
    import dayjs from 'dayjs';
    import relativeTime from 'dayjs/plugin/relativeTime';
	import Welcome from "./Welcome.svelte";
    dayjs.extend(relativeTime);
    

    interface Props {
        posts: any;
    }

    let { posts }: Props = $props();
</script>
{#if posts?.length}
	{#each posts as post}
		<article class="post-thumb-card">
			<a href={`/post/${post.slug.current}`} class="w-full group block">
				<div class="thumbs h-auto md:h-32 w-full flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
					<div class="post-image w-1/3 md:w-2/5 flex-shrink-0 h-28 md:h-full rounded-lg overflow-hidden">
						<img 
							src={urlFor(post.mainImage.asset).width(400).height(300).quality(85).url()} 
							srcset={getResponsiveImageSrcset(post.mainImage.asset, 400)}
							sizes="(max-width: 768px) 33vw, 40vw"
							alt={post.title}
							loading="lazy"
							fetchpriority="low"
							class="post-image w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
							width="400"
							height="300"
						>
					</div>
					<div class="post-info flex flex-col gap-2 w-2/3 md:w-3/5 justify-center">
						<h2 class="text-lg md:text-xl font-bold text-gray-900 group-hover:text-gray-600 line-clamp-2 leading-tight">
							{post.title}
						</h2>
						<div class="date flex items-center gap-2 text-sm text-gray-500">
							<Clock size="16" />
							<span>{dayjs(post._createdAt).fromNow()}</span>
							{#if post.tags && post.tags[0]}
								<span class="text-gray-400">•</span>
								<span class="text-xs font-medium text-red-600 uppercase">{post.tags[0]}</span>
							{/if}
						</div>
					</div>
				</div>
			</a>
		</article>
	{/each}
{/if}

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>