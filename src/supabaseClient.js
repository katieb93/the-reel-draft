// import { createClient } from '@supabase/supabase-js';



// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// console.log('Supabase URL:', supabaseUrl);
// console.log('Supabase Anon Key:', supabaseAnonKey);


// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Supabase URL and anon key are required.');
// }

// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// export { supabase };


// // import { createClient } from "@supabase/supabase-js";

// // const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// // const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// // export const supabase = createClient(supabaseUrl, supabaseKey);

import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

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
