<script>
	  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { HamburgerMenu, MagnifyingGlass } from "svelte-radix";
	import * as Dialog from "$lib/components/ui/dialog";

</script>



<div class="navigation w-full">
	<div class="nav-container w-full flex flex-row items-center justify-between bg-gray-900 text-white py-5 px-5">
		<div>
			<h2 class="brand font-bold text-2xl">
				<a href="/">Sports Unlimited</a>
			</h2>
		</div>
		
	<div class="flex gap-3">
		<Dialog.Root>
			<Dialog.Trigger>	<button class="search">
				<MagnifyingGlass />
			</button>
	</Dialog.Trigger>
			<Dialog.Content>
			  <Dialog.Header>
				<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
				<Dialog.Description>
				  This action cannot be undone. This will permanently delete your account
				  and remove your data from our servers.
				</Dialog.Description>
			  </Dialog.Header>
			</Dialog.Content>
		  </Dialog.Root>
	
		<div class="nav flex-row gap-4 hidden md:flex">
			<ul>
				<a href="/">Home</a>
			</ul>
			<ul>
				<a href="/about">About</a>
			</ul>
			<ul>
				<a href="/contact">Contact</a>
			</ul>
		</div>

		<div class="mobile-menu block md:hidden">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<HamburgerMenu />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
				  <DropdownMenu.Group>
					<DropdownMenu.Item>				<a href="/">Home</a>
					</DropdownMenu.Item>
					<DropdownMenu.Item>				<a href="/about">About</a>
					</DropdownMenu.Item>
					<DropdownMenu.Item>				<a href="/contact">Contact</a>
					</DropdownMenu.Item>
				  </DropdownMenu.Group>
				</DropdownMenu.Content>
			  </DropdownMenu.Root>
		</div>

	</div>
	</div>
</div>

