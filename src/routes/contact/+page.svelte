<script lang="ts">
	import { enhance } from '$app/forms';

	//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

	let selectedForm = $state('');

	//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		formData.append('formType', selectedForm);

		window.location.href = '/contact/success'; // Client-side redirect
	}
</script>

<header class="head_Line">
	<h1>test for contact forms</h1>
</header>

<main>
	<h2>This sends messages to a contact or forms table</h2>

	<p>Please select a way to communicate with the team:</p>
	<div class="selector">
		<label for="formSelector">Choose a form:</label>
		<select id="formSelector" bind:value={selectedForm}>
			<option value="">-- Select a form --</option>
			<option value="skater">Visiting Skater Information Form</option>
			<option value="sponsorship">Sponsorship Form</option>
			<option value="bouting">Request Bouting Date Form</option>
		</select>
	</div>

	<!-- Visiting Skater form  -->
	{#if selectedForm === 'skater'}
		<form
			class="classicForm"
			method="post"
			action="?/submit"
			use:enhance
			enctype="multipart/form-data"
			onsubmit={handleSubmit}
		>
			<input type="hidden" name="formType" value="skater" />
			<h2>Visiting Skater Information Form</h2>

			<label class="input-group" for="fullName">
				<span>Full Name *</span>
				<input type="text" id="fullName" name="fullName" placeholder="Your full name" required />
			</label>

			<label class="input-group" for="derbyName">
				<span>Derby Name *</span>
				<input
					type="text"
					id="derbyName"
					name="derbyName"
					placeholder="Your derby nickname"
					required
				/>
			</label>

			<label class="input-group" for="email">
				<span>Email *</span>
				<input type="email" id="email" name="email" placeholder="Your email address" required />
			</label>

			<label class="input-group" for="phoneNumber"
				>Phone Number
				<input type="text" id="phoneNumber" name="phoneNumber" placeholder="(555) - 867 - 5309" />
			</label>

			<fieldset class="radio-group">
				<legend>Is it a WFTDA compliant league? </legend>
				<label><input type="radio" name="compliantLeague" value="yes" required /> Yes</label>
				<label><input type="radio" name="compliantLeague" value="no" required /> No</label>
			</fieldset>

			<fieldset class="radio-group">
				<legend>Do you have active WFTDA Insurance? </legend>
				<label><input type="radio" name="insuranceStatus" value="yes" required /> Yes</label>
				<label><input type="radio" name="insuranceStatus" value="no" required /> No</label>
			</fieldset>

			<label class="input-group" for="comments"
				>Comments or Questions
				<textarea id="comments" name="comments"></textarea>
			</label>

			<button class="W-button" type="submit">Submit 😊</button>
			<aside>* Indicates required field</aside>
		</form>
	{/if}

	<!-- Sponsorship form -->
	{#if selectedForm === 'sponsorship'}
		<form
			class="classicForm"
			method="post"
			action="?/submit"
			use:enhance
			enctype="multipart/form-data"
			onsubmit={handleSubmit}
		>
			<input type="hidden" name="formType" value="sponsorship" />
			<h2>Sponsorship Form</h2>

			<label class="input-group" for="fullName">
				<span>Full Name *</span>
				<input type="text" id="fullName" name="fullName" placeholder="Your full name" required />
			</label>

			<label class="input-group" for="businessName"
				><span> Business Name * </span>
				<input
					type="text"
					id="businessName"
					name="businessName"
					placeholder="Your business name"
					required
				/>
			</label>

			<label class="input-group" for="phoneNumber"
				>Phone Number
				<input type="text" id="phoneNumber" name="phoneNumber" placeholder="(555) - 867 - 5309" />
			</label>

			<label class="input-group" for="email">
				<span>Email *</span>
				<input type="email" id="email" name="email" placeholder="Your email address" required />
			</label>

			<label class="input-group" for="comments"
				>Comments or Questions
				<textarea id="comments" name="comments" placeholder="Your comments or questions"></textarea>
			</label>

			<button class="W-button" type="submit">Submit 😊</button>
			<aside>* Indicates required field</aside>
			<!-- <p>Sponsorship Packet</p> -->
		</form>
	{/if}

	<!-- Bouting form -->
	{#if selectedForm === 'bouting'}
		<form
			class="classicForm"
			method="post"
			action="?/submit"
			use:enhance
			enctype="multipart/form-data"
			onsubmit={handleSubmit}
		>
			<input type="hidden" name="formType" value="bouting" />

			<h2>Request Bouting Date</h2>

			<label for="leagueName" class="input-group"
				><span> League Name * </span>
				<input
					type="text"
					id="leagueName"
					name="leagueName"
					placeholder="Your league name"
					required
				/>
			</label>

			<label class="input-group" for="fullName"
				><span> Corespondent Name * </span>
				<input type="text" id="fullName" name="fullName" placeholder="Your name" required />
			</label>

			<label class="input-group" for="phoneNumber"
				>Phone Number
				<input type="text" id="phoneNumber" name="phoneNumber" placeholder="(555) - 867 - 5309" />
			</label>

			<label class="input-group" for="email">
				<span>Email *</span>
				<input type="email" id="email" name="email" placeholder="Your email address" required />
			</label>

			<label class="input-group" for="prefDate"
				><span> Preferred Date * </span>
				<input type="date" id="prefDate" name="prefDate" />
			</label>

			<label class="radio-group" for="playedTogether"
				>Have you played with us before?
				<input type="checkbox" id="playedTogether" name="playedTogether" />
			</label>

			<fieldset class="radio-group">
				<legend> Is it a WFTDA compliant league? *</legend>
				<label><input type="radio" name="compliantLeague" value="yes" required /> Yes</label>
				<label><input type="radio" name="compliantLeague" value="no" required /> No</label>
			</fieldset>

			<fieldset class="radio-group">
				<legend>Do you have active WFTDA Insurance? *</legend>
				<label><input type="radio" name="insuranceStatus" value="yes" required /> Yes</label>
				<label><input type="radio" name="insuranceStatus" value="no" required /> No</label>
			</fieldset>

			<label class="input-group" for="comments"
				>Comments or Questions
				<textarea id="comments" name="comments"></textarea>
			</label>

			<button class="W-button" type="submit">Submit 😊 </button>
			<aside>* Indicates required field</aside>
		</form>
	{/if}
</main>

<!--ignore css-unused-selector-->
<style>
	.selector {
		margin: 10vh 20vw;
	}
	.classicForm {
		margin: 0 auto;

		& .W-button {
			width: 60%;
		}
	}
</style>
