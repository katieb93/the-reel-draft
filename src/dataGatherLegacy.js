import React, { useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './dataGather.css';
import PlayersData from './infoForm.js';
import PlayerNames from './playerNames.js';
import { supabase } from './supabaseClient.js';

// Create a context to store the form data
const FormDataContext = createContext();

function DataGatherLegacy() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [gameSession, setGameSession] = useState(null); // Store the game session

    // Function to generate a game share code
    const generateGameShareCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let gameShareCode = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            gameShareCode += characters[randomIndex];
        }
        return gameShareCode;
    };

    // Function to create a game session
    const createGameSession = async (user) => {
        try {
            const gameShareCode = generateGameShareCode();
            console.log('Game Share Code:', gameShareCode);

            const { data: insertData, error: insertError } = await supabase
                .from('game_sessions')
                .insert([{ user_id: user.id, game_share_code: gameShareCode }]) // Insert user_id and game_share_code
                .select();

            if (insertError) {
                throw insertError;
            }

            console.log('Insert Data:', insertData);
            return insertData[0]; // Assuming you need the inserted game session

        } catch (error) {
            setError(error.message);
            console.error("Error creating game session:", error.message);
            return null;
        }
    };

    // Function to handle form submission
    const handleFormSubmit = async (data) => {
        try {
            setFormData(data);

            // Fetch the user info using supabase.auth.getUser()
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) {
                throw authError;
            }

            if (!user || !user.id) {
                setError("Failed to retrieve user information.");
                return;
            }

            // Create a new game session when the form is submitted
            const gameSession = await createGameSession(user);
            if (!gameSession) {
                return;
            }

            // Store the game session for later use
            setGameSession(gameSession);
            setFormSubmitted(true);

        } catch (error) {
            setError(error.message);
        }
    };

    // Function to handle form completion
    const handleFormCompletion = async (state) => {
        try {
            setFormData(state);
            navigate('/playersInOrderLegacy', { state: { formData: state, gameSession } });
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <FormDataContext.Provider value={formData}>
            <div className='home-root'>
                {!formSubmitted && <PlayersData onSubmit={handleFormSubmit} />}
                {formSubmitted && <PlayerNames formData={formData} onSubmit={handleFormCompletion} />}
            </div>
            {error && <div className="error">{error}</div>}
        </FormDataContext.Provider>
    );
}

export default DataGatherLegacy;

// Custom hook to access the year from form data
export function useYear() {
    const formData = useContext(FormDataContext);
    
    if (formData && formData.year) {
        return formData.year;
    } else {
        return null;
    }
}
