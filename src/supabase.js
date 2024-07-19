import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://xyzcompany.supabase.co';
const supabaseKey = 'public-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;