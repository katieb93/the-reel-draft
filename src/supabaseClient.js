

// // export const supabase = createClient(supabaseUrl, supabaseKey);

import { createClient } from '@supabase/supabase-js';

// // Retrieve environment variables
// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Retrieve environment variables
const supabaseUrl = 'https://hgbprqhbucqlvuhvvbvn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnYnBycWhidWNxbHZ1aHZ2YnZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI5MTc4MDMsImV4cCI6MjAzODQ5MzgwM30.gKmN2stfPu5bb0DpeNlYNuskXrBETuIDP6un540qXcE';


// Log values to ensure they are loaded
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey);

// Check if the environment variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anon key are required.');
}

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
