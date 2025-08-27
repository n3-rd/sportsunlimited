<script lang="ts">
	import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
	import Input from "$lib/components/ui/input/input.svelte";
	import Textarea from "$lib/components/ui/textarea/textarea.svelte";

    let email = 'sportsunlimitedng@gmail.com'
    let subject:string = $state('')
    let message:string = $state('')
    let senderEmail:string = $state('')

    const returnToContact = ()=>{
        setTimeout(()=>{
            goto('/contact')
        }, 3000)
    
    }
</script>

<svelte:head>
	<title>Contact Us | Sports Unlimited - Get in Touch</title>
	<meta name="description" content="Contact Sports Unlimited for sports news inquiries, feedback, or collaboration. Reach out via email or WhatsApp for Nigerian sports coverage questions." />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.sportsunlimited.ng/contact" />
	<meta property="og:title" content="Contact Us | Sports Unlimited" />
	<meta property="og:description" content="Contact Sports Unlimited for sports news inquiries, feedback, or collaboration. Reach out via email or WhatsApp." />
	<meta property="og:image" content="https://i.postimg.cc/CLVXPt7j/SU.png" />
	<meta property="og:site_name" content="Sports Unlimited" />
	
	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://www.sportsunlimited.ng/contact" />
	<meta name="twitter:title" content="Contact Sports Unlimited" />
	<meta name="twitter:description" content="Get in touch with Sports Unlimited for sports news inquiries and feedback." />
	<meta name="twitter:image" content="https://i.postimg.cc/CLVXPt7j/SU.png" />
	
	<!-- Additional SEO -->
	<meta name="keywords" content="contact sports unlimited, sports news contact, Nigerian sports inquiries, sports collaboration" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://www.sportsunlimited.ng/contact" />
</svelte:head>
<div class="min-w-screen min-h-screen flex flex-col gap-4 justify-center items-center">
    <Card.Root class="w-full md:w-[29rem]">
        <Card.Header>
          <Card.Title>Send an email</Card.Title>
          <Card.Description>How can we help you</Card.Description>
        </Card.Header>
        <Card.Content class="flex flex-col gap-4">
            <div class="input flex flex-col gap-2">
                <label for="email">Email</label>
                <Input bind:value={senderEmail} id="email" type="email" placeholder="Enter your email" />
            </div>

            <div class="input flex flex-col gap-2">
                <label for="subject">Subject</label>
                <Input bind:value={subject} id="subject" type="text" placeholder="Enter subject" />
            </div>

            <div class="input flex flex-col gap-2">
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
                Having trouble?, email us at {email}
            </p>
        </Card.Footer>
      </Card.Root>

      <a href="https://wa.me/2348085200935">
    <Button class="flex gap-3 bg-black ">
        <img src="/whatsapp.svg" class="h-7 w-7" alt="whatsapp icon"/>
        <span>Chat with us on whatsapp</span>
    </Button>
    </a>
</div>
