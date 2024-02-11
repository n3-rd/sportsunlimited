<script>
	let showDropdown = false;
	let showMobileMenu = false;

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	function toggleMobileMenu() {
		showMobileMenu = !showMobileMenu;
	}
</script>

<section class="navigation">
	<div class="nav-container">
		<div class="brand">
			<a href="/">Sports Unlimited</a>
		</div>
		<nav>
			<div class="nav-mobile">
				<a id="nav-toggle" href="#!" on:click={toggleMobileMenu}><span /></a>
			</div>
			<ul class="nav-list" style="display: {showMobileMenu ? 'block' : 'none'};">
				<li>
					<a href="/">Home</a>
				</li>
				<li>
					<a href="/about">About</a>
				</li>
				<li>
					<a href="/contact">Contact</a>
				</li>
				<li>
					<a href="#!" on:click|stopPropagation={toggleDropdown} on:mouseenter={toggleDropdown}
						>Tags</a
					>
					<ul
						class="nav-dropdown"
						style="display: {showDropdown ? 'block' : 'none'};"
						on:mouseleave={toggleDropdown}
					>
						<li>
							<a href="/tags/Football">Football</a>
						</li>
						<li>
							<a href="/tags/Nigeria League">Nigeria League</a>
						</li>
						<li>
							<a href="/tags/Other Sports">Other Sports</a>
						</li>
						<li>
							<a href="/tags/Interview">Interviews</a>
						</li>
					</ul>
				</li>
			</ul>
		</nav>
	</div>
</section>

<style>
	/* Navigation Variables */
	/* Outer navigation wrapper */
	.navigation {
		height: 70px;
		background: #262626;
	}

	/* Logo and branding */
	.brand {
		position: absolute;
		padding-left: 20px;
		float: left;
		line-height: 70px;
		text-transform: uppercase;
		font-size: 1.4em;
	}
	.brand a,
	.brand a:visited {
		color: #ffffff;
		text-decoration: none;
	}

	/* Container with no padding for navbar */
	.nav-container {
		max-width: 1000px;
		margin: 0 auto;
	}

	/* Navigation */
	nav {
		float: right;
	}
	nav ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	nav ul li {
		float: left;
		position: relative;
	}
	nav ul li a,
	nav ul li a:visited {
		display: block;
		padding: 0 20px;
		line-height: 70px;
		background: #262626;
		color: #ffffff;
		text-decoration: none;
	}
	nav ul li a:hover {
		background: #2581dc;
		color: #ffffff;
	}
	nav ul li a:not(:only-child):after {
		padding-left: 4px;
		content: ' ▾';
	}
	nav ul li ul li {
		min-width: 190px;
	}
	nav ul li ul li a {
		padding: 15px;
		line-height: 20px;
	}

	/* Dropdown list binds to JS toggle event */
	.nav-dropdown {
		position: absolute;
		display: none;
		z-index: 1;
		box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
	}

	/* Mobile navigation */
	/* Binds to JS Toggle */
	.nav-mobile {
		display: none;
		position: absolute;
		top: 0;
		right: 0;
		background: #262626;
		height: 70px;
		width: 70px;
	}
	@media only screen and (max-width: 798px) {
		/* Hamburger nav visible on mobile only */
		.nav-mobile {
			display: block;
		}
		nav {
			/* width: 100%; */
			padding: 70px 0 15px;
		}
		nav ul {
			display: none;
		}
		nav ul li {
			float: none;
		}
		nav ul li a {
			padding: 15px;
			line-height: 20px;
		}
		nav ul li ul li a {
			padding-left: 30px;
		}
		.nav-dropdown {
			position: static;
		}
	}
	@media screen and (min-width: 799px) {
		.nav-list {
			display: block !important;
		}
	}
	#nav-toggle {
		position: absolute;
		left: 18px;
		top: 22px;
		cursor: pointer;
		padding: 10px 35px 16px 0px;
	}
	#nav-toggle span,
	#nav-toggle span:before,
	#nav-toggle span:after {
		cursor: pointer;
		border-radius: 1px;
		height: 5px;
		width: 35px;
		background: #ffffff;
		position: absolute;
		display: block;
		content: '';
		transition: all 300ms ease-in-out;
	}
	#nav-toggle span:before {
		top: -10px;
	}
	#nav-toggle span:after {
		bottom: -10px;
	}
	#nav-toggle.active span {
		background-color: transparent;
	}
	#nav-toggle.active span:before,
	#nav-toggle.active span:after {
		top: 0;
	}
	#nav-toggle.active span:before {
		transform: rotate(45deg);
	}
	#nav-toggle.active span:after {
		transform: rotate(-45deg);
	}

	/* Page content */
	article {
		max-width: 1000px;
		margin: 0 auto;
		padding: 10px;
	}
</style>
