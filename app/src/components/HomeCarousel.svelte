<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
    	import dayjs from 'dayjs';
        import relativeTime from 'dayjs/plugin/relativeTime';
        dayjs.extend(relativeTime);
	import { urlFor } from "$lib/utils/image";
    import Autoplay from "embla-carousel-autoplay";
 
  const plugin = Autoplay({ delay: 4000, stopOnInteraction: true });

  export let items;

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
                       style="background-image: url({urlFor(post.mainImage.asset).url()}) "
                   >
                       <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900 flex flex-col gap-3 px-10 py-5 text-white">
                           <div class="info flex gap-2">
                               <p class="date capitalize">
                                   {dayjs(post._createdAt).fromNow()}
                                
                               </p>
                               {#if post.tags}
                               <p>-</p>
                               <p class="tag">
                                   {post.tags[0]}
                               </p>
                               {/if}
                           </div>
                        
                               <h1 class="text-3xl font-bold">
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