// import React, { useState, useEffect } from 'react';
// import { supabase } from './supabaseClient'; // Adjust the path based on your project structure
// import './Account.css'; // Import the CSS file for styling

// function Account() {
//   const [user, setUser] = useState(null);
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       // Fetch session and user details
//       const { data: { session }, error } = await supabase.auth.getSession();

//       if (session && session.user) {
//         setUser(session.user);

//         // Fetch user profile from the database
//         const { data, error: profileError } = await supabase
//           .from('users')
//           .select('raw_user_meta_data')
//           .eq('id', session.user.id)
//           .single();

//         if (profileError) {
//           console.error('Error fetching user profile:', profileError);
//         } else if (data) {
//           // Fill in the state variables with current user data
//           const { first_name, last_name } = data.raw_user_meta_data;
//           setFirstName(first_name || '');
//           setLastName(last_name || '');
//           setEmail(session.user.email || '');
//         }
//       } else if (error) {
//         console.error("Error fetching session:", error);
//       }
//     };

//     fetchUserDetails();
//   }, []);

//   const handleUpdateProfile = async () => {
//     setLoading(true);
//     try {
//       const { error: updateError } = await supabase.auth.updateUser({
//         email,
//         password,
//         data: { first_name: firstName, last_name: lastName },
//       });

//       if (updateError) {
//         console.error('Error updating user profile:', updateError);
//       } else {
//         console.log('Profile updated successfully');
//         // Optionally, re-fetch user details or show a success message
//       }
//     } catch (error) {
//       console.error('Unexpected error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>Account Settings</h2>
//       <div className="auth-form">
//         <label>First Name:</label>
//         <input
//           type="text"
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//         />
//       </div>
//       <div className="auth-form">
//         <label>Last Name:</label>
//         <input
//           type="text"
//           value={lastName}
//           onChange={(e) => setLastName(e.target.value)}
//         />
//       </div>
//       <div className="auth-form">
//         <label>Email:</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//       </div>
//       <div className="auth-form">
//         <label>Password:</label>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//       </div>
//       <button
//         className="auth-button"
//         onClick={handleUpdateProfile}
//         disabled={loading}
//       >
//         {loading ? 'Updating...' : 'Update Profile'}
//       </button>
//     </div>
//   );
// }

// export default Account;
