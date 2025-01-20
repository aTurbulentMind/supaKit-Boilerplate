// +page.server.ts

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		await supabase.auth.getUser();
		redirect(303, '/');
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select(`username, full_name, contact,avatar_url`)
		.eq('id', session.user.id)
		.single();

	return { session, profile };
};

export const actions: Actions = {
	update: async ({ request, locals: { supabase, safeGetSession } }) => {
		console.log('Update action triggered');

		const { session } = await safeGetSession();
		// console.log('Session:', session);

		const formData = await request.formData();
		const fullName = formData.get('fullName') as string;
		const username = formData.get('username') as string;
		const contact = formData.get('contact') as string;
		const avatarUrl = formData.get('avatarUrl') as string;

		//➖ ➖ ➖ ➖ ➖ 🦖➖ ➖ ➖ 🌟  🌟  🌟

		const { error } = await supabase.from('profiles').upsert({
			id: session?.user.id,
			full_name: fullName,
			username,
			contact,
			avatar_url: avatarUrl,
			updated_at: new Date()
		});

		if (error) {
			console.error('Error updating profile:', error.message);
			return fail(500, {
				fullName,
				username,
				contact,
				avatarUrl
			});
		}

		console.log('Profile updated successfully');

		return {
			fullName,
			username,
			contact,
			avatarUrl
		};
	},

	//➖ ➖ ➖ ➖ ➖ 🦖➖ ➖ ➖ 🌟  🌟  🌟

	signout: async ({ locals: { supabase, safeGetSession } }) => {
		const { session } = await safeGetSession();
		if (session) {
			await supabase.auth.signOut();
			redirect(303, '/');
		}
	}
};
