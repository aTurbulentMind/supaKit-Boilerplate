<script>
	let { data, children } = $props();
	let { supabase } = $derived(data);

	const logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
	};
</script>

<br /> <br /> <br />
<aside>
	<ul>
		<li>
			<a href="/private/">Base</a>
		</li>
		<li>
			<a href="/private/account">Profile</a>
		</li>
		<li>
			<a href="/private/event_Edit">Events</a>
		</li>
		<li>
			<a href="/private/warehouse_Edit">Warehouse</a>
		</li>
		<li>
			<a href="/private/helper">Helper</a>
		</li>
	</ul>
</aside>

<footer>
	<nav>
		<a href="/">Home</a>
	</nav>
	<button class="button-Ghost" onclick={logout}>Logout</button>
</footer>
<main>
	{@render children()}
</main>

<style>
	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;

		& a {
			display: flex;
			height: 100%;
			align-items: center;
			padding: 0 0.5rem;
			color: var(--color-text);
			font-weight: 700;
			font-size: 0.8rem;
			text-transform: uppercase;
			letter-spacing: 0.1em;
			text-decoration: none;
			cursor: pointer;
			transition: color 0.2s linear;
		}

		& a:hover {
			color: var(--highlight_Alt);
		}
	}

	footer {
		background-color: var(--bg-2);
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		bottom: 0;
		width: 100vw;
		height: 5vh;
		padding: var(--space-Sm);

		& a {
			color: var(--txt-1);
		}

		@media screen and (min-width: 1024px) {
			height: 10vh;
		}
	}
</style>
