import { createClient } from '@supabase/supabase-js';

const PUBLIC_SUPABASE_URL = 'https://INPUTYOURURLHERE.supabase.co';
const PUBLIC_SUPABASE_ANON_KEY = 'YOURANONKEYGOESHERE';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);