// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './legacyGameStart.css';

// function LegacyGameStart() {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { user, gameId } = location.state || {};
//     // const userEmail = user?.email || 'No user email';

//     const handleNavigation = (event, destination) => {
//         event.preventDefault();
//         navigate(destination);
//     };

//     return (
//         <div className='go-container-l'>
//             <div className='info-form-form-l'>
//                 <div className='go-container-text'>
//                     <p className='game-id'>Share this code with all players to let them join the game!</p>
//                     <p className='game-id game-id-b'>Game ID: {gameId}</p>
//                 </div>
//                 <button
//                     className="confirm-button-l"
//                     type="button"
//                     onClick={(event) => handleNavigation(event, '/dataGather')}
//                 >
//                     quick draft
//                 </button>
//             </div>

//         </div>
//     );
// }

// export default LegacyGameStart;

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './legacyGameStart.css';

function LegacyGameStart() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, gameId } = location.state || {};
    // const userEmail = user?.email || 'No user email';

    const handleNavigation = (event, destination) => {
        event.preventDefault();
        navigate(destination);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(gameId).then(() => {
            alert('Game ID copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <div className='go-container-l'>
            <div className='info-form-form-l'>
                <div className='go-container-text'>
                    <p className='game-id game-id-text'>
                        Share this code with all players to let them join the game!
                    </p>
                    <div className='game-id-container'>
                        <div className='game-id-box'>
                            <p className='game-id game-id-b'>
                                Go to this link: <a href="http://localhost:3000/EnterGameCode">thereeldraft.com/entergamecode</a>
                            </p>
                            <p className='game-id game-id-b'>
                                Game ID: {gameId}
                            </p>
                        </div>
                        <button className='copy-button-l' onClick={handleCopy}>
                            Copy
                        </button>
                    </div>
                </div>
                <button
                    className='confirm-button-l'
                    type='button'
                    onClick={(event) => handleNavigation(event, '/EnterGameCode')}
                >
                    legacy<br />draft
                </button>
            </div>
        </div>
    );
};



export default LegacyGameStart;
