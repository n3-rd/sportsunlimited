<script>
	  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { HamburgerMenu } from "svelte-radix";

</script>

<div class="navigation w-full">
	<div class="nav-container w-full flex flex-row items-center justify-between bg-gray-900 text-white py-5 px-5">
		<div>
			<h2 class="brand font-bold text-2xl">
				<a href="/">Sports Unlimited</a>
			</h2>
		</div>
		
	<div>
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

