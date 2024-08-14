import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EnterGameCode.css';

function EnterGameCode() {
    const [gameId, setGameId] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        event.preventDefault();
        setGameId(event.target.value);
    };

    const handleJoinGame = (event) => {
        event.preventDefault();
        // Navigate to the game start page with the entered game ID
        navigate('/legacyGameStart', { state: { gameId } });
    };

    return (
        <div className='enter-game-code-container'>
            <h2>Enter Game Code</h2>
            
            <form onSubmit={(e) => { e.preventDefault(); handleJoinGame(e); }} className='enter-game-code-form'>

                <input
                    type='text'
                    value={gameId}
                    onChange={handleInputChange}
                    placeholder='Enter Game ID'
                    className='game-code-input'
                    required
                />
                <button type='submit' className='join-game-button'>Join Game</button>
            </form>
        </div>
    );
}

export default EnterGameCode;
