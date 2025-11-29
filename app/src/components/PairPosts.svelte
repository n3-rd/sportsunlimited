<script lang="ts">
    import { urlFor } from "$lib/utils/image";
    import { Clock } from "svelte-radix";
    import dayjs from 'dayjs';
    import relativeTime from 'dayjs/plugin/relativeTime';
    dayjs.extend(relativeTime);
   let { pair } = $props();
</script>

<div class="pair-posts grid grid-cols-1 md:grid-cols-2 gap-6">
    {#each pair as post}
        <a href={`/post/${post.slug.current}`} class="w-full group">
            <article class="post-card bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 h-full flex flex-col">
                <div class="post-image w-full h-56 overflow-hidden">
                    <img 
                        src={urlFor(post.mainImage.asset).width(600).height(400).quality(85).url()} 
                        class="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300" 
                        alt={post.title}
                        loading="lazy"
                        width="600"
                        height="400"
                    />
                </div>
                <div class="post-info flex flex-col gap-3 p-5 flex-1">
                    {#if post.tags && post.tags[0]}
                        <span class="text-xs font-semibold text-red-600 uppercase tracking-wide">
                            {post.tags[0]}
                        </span>
                    {/if}
                    <h2 class="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-gray-600 line-clamp-2 leading-tight">
                        {post.title}
                    </h2>
                    <div class="date flex items-center gap-2 text-sm text-gray-500">
                        <Clock size="16" />
                        <span>{dayjs(post._createdAt).fromNow()}</span>
                    </div>
                    {#if post.excerpt}
                        <p class="text-sm text-gray-600 line-clamp-2 flex-1">
                            {post.excerpt}
                        </p>
                    {:else if post.body && post.body[0] && post.body[0].children && post.body[0].children[0]}
                        <p class="text-sm text-gray-600 line-clamp-2 flex-1">
                            {post.body[0].children[0].text.substring(0, 120)}{post.body[0].children[0].text.length > 120 ? '...' : ''}
                        </p>
                    {/if}
                </div>
            </article>
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