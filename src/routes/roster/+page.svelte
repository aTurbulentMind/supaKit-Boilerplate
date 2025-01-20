<script lang="ts">
	import Avatar from '$lib/assets/tools/Avatar.svelte';

	//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

	interface Props {
		data: any;
	}

	let { data }: Props = $props();
	let { supabase, profile, skater } = $state(data);

	//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

	let avatarUrl: string = $state(profile?.avatar_url ?? ''); // Get avatar URL
</script>

<main>
	<header class="head_Line">
		<h1>Test for profile cards</h1>
	</header>

	{#if skater.length > 0}
		<div class="skater-cards">
			{#each skater as skaterItem}
				<div class="skater-card">
					<Avatar {supabase} bind:url={avatarUrl} size={10} showUploadButton={false} />
					<h2>{skaterItem.derby_name}</h2>
					<p><strong>Name:</strong> {skaterItem.first_name} {skaterItem.last_name}</p>
					<p><strong>Player Number:</strong> {skaterItem.player_number}</p>
					<p><strong>Bio:</strong></p>
					<p class="bio">{skaterItem.bio}</p>
				</div>
			{/each}
		</div>
	{:else}
		<p>No profile found.</p>
	{/if}
</main>

<style>
	.skater-cards {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;

		margin: 1rem 20vw;
	}
	.skater-card {
		border: 1px solid #ccc;
		border-radius: 8px;
		padding: 1rem;
		width: 200px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

		& h2 {
			margin: 0 0 0.5rem 0;
			font-size: 1.25rem;
		}

		& p {
			margin: 0.25rem 0;
		}

		& .bio {
			font-size: var(--f_Sm);
		}
	}
</style>
