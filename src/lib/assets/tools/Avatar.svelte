<!-- src/routes/account/Avatar.svelte -->
<script lang="ts">
	import { run } from 'svelte/legacy';

	// Importing types and functions from Supabase and Svelte
	import type { SupabaseClient } from '@supabase/supabase-js'
	import { createEventDispatcher } from 'svelte'

	// Exporting component properties

	// Initializing variables
	let avatarUrl: string | null = $state(null)
	let uploading = $state(false)
	let files: FileList = $state()

	// Creating an event dispatcher
	const dispatch = createEventDispatcher()

	// Function to download an image from Supabase storage
	const downloadImage = async (path: string) => {
		try {
			const { data, error } = await supabase.storage.from('avatars').download(path)

			if (error) {
				throw error
			}

			const url = URL.createObjectURL(data)
			avatarUrl = url
		} catch (error) {
			if (error instanceof Error) {
				console.log('Error downloading image: ', error.message)
			}
		}
	}

	// Function to upload an avatar image to Supabase storage
	const uploadAvatar = async () => {
		try {
			uploading = true

			if (!files || files.length === 0) {
				throw new Error('You must select an image to upload.')
			}

			const file = files[0]
			const fileExt = file.name.split('.').pop()
			const filePath = `${Math.random()}.${fileExt}`

			const { error } = await supabase.storage.from('avatars').upload(filePath, file)

			if (error) {
				throw error
			}

			url = filePath
			setTimeout(() => {
				dispatch('upload')
			}, 100)
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message)
			}
		} finally {
			uploading = false
		}
	}

	// Exporting a property to control the visibility of the upload button
	interface Props {
		size?: number;
		url: string;
		supabase: SupabaseClient;
		showUploadButton?: boolean;
	}

	let {
		size = 10,
		url = $bindable(),
		supabase,
		showUploadButton = true
	}: Props = $props();

	// Reactive statement to download image when URL changes
	run(() => {
		if (url) downloadImage(url)
	});
</script>

<div>
	{#if avatarUrl}
		<!-- Display the avatar image if avatarUrl is available -->
		<img
			src={avatarUrl}
			alt={avatarUrl ? 'Avatar' : 'No image'}
			class="avatar image"
			style="height: {size}em; width: {size}em;"
		/>
	{:else}
		<!-- Display a placeholder if no avatar image is available -->
		<div class="avatar no-image" style="height: {size}em; width: {size}em;"></div>
	{/if}
	<!-- Hidden input to store the avatar URL -->
	<input type="hidden" name="avatarUrl" value={url} />
	{#if showUploadButton}
		<!-- Display the upload button if showUploadButton is true -->
		<div style="width: {size}em;" class="uppPoto">
			<label class="button primary block" for="single">
				<!-- Show 'Uploading ...' text if uploading is true, otherwise show 'Upload' -->
				{uploading ? 'Uploading ...' : 'Upload'}
			</label>
			<input
				style="visibility: hidden; position:absolute;"
				type="file"
				id="single"
				accept="image/*"
				bind:files
				onchange={uploadAvatar}
				disabled={uploading}
			/>
		</div>
	{/if}
</div>

<style>
	.uppPoto {
		position: relative;
		display: flex;
		margin: 0 auto;
	}
</style>
