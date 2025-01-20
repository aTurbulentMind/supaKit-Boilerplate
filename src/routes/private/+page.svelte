<script lang="ts">
	interface Props {
		data: any;
	}

	let { data }: Props = $props();
	let { user } = $derived(data);

	let { newMessages } = $state(data);

	$inspect({ newMessages });

	//➖ ➖ ➖ ➖ ➖ 🦖➖ ➖ ➖ 🌟  🌟  🌟

	let selectedMessage = $state('');

	//➖ ➖ ➖ ➖ ➖ 🦖➖ ➖ ➖ 🌟  🌟  🌟

	// Define your formTypeMap
	const formTypeMap = {
		1: 'skater',
		2: 'sponsorship',
		3: 'bouting'
	};

	//➖ ➖ ➖ ➖ ➖ 🦖➖ ➖ ➖ 🌟  🌟  🌟

	const selectMessage = (message) => {
		selectedMessage = message;
	};

	//➖ ➖ ➖ ➖ ➖ 🦖➖ ➖ ➖ 🌟  🌟  🌟

	// Function to get the form type name based on form_type value
	function getFormTypeName(form_type) {
		return formTypeMap[form_type] || 'Unknown Form Type';
	}

	// Function to get the label from formTypeMap
	const getFormTypeLabel = (formType) => formTypeMap[formType] || 'Unknown';

	//➖ ➖ ➖ ➖ ➖ 🦖➖ ➖ ➖ 🌟  🌟  🌟

	// Function to format the date
	function formatDate(dateString) {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit'
		}).format(date);
	}
</script>

