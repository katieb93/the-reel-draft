import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // Adjust the path based on your project structure
import { useNavigate } from 'react-router-dom';

import './authComponent.css';

const generateGameShareCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let gameShareCode = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    gameShareCode += characters[randomIndex];
  }
  return gameShareCode;
};

function AuthComponentLegacy ({ redirectUrl }) {
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [signedUp, setSignedUp] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSignUp = async () => {
    try {
      if (formData.password.length < 6) {
        setError("Password should be at least 6 characters.");
        return;
      }

      let signUpError = null;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          const result = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                first_name: formData.first_name,
                last_name: formData.last_name,
              },
              redirectTo: redirectUrl
            }
          });

          signUpError = result.error;
          if (!signUpError) break;
        } catch (error) {
          if (retryCount === maxRetries - 1) {
            setError("Request timed out. Please try again later.");
            return;
          }
        }
        retryCount++;
      }

      if (signUpError) {
        setError(signUpError.message);
      } else {
        await handleSignIn();
        setSignedUp(true);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      // Attempt to sign in the user with their email and password
      const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
      });

      if (signInError) {
          setError(signInError.message);
          return;
      }

      const user = sessionData.user;

      if (!user || !user.id) {
          setError("Failed to retrieve user information.");
          return;
      }

      // Generate a game_share_code and create a new game session
      const gameShareCode = generateGameShareCode();
      console.log('Game Share Code:', gameShareCode);
      
      const { data: insertData, error: insertError } = await supabase
          .from('game_sessions')
          .insert([{ user_id: user.id, game_share_code: gameShareCode }])  // Insert user_id and game_share_code
          .select();

      console.log('Insert Data:', insertData);
      console.log('Insert Error:', insertError);

      if (insertError) {
          setError(insertError.message);
          return;
      }

      navigate('/dataGatherLegacy', { state: { user, session: sessionData.session, gameShareCode } });
    } catch (error) {
        setError(error.message);
    }
  };

  if (!signedUp) {
    return (
      <div className="auth-container">
        <h2>Sign Up</h2>
        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
          <button type="submit" className="auth-button">Sign Up</button>
        </form>

        <p>Already have an account? <button className="switch-button" onClick={() => setSignedUp(true)}>Sign In</button></p>

        {error && <p className="error-message">{error}</p>}
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="auth-button">Sign In</button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default AuthComponentLegacy;
