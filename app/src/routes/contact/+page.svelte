<script lang="ts">
	import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
	import Input from "$lib/components/ui/input/input.svelte";
	import Textarea from "$lib/components/ui/textarea/textarea.svelte";

    let email = 'ejemegah@yahoo.com'
    let subject:string = ''
    let message:string = ''
    let senderEmail:string = ''

    const returnToContact = ()=>{
        setTimeout(()=>{
            goto('/contact')
        }, 3000)
    
    }
</script>
<div class="min-w-screen min-h-screen flex justify-center items-center">
    <Card.Root class="w-[29rem]">
        <Card.Header>
          <Card.Title>Send an email</Card.Title>
          <Card.Description>How can we help you</Card.Description>
        </Card.Header>
        <Card.Content class="flex flex-col gap-4">
            <div class="input">
                <label for="email">Email</label>
                <Input bind:value={senderEmail} id="email" type="email" placeholder="Enter your email" />
            </div>

            <div class="input">
                <label for="subject">Subject</label>
                <Input bind:value={subject} id="subject" type="text" placeholder="Enter subject" />
            </div>

            <div class="input">
                <label for="message">Message</label>
                <Textarea bind:value={message} id="message" placeholder="Enter message" />
            </div>
        </Card.Content>
        <Card.Footer class="flex flex-col gap-2">
            <a 
                href={`mailto:${email}?subject=${subject}&body=${message}`}
                class="w-full"
            >
                <Button class="w-full" type="submit" color="primary"
                on:click={returnToContact}
                >Send</Button>
            
            </a>

            <p>
                Having trouble?, email us at ejemegah@yahoo.com
            </p>
        </Card.Footer>
      </Card.Root>
</div>