<main>
	<header class="head_Line">
		<h1>User: {user?.email}</h1>
	</header>

	<p>These are the unread messages:</p>

	<div class="summary">
		<table class="desktop-table">
			<thead>
				<tr>
					<th>Form Type</th>
					<th>Full Name</th>
					<th>Email</th>
					<th>Submitted At</th>
				</tr>
			</thead>
			<tbody>
				{#each newMessages as message}
					<tr>
						<td>{getFormTypeLabel(message.form_type)}</td>
						<td>{message.full_name}</td>
						<td>{message.email}</td>
						<td> {formatDate(message.created_at)}</td>
						<td><button class="ripple-btn" onclick={() => selectMessage(message)}>View</button></td>
					</tr>
				{/each}
			</tbody>
		</table>

		{#each newMessages as message}
			<div class="mobile-cards">
				<div class="card">
					<div><strong>Form Type:</strong> {getFormTypeLabel(message.form_type)}</div>
					<div><strong>Full Name:</strong> {message.full_name}</div>
					<div><strong>Email:</strong> {message.email}</div>

					<div><strong>Submitted At:</strong> <br /> {formatDate(message.created_at)}</div>

					<button class="ripple-btn" onclick={() => selectMessage(message)}>View</button>
				</div>
			</div>
		{/each}
	</div>

	{#if selectedMessage}
		<div class="detail-grid">
			{#if selectedMessage.form_type}
				<div><strong>Form Type:</strong> {getFormTypeName(selectedMessage.form_type)}</div>
			{/if}

			{#if selectedMessage.full_name}
				<div><strong>Full Name:</strong> {selectedMessage.full_name}</div>
			{/if}

			{#if selectedMessage.derby_name}
				<div><strong>Derby Name:</strong> {selectedMessage.derby_name}</div>
			{/if}

			{#if selectedMessage.email}
				<div><strong>Email:</strong> {selectedMessage.email}</div>
			{/if}

			{#if selectedMessage.phone_number}
				<div><strong>Phone Number:</strong> {selectedMessage.phone_number}</div>
			{/if}

			{#if selectedMessage.business_name}
				<div><strong>Business Name:</strong> {selectedMessage.business_name}</div>
			{/if}

			{#if selectedMessage.league_name}
				<div><strong>League Name:</strong> {selectedMessage.league_name}</div>
			{/if}

			{#if selectedMessage.compliant_league !== null}
				<div>
					<strong>Compliant League:</strong>
					{selectedMessage.compliant_league ? 'Yes' : 'No'}
				</div>
			{/if}

			{#if selectedMessage.insurance_status !== null}
				<div>
					<strong>Insurance Status:</strong>
					{selectedMessage.insurance_status ? 'Yes' : 'No'}
				</div>
			{/if}

			{#if selectedMessage.preferred_date}
				<div><strong>Preferred Date:</strong> {selectedMessage.preferred_date}</div>
			{/if}

			{#if selectedMessage.played_together !== null}
				<div>
					<strong>Played Together:</strong>
					{selectedMessage.played_together ? 'Yes' : 'No'}
				</div>
			{/if}

			{#if selectedMessage.comments}
				<div class="full-width"><strong>Comments:</strong> {selectedMessage.comments}</div>
			{/if}

			{#if selectedMessage.submitted_at}
				<div><strong>Submitted At:</strong> {formatDate(selectedMessage.submitted_at)}</div>
			{/if}

			<div>
				<form action="?/updateMessageViewed" method="post">
					<label>
						Has been viewed:
						<input type="checkbox" name="been_viewed" bind:checked={selectedMessage.viewed} />
					</label>
					<input type="hidden" name="messageId" value={selectedMessage.vstr_id} />
					<button type="submit">Update</button>
				</form>
			</div>

			<button onclick={() => (selectedMessage = null)} class="ripple-btn">Close Message</button>
		</div>
	{/if}
</main>

<!--svelte-ignore css_unused_selector -->
<style>
	h1 {
		text-align: center;
		margin: var(--size-4);
		width: 100vw;
	}

	.whatsUp {
		display: flex;
		/* justify-content: center; */
		align-items: center;
		margin: var(--space-Side);
	}

	/* Account  */
	.classicForm {
		margin: 10px auto;
		color: var(--txt-1);
		width: 80vw;
	}

	/* Message Box  */

	.messageBox {
		margin: 10vh auto;
	}

	.summary {
		margin: var(--space-Full);

		@media screen and (min-width: 768px) {
			margin: var(--space-Top);
		}
	}

	.desktop-table {
		display: none;

		@media screen and (min-width: 768px) {
			display: block;
			width: fit-content;

			margin: var(--space-Sm);
			border-collapse: collapse;
			background-color: #1a1a1a;
			color: var(--error);
		}
	}

	.desktop-table th,
	.desktop-table td {
		padding: 12px;
		border: 2px solid var(--error);
	}

	.desktop-table th {
		background-color: #333;
		text-align: left;
	}

	.desktop-table tr:nth-child(even) {
		background-color: #2a2a2a;
	}

	.desktop-table tr:hover {
		background-color: #444;
	}

	.filter-options {
		margin: var(--space-Full);

		@media screen and (min-width: 1024px) {
			margin: var(--space-Sm);
		}
	}

	.mobile-cards {
		display: block;
		align-items: center;
		justify-content: center;
		background-color: var(--bg-2);
		color: var(--txt-1);
		width: fit-content;
		padding: var(--size-3);
		margin: var(--size-6);
		border: 2px solid var(--error);

		& p {
			margin: var(--size-1);
		}

		@media screen and (min-width: 768px) {
			display: none;
		}
	}

	.detail-grid {
		display: block;
		position: fixed;
		bottom: 5vh;
		left: 50%;
		transform: translateX(-50%);
		width: 100vw;
		max-width: 700px;
		padding: 1.5rem;
		background: var(--bg-1);
		color: var(--error);
		border: 2px solid var(--error);

		& div {
			padding: 0.5rem 0;
			border-bottom: 1px solid var(--bg-2);
		}

		& p {
			margin: var(--size-1);
		}

		& div:last-child {
			border-bottom: none;
		}

		& button {
			margin-top: 1rem;
			width: 100%;
			padding: 0.75rem;
			background: transparent;
			border: 2px solid #00ff00;
			color: #00ff00;
			font-family: inherit;
			font-size: 1rem;
			cursor: pointer;
			transition: background 0.3s ease;

			&:hover {
				background: #00ff00;
				color: #222;
			}
		}
	}

	/* Food link */

	.dinner-hunt {
		& h2,
		p,
		button {
			margin: var(--space-Side);
		}
	}

	/* Logout  */

	.button-Skew {
		display: flex;
		padding: 0.5em 1em;
		margin: var(--space-Side);
		right: 0;
		z-index: 1;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.detail-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
