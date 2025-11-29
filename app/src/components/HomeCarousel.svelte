<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
    	import dayjs from 'dayjs';
        import relativeTime from 'dayjs/plugin/relativeTime';
        dayjs.extend(relativeTime);
	import { urlFor } from "$lib/utils/image";
    import Autoplay from "embla-carousel-autoplay";
 
  const plugin = Autoplay({ delay: 4000, stopOnInteraction: true });

  let { items } = $props();

</script>

<Carousel.Root
plugins={[plugin]}
opts={{
   align: "start",
   loop: true,

 }}
   on:mousenter={plugin.stop}
on:mouseleave={plugin.reset}
>
   <Carousel.Content>
       {#if items?.length}
           {#each items as post}
               <Carousel.Item>
           <a href={`/post/${post.slug.current}`} class="w-full">

                   <div class="carousel-post w-full h-[28rem] bg-cover bg-top relative"
                       style="background-image: url({urlFor(post.mainImage.asset).width(800).height(450).quality(80).url()}) "
                   >
                       <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex flex-col gap-3 px-6 md:px-10 py-6 md:py-8 text-white">
                           <div class="info flex items-center gap-3 text-sm">
                               <span class="date capitalize bg-white/20 px-3 py-1 rounded-full">
                                   {dayjs(post._createdAt).fromNow()}
                               </span>
                               {#if post.tags && post.tags[0]}
                               <span class="tag bg-red-600 px-3 py-1 rounded-full font-semibold text-xs uppercase tracking-wide">
                                   {post.tags[0]}
                               </span>
                               {/if}
                           </div>
                        
                               <h1 class="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
                                {post.title}
                               </h1>
                          
                       </div>
                   </div>
                   </a>
               </Carousel.Item>
           {/each}
       {/if}
   </Carousel.Content>

   <Carousel.Previous class="hidden md:block" />
   <Carousel.Next  class="hidden md:block"/>
</Carousel.Root>