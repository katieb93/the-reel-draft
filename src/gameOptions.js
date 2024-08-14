

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient.js'; // Import supabase client
import './gameOptions.css';

function GameOptions() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if the user is logged in
        const checkUser = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Error fetching session:", error);
            }

            if (session && session.user) {
                setIsLoggedIn(true); // Set state to true if the user is logged in
            }
        };

        checkUser();
    }, []);

    const handleNavigation = (event, destination) => {
        event.preventDefault();
        
        if (destination === '/authComponentLegacy' && isLoggedIn) {
            navigate('/dataGatherLegacy');
        } else {
            navigate(destination);
        }
    };

    return (
        <div className='go-container'>
            <div className='go-container-text'>
                <p className='h-go'>How would you like to play?</p>
            </div>

            <div className='info-form-form-go'>
                <div className='form-work form-buttons'>
                    <div className='quick-draft draft-go'>
                        <button
                            className="confirm-button info-form-confirm"
                            type="button"
                            onClick={(event) => handleNavigation(event, '/dataGather')}
                        >
                            quick draft
                        </button>
                        <p className='descrip-go'>Start immediately</p>
                        <hr className='small-divider' />
                        <p className='descrip-go'>No account required!</p>
                    </div>
                    <div className='legacy-draft draft-go'>
                        <button
                            className="confirm-button info-form-confirm"
                            type="button"
                            onClick={(event) => handleNavigation(event, '/authComponentLegacy')}
                        >
                            legacy draft
                        </button>
                        <p className='descrip-go'>Create an account or log in</p>
                        <hr className='small-divider' />
                        <p className='descrip-go'>Save your game and scores!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameOptions;
