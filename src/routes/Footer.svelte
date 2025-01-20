<footer>
	<p>
		Produced by <a href="https://www.lanternlightdevelopment.com/"> Lantern Light Development</a>
	</p>
</footer>

<!-- svelte-ignore css_unused_selector -->
<style>
	footer {
		background-color: var(--bg-2);
		display: none;
		justify-content: center;
		position: relative;
		bottom: 0;
		width: 100vw;
		height: 4vh;
	}

	p {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--size-1);
		margin: var(--size-4);
		gap: 10px;
	}

	a {
		color: var(--bg-1);
	}

	@media only screen and (min-width: 980px) {
		p {
			font-size: var(--size-4);
		}
	}
</style>
