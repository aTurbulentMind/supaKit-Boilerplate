<script lang="ts">
	import { onMount } from 'svelte';
	import { findMatchingImage } from '$lib/assets/utils/eve_utils.js';

	//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

	interface Props {
		data: any;
	}

	let { data }: Props = $props();

	let { flyers, existingEvents } = $state(data);

	$inspect({ flyers, existingEvents });
	//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

	// Helper function to compare event dates with the current date
	function isUpcomingEvent(event) {
		const today = new Date();
		const eventDate = new Date(event.event_date);
		return eventDate >= today;
	}

	//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

	// Sort events by date and find the first future event
	let sortedEvents = existingEvents.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
	let nextEvent = sortedEvents.find(isUpcomingEvent) || null;

	// Find matching image for the next event, if it exists
	let nextEventImage = nextEvent ? findMatchingImage(nextEvent.event_name, flyers) : null;

	// Add timestamp on the client only using onMount
	let nextEventImageUrl = $state(nextEventImage ? nextEventImage.url : null);

	//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

	onMount(() => {
		if (nextEventImageUrl) {
			nextEventImageUrl = `${nextEventImage.url}?t=${new Date().getTime()}`;
		}
	});
</script>

<svelte:head>
	<title>supabase Boilerplate. This is a test.</title>
	<meta name="description" content="Welcome to supabase Boilerplate. This is a test." />
	<meta name="keywords" content="Welcome to supabase Boilerplate. This is a test." />
	<meta property="og:title" content="supabase Boilerplate. " />
	<meta property="og:description" content="Welcome to supabase Boilerplate. This is a test." />
	<!-- <meta property="og:image" content="/path/to/your/image.jpg" /> -->
	<!-- <meta property="og:url" content="https://www.yourwebsite.com" /> -->
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<header>
	<div class="hero-content">
		<h1>supabase Boilerplate.</h1>
		<section class="event_Card">
			{#if nextEvent}
				<article class="event-details">
					<h2>{nextEvent.event_name}</h2>

					{#if nextEventImageUrl}
						<article class="event-flyer">
							<figure>
								<img src={nextEventImageUrl} alt="Event Flyer" />
							</figure>
						</article>
					{:else}
						<p>No matching flyer found.</p>
					{/if}
					<p>{nextEvent.description}</p>
					<p>{nextEvent.event_date.split('T')[0]}</p>
					<p>{nextEvent.location}</p>
				</article>
			{/if}
		</section>
	</div>
</header>

<section>
	<h1>
		Welcome to supabase Boilerplate. This is a test. Some of the text in this may be weird. I built
		it for a roller derby website as a test. I am currently working on the Content management system
		now.
	</h1>

	<h2>filler txt to see the navbar</h2>

	<p>
		Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque facere deleniti placeat mollitia,
		tenetur voluptatem! Placeat laborum doloremque cum eius nihil corrupti reiciendis quaerat
		assumenda sapiente alias dolore temporibus expedita perferendis distinctio labore totam, fugit
		tempora praesentium nostrum eum soluta eaque doloribus nemo? Tempora, unde hic! Voluptatum iure
		soluta ducimus, cupiditate delectus, quisquam ex asperiores ipsum, itaque aperiam reprehenderit
		dolore exercitationem ullam. Maiores facere, dolor porro sed iste est laborum harum officia
		perferendis esse ipsum explicabo dolores, fugiat iure doloremque sint excepturi dolorem
		consequatur expedita debitis repudiandae quas adipisci corporis quae. Dolore totam architecto
		quas nostrum neque voluptatem pariatur. Rem molestiae nostrum culpa nulla impedit nisi,
		voluptatem eius quod facilis aliquam reprehenderit cum! Repellat recusandae unde nobis minima
		laudantium. Itaque doloribus quia incidunt hic aut delectus perspiciatis, labore error dolores
		natus rem quas. Voluptatibus asperiores, nobis blanditiis saepe quo repellendus porro dolores
		laboriosam maxime quam obcaecati similique, maiores consequatur iste alias quia minus doloribus
		necessitatibus id, repudiandae sit beatae aut eos? Expedita, corporis maiores? Saepe iste rem
		tenetur fuga asperiores repudiandae autem ab, nulla dolorum laborum consectetur quos iusto
		assumenda molestias magnam odio excepturi, deleniti dolorem? Expedita dolores dolorem, voluptate
		qui eaque illum debitis facere ipsa ducimus autem facilis ea placeat, maxime veniam aliquid
		rerum architecto asperiores? Cumque assumenda eligendi doloremque, vero sint nulla. In id
		perferendis pariatur corporis provident odio eius recusandae hic cumque vitae obcaecati vel
		voluptates, unde ipsum tempore velit?
	</p>
</section>

<!--svelte-ignore css_unused_selector -->
<style>
	header {
		display: flex;
		position: relative;
		height: 100vh;
		width: 100vw;
		align-items: center;
		justify-content: center;
		text-align: center;
		background-image: url('$lib/assets/img/img1.jpg');
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
		background-attachment: fixed;
		z-index: 999;
	}

	.hero-content {
		background: var(--back_Hallow_Dark);
		padding: var(--size-1);

		& h1,
		& h2,
		p {
			margin: var(--size-1) 0;
		}

		& img {
			width: 80%;
			border-radius: var(--rad-Sm);

			@media (min-width: 768px) {
				width: 50%;
			}
		}

		@media screen and (min-width: 768px) {
			& h1,
			& h2,
			p {
				margin: var(--size-1) 0;
			}
		}

		@media screen and (min-width: 1024px) {
			& h1,
			& h2,
			p {
				margin: var(--size-1) 0;
			}
		}
	}
</style>
