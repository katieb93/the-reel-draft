import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient.js'; // Adjust the path based on your project structure
import reelLogo from './reelLogo.svg';
import './navBar.css';
import { useNavigate } from 'react-router-dom'; // Add this import statement


function NavBar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    // Check if the user is logged in
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error);
      }

      if (session && session.user) {
        setUser(session.user); // Set the user state if the user is logged in
      }
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      setUser(null);
      navigate('/home'); // Redirect to the home page after logout
    }
  };

  // const handleAccount = async () => {

  //     navigate('/Account'); // Redirect to the home page after logout
    
  // };


  return (
    <div className="nav">
      <div className="nav-bar">
        <img src={reelLogo} alt="Reel Logo" />
        {user ? (
          <div className="nav-right">
            {/* <div className="account-text">Account</div> */}
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
            {/* <button className="logout-button" onClick={handleAccount}>
              Account
            </button> */}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default NavBar;
