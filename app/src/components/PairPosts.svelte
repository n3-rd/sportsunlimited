<script lang="ts">
    import { urlFor } from "$lib/utils/image";
    import { Clock } from "svelte-radix";
    import dayjs from 'dayjs';
    import relativeTime from 'dayjs/plugin/relativeTime';
    dayjs.extend(relativeTime);
   let { pair } = $props();
    console.log('pair',pair);
</script>

<style>
    .post {
        width: 100%;
    }
</style>

<div class="pair-posts grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each pair as post}
   <a href={`/post/${post.slug.current}`} class="w-full">

    <div class="post flex gap-4 w-full">
        <div class="post-image w-1/3 h-56">
            <img 
                src={urlFor(post.mainImage.asset).width(400).height(300).quality(80).url()} 
                class="h-full w-full object-cover object-center" 
                alt={post.title}
                loading="lazy"
                width="400"
                height="300"
            />
        </div>
        <div class="post-info flex flex-col gap-3 w-2/3">
            <h2 class="text-2xl font-bold">{post.title}</h2>
            <div class="date flex gap-2">
            <div class="date-icon">
                <Clock 
                    size="20" 
                    color="black" 
                  
                />
            </div>

            <p class="date">  {dayjs(post._createdAt).fromNow()}</p>
           </div>
            <p class="text-sm">
                {post.body[0].children[0].text.substring(0, 50)}{post.body[0].children[0].text.length > 50 ? '...' : ''}
            </p>
            </div>
    </div>
    </a>
    {/each}
</div>