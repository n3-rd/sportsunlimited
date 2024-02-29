
<script lang="ts">
	import { truncateText } from "$lib/utils/index";
	import { urlFor } from "$lib/utils/image";
	import { Clock } from "svelte-radix";
    import dayjs from 'dayjs';
    import relativeTime from 'dayjs/plugin/relativeTime';
	import Welcome from "./Welcome.svelte";
    dayjs.extend(relativeTime);
    

    export let posts:any;
</script>
{#if posts?.length}
{#each posts as post}
<a href={`/post/${post.slug.current}`} class="w-full">
    
    <div class="thumbs h-28 w-full flex gap-4 my-4">
        <div class="post-image w-1/3 aspect-w-1 aspect-h-1 self-stretch flex items-center justify-center">
            <img src={urlFor(post.mainImage.asset).url()} alt="" class="post-image w-full h-full object-cover object-center">
        </div>
        <div class="post-info flex flex-col gap-2 w-2/3">
            <h2 class="text-xl md:text-2xl font-bold">{truncateText(post.title, 40)}</h2>

        
            <div class="date flex gap-2">
                <div class="date-icon">
                    <Clock size="20" color="black" />
                </div>
                <p class="date"> {dayjs(post._createdAt).fromNow()}</p>
            </div>
        </div>
    </div>

</a>
{/each}
{:else}
<Welcome />
{/if}